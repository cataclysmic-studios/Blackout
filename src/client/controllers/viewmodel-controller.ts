import { Controller, Dependency, OnRender } from "@flamework/core";
import { ReplicatedStorage as Replicated, Workspace as World } from "@rbxts/services";
import { Janitor } from "@rbxts/janitor";
import { waitFor, tween } from "shared/modules/utility";
import { LeanState, Slot, WeaponData, WeaponModel } from "shared/modules/types";
import { RecoilController } from "./recoil-controller";
import { CrosshairController } from "./crosshair-controller";
import { SoundController } from "./sound-controller";
import { EffectsController } from "./effects-controller";
import { Firemode } from "shared/modules/enums";
import { MenuController } from "./menu-controller";
import Signal from "@rbxts/signal";
import ViewModel from "client/components/view-model";

interface FPSState {
  equipped: boolean;
  currentSlot?: Slot;
  weapons: (string | undefined)[];
  weapon: {
    firemode: Firemode;
    ammo: {
      mag: number;
      reserve: number;
    };
  };

  aimed: boolean;
  shooting: boolean;
  reloading: boolean;
  reloadCancelled: boolean;
  inspecting: boolean;

  sprinting: boolean;
  crouched: boolean;
  proned: boolean;
  lean: LeanState;
}

@Controller()
export class ViewmodelController implements OnRender {
  private readonly janitor = new Janitor;
  private viewModel: ViewModel;
  private weaponData?: WeaponData;
  private weaponModel?: WeaponModel;
  private triggerAnim?: AnimationTrack;
  private inspectAnim?: AnimationTrack;
  private reloadAnim?: AnimationTrack;

  public mouseDown = false;
  public readonly events = {
    ammoChanged: new Signal<(ammo: { mag: number; reserve: number; }) => void>()
  }

  public readonly state: FPSState = {
    equipped: false,
    currentSlot: undefined,
    weapons: [],
    weapon: {
      firemode: Firemode.Semi,
      ammo: {
        mag: 0,
        reserve: 0
      }
    },

    aimed: false,
    shooting: false,
    reloading: false,
    reloadCancelled: false,
    inspecting: false,
    sprinting: false,
    crouched: false,
    proned: false,
    lean: 0
  }

  public constructor(
    private readonly crosshair: CrosshairController,
    private readonly sounds: SoundController,
    private readonly recoil: RecoilController,
    private readonly vfx: EffectsController
  ) {
    const cam = World.CurrentCamera!;
    this.viewModel = new ViewModel(Replicated.Character.ViewModel);
    recoil.attach(this.viewModel);
    recoil.attach(cam);

    // proceduralAnims.attach(this.viewModel);
    // proceduralAnims.attach(cam);

    this.janitor.Add(() => {
      this.viewModel.destroy();
      recoil.destroy();
      // proceduralAnims.destroy();
    });
  }

  /**
   * On render function
   * 
   * @hidden
   * @param dt Delta time
   */
  public onRender(dt: number): void {
    this.recoil.update(dt, this.state.aimed);
  }

  /**
   * Attach all Motor6D's inside of the weapon to the ViewMOde
   * 
   * @param model Weapon model
   */
  private attachMotors(model: WeaponModel): void {
    const parts = <BasePart[]>model.GetDescendants().filter(d => d.IsA("BasePart"));
    for (const part of parts)
      part.Anchored = false;

    const motors = <Motor6D[]>model.GetDescendants().filter(d => d.IsA("Motor6D"));
    for (const motor of motors)
      motor.Part0 = model.Trigger;

    model.Trigger.ViewModel.Part0 = this.viewModel.root;
    do task.wait(); while (model.Trigger.ViewModel.Part0 !== this.viewModel.root);
  }

  /**
   * Add weapon into inventory slot
   * 
   * @param name Weapon
   * @param slot Inventory slot
   */
  public addWeapon(name: string, slot: Slot): void {
    this.state.weapons[slot - 1] = name;
  }

  /**
   * Remove weapon from inventory slot
   * 
   * @param slot Inventory slot
   */
  public removeWeapon(slot: Slot): void {
    this.state.weapons[slot - 1] = undefined;
  }

  /**
   * Unequip currently equipped weapon
   */
  public unequip(): void {
    this.state.equipped = false;
    this.viewModel.setEquipped(undefined);
    this.weaponData = undefined;

    this.weaponModel?.Destroy();
    this.weaponModel = undefined;

    this.crosshair.toggle();
    this.crosshair.toggleDot();
    this.state.currentSlot = undefined;
    // const unequipAnim = this.viewModel.playAnimation("Unequip")!;
  }

  /**
   * Equip weapon in inventory slot
   * 
   * @param slot Inventory slot
   */
  public equip(slot: Slot): void {
    const menu = Dependency<MenuController>();
    if (menu.active) return;

    const weaponName = this.state.weapons[slot - 1];
    if (!weaponName) return;

    this.crosshair.toggle();
    this.crosshair.toggleDot();
    const model = waitFor<WeaponModel>(Replicated.Weapons, weaponName).Clone();
    this.attachMotors(model);

    this.viewModel.setEquipped(model);
    this.weaponData = this.viewModel.data!;
    this.weaponModel = model;
    this.state.currentSlot = slot;

    for (const offset of model.Offsets.GetChildren()) {
      const cfm = <CFrameValue>offset.Clone();
      cfm.Value = new CFrame;
      cfm.Parent = model.CFrameManipulators;
    }

    this.state.weapon.firemode = this.weaponData.stats.firemodes[0];
    this.state.weapon.ammo.mag = this.weaponData.stats.magSize;
    this.state.weapon.ammo.reserve = this.weaponData.stats.reserve;
    this.events.ammoChanged.Fire(this.state.weapon.ammo);

    this.crosshair.maxSize = this.weaponData.crossExpansion.max;
    this.crosshair.setSize(this.weaponData.crossExpansion.hip);

    model.Parent = this.viewModel.instance;
    const equipAnim = this.viewModel.playAnimation("Equip", false)!;
    this.viewModel.playAnimation("Idle");

    equipAnim.GetMarkerReachedSignal("BoltBack").Once(() => this.weaponModel?.Sounds.SlidePull.Play());
    equipAnim.GetMarkerReachedSignal("BoltClosed").Once(() => this.weaponModel?.Sounds.SlideRelease.Play());

    let conn: RBXScriptConnection;
    conn = equipAnim.Stopped.Connect(() => {
      this.state.equipped = true;
      conn.Disconnect();
    });
    equipAnim.Play();
  }

  /**
   * Cancel weapon inspection
   */
  public cancelInspect(): void {
    if (!this.state.inspecting) return;
    this.inspectAnim?.Stop();
  }

  /**
   * Begin weapon inspection
   */
  public inspect(): void {
    if (!this.state.equipped) return;
    if (this.state.inspecting) return;
    if (this.state.reloading) return;
    if (this.state.shooting) return;

    this.state.inspecting = true;
    if (this.state.aimed) {
      this.aim(false);
      task.wait(.1);
    }

    this.inspectAnim = this.viewModel.playAnimation("Inspect", false)!;
    let conn: RBXScriptConnection;
    conn = this.inspectAnim.Stopped.Connect(() => {
      this.state.inspecting = false;
      conn.Disconnect();
    });
    this.inspectAnim.Play();
  }

  /**
   * Cancel reloading and inspection
   */
  public melee(): void {
    if (!this.state.equipped) return;
    if (!this.weaponModel || !this.weaponData) return;
    this.cancelReload();
    this.cancelInspect();
  }

  /**
   * Cancel reloading
   */
  public cancelReload(): void {
    if (!this.state.equipped) return;
    if (!this.weaponModel || !this.weaponData) return;
    if (!this.state.reloading) return;
    this.state.reloadCancelled = true;
    this.reloadAnim?.Stop();
    this.state.reloadCancelled = false;
  }

  /**
   * Begin reloading
   */
  public reload(): void {
    if (!this.state.equipped) return;
    if (!this.weaponModel || !this.weaponData) return;
    if (this.state.reloading) return;
    if (this.state.inspecting) return;
    if (this.state.aimed) return; //aiming reload anim
    if (this.state.shooting) return;
    if (this.state.weapon.ammo.mag === this.weaponData.stats.magSize + this.weaponData.stats.chamber) return;
    if (this.state.weapon.ammo.reserve === 0) return;
    this.state.reloading = true;

    // this.reloadAnim = this.viewModel.playAnimation("Reload")!.Ended.Connect(() => {});
    if (this.state.reloadCancelled) return;
    const magBeforeReload = this.state.weapon.ammo.mag;
    this.state.weapon.ammo.mag = this.weaponData.stats.magSize;
    if (magBeforeReload > 0)
      this.state.weapon.ammo.mag += this.weaponData.stats.chamber;

    const ammoUsed = this.state.weapon.ammo.mag - magBeforeReload;
    this.state.weapon.ammo.reserve -= ammoUsed;

    if (this.state.weapon.ammo.reserve < 0) {
      this.state.weapon.ammo.mag += this.state.weapon.ammo.reserve;
      this.state.weapon.ammo.reserve = 0;
    }

    this.events.ammoChanged.Fire(this.state.weapon.ammo);
    this.state.reloading = false;
  }

  /**
   * Set aiming state
   * 
   * @param on Aiming
   */
  public aim(on: boolean): void {
    if (!this.state.equipped) return;
    if (this.state.aimed === on) return;
    if (!this.weaponModel || !this.weaponData) return;
    this.cancelInspect();
    this.state.aimed = on;

    this.weaponModel.Sounds[on ? "AimDown" : "AimUp"].Play();

    const info = new TweenInfo(.25, Enum.EasingStyle.Quad, Enum.EasingDirection[on ? "Out" : "InOut"])
    tween(this.viewModel.getManipulator("Aim"), info, {
      Value: on ? this.weaponModel.Offsets.Aim.Value : new CFrame
    });

    this.crosshair.setSize(on ? 0 : this.weaponData.crossExpansion.hip);
  }

  /**
   * Toggle trigger pull
   * 
   * @param on Pulling trigger
   */
  public toggleTriggerPull(on: boolean): void {
    if (!this.state.equipped) return;

    const fadeSpd = .05;
    if (on) {
      this.triggerAnim = this.viewModel.playAnimation("Trigger");
      this.triggerAnim!.AdjustWeight(undefined, fadeSpd);
    } else {
      this.triggerAnim?.Stopped.Once(() => this.triggerAnim?.Destroy());
      this.triggerAnim?.Stop();
      this.triggerAnim = undefined;
    }
  }

  /**
   * Shoot weapon
   */
  public shoot(): void {
    if (!this.state.equipped) return;
    if (this.state.shooting) return;
    this.cancelReload();
    this.cancelInspect();

    if (this.state.weapon.ammo.mag === 0) {
      this.weaponModel!.Sounds.EmptyClick.Play();
      this.reload();
      return;
    }

    const pew = () => {
      if (!this.state.equipped) return;
      if (!this.weaponModel || !this.weaponData) return;
      if (this.state.weapon.ammo.mag === 0) {
        this.weaponModel!.Sounds.EmptyClick.Play();
        this.mouseDown = false;
        this.state.shooting = false;
        this.reload();
        return;
      }

      this.state.weapon.ammo.mag--;
      this.events.ammoChanged.Fire(this.state.weapon.ammo);

      this.calculateRecoil();
      this.vfx.createTracer(this.weaponModel, this.weaponData);
      this.vfx.createMuzzleFlash(this.weaponModel);
      this.sounds.clone(<Sound>this.weaponModel.Sounds.WaitForChild("Fire"));

      const boltAnim = this.viewModel.playAnimation("Shoot", false)!;
      boltAnim.GetMarkerReachedSignal("SlideBack").Once(() => this.vfx.createEjectedShell(this.weaponData!.shell, this.weaponModel!));
      boltAnim.Play();

      if (!this.state.aimed)
        this.crosshair.pulse(this.weaponData);
    }

    const fireSpeed = 60 / this.weaponData!.stats.rpm;
    this.state.shooting = true;
    switch (this.state.weapon.firemode) {
      case Firemode.Bolt:
      case Firemode.Semi:
        pew();
        task.wait(fireSpeed);
        break;
      case Firemode.Auto:
        do {
          pew();
          task.wait(fireSpeed);
        } while (this.mouseDown);
        break;
      case Firemode.Burst:
        for (
          let i = 0;
          i <= (this.weaponData!.stats.burstCount ?? 3) && this.mouseDown;
          i++
        ) {
          pew();
          task.wait(fireSpeed);
        }
        break;

      default:
        throw error("Invalid firemode: " + tostring(this.state.weapon.firemode));
    }

    this.state.shooting = false;
  }

  /**
   * Calculate recoil
   */
  private calculateRecoil(): void {
    if (!this.state.equipped) return;
    if (!this.weaponData) return;

    const r = new Random;
    const torqueDir = r.NextInteger(1, 2) === 1 ? 1 : -1;
    const [cy, cx, cz] = this.weaponData.recoil.camera;
    const cforce = new Vector3(
      r.NextNumber(cy[0], cy[1]),
      r.NextNumber(cx[0], cx[1]),
      r.NextNumber(cz[0], cz[1])
    );

    const [my, mx, mz] = this.weaponData.recoil.model;
    const mforce = new Vector3(
      r.NextNumber(my[0], my[1]),
      r.NextNumber(mx[0], mx[1]),
      r.NextNumber(mz[0], mz[1])
    );

    let stabilization = 1;
    if (this.state.aimed)
      stabilization += 0.8;

    this.recoil.kick(this.weaponData, cforce, "Camera", stabilization, torqueDir);
    this.recoil.kick(this.weaponData, mforce, "Model", stabilization, torqueDir);
    task.delay(.12, () => {
      this.recoil.kick(this.weaponData!, cforce.mul(-1), "Camera", stabilization, torqueDir);
      this.recoil.kick(this.weaponData!, mforce.mul(-1), "Model", stabilization, torqueDir);
    });
  }
}
