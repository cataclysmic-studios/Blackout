import { Components } from "@flamework/components";
import { Controller, Dependency, OnRender, OnStart } from "@flamework/core";
import { Janitor } from "@rbxts/janitor";
import {
  ReplicatedStorage as Replicated,
  Workspace as World,
} from "@rbxts/services";
import { $error } from "rbxts-transform-debug";
import { Firemode } from "shared/enums";
import {
  FPSState,
  Slot,
  WeaponData,
  WeaponModel,
} from "shared/interfaces/game-types";
import { tween, waitFor } from "shared/utility";

import Signal from "@rbxts/signal";
import GunEffects from "client/components/gun-effects";
import Recoil from "client/components/recoil";
import ViewModel from "client/components/view-model";
import { AppController } from "./apps";
import { CrosshairController } from "./crosshair";
import { SoundController } from "./sound-player";

@Controller()
export class FPSController implements OnStart, OnRender {
  private readonly janitor = new Janitor();
  private readonly camera = World.CurrentCamera!;
  private vmRecoil?: Recoil;
  private camRecoil?: Recoil;
  private viewModel?: ViewModel;
  private currentWeapon?: {
    vfx: GunEffects;
    data: WeaponData;
    model: WeaponModel;
    anims: {
      trigger?: AnimationTrack;
      inspect?: AnimationTrack;
      reload?: AnimationTrack;
    };
  };

  public mouseDown = false;
  public readonly leanOffset = new Instance("CFrameValue");
  public readonly events = {
    ammoChanged: new Signal<(ammo: { mag: number; reserve: number }) => void>(),
  };

  public readonly state: FPSState = {
    equipped: false,
    currentSlot: undefined,
    weapons: [],
    weapon: {
      firemode: Firemode.Semi,
      ammo: {
        mag: 0,
        reserve: 0,
      },
    },

    aimed: false,
    shooting: false,
    reloading: false,
    reloadCancelled: false,
    inspecting: false,
    sprinting: false,
    crouched: false,
    proned: false,
    lean: 0,
  };

  public constructor(
    private readonly crosshair: CrosshairController,
    private readonly sounds: SoundController
  ) {}

  public onStart(): void {
    const components = Dependency<Components>();
    this.viewModel = components.addComponent<ViewModel>(
      Replicated.Character.ViewModel.Clone()
    );
    this.vmRecoil = components.addComponent<Recoil>(this.viewModel.instance);
    this.camRecoil = components.addComponent<Recoil>(World.CurrentCamera!);

    // proceduralAnims.attach(this.viewModel);
    // proceduralAnims.attach(cam);

    this.janitor.Add(this.viewModel, "destroy");
    this.janitor.Add(this.vmRecoil, "destroy");
    this.janitor.Add(this.camRecoil, "destroy");
  }

  public onRender(dt: number): void {
    if (!this.viewModel) return;
    this.vmRecoil?.update(dt, this.state.aimed, this.leanOffset.Value);
    this.updateCamera(dt);
  }

  /**
   * Updates everything to do with the camera
   *
   * @param dt
   */
  private updateCamera(dt: number): void {
    if (!this.viewModel) return;
    this.camRecoil?.update(dt, this.state.aimed, this.leanOffset.Value);
  }

  /**
   * Attach all Motor6D's inside of the weapon to the ViewModel
   *
   * @param model Weapon model
   */
  private attachMotors(model: WeaponModel): void {
    const parts = model
      .GetDescendants()
      .filter((d): d is BasePart => d.IsA("BasePart"));
    for (const part of parts) part.Anchored = false;

    const motors = model
      .GetDescendants()
      .filter((d): d is Motor6D => d.IsA("Motor6D"));
    for (const motor of motors) motor.Part0 = model.Trigger;

    model.Trigger.ViewModel.Part0 = this.viewModel!.root;
    do task.wait();
    while (model.Trigger.ViewModel.Part0 !== this.viewModel!.root);
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
    this.viewModel!.setEquipped(undefined);
    this.currentWeapon?.model.Destroy();
    this.currentWeapon = undefined;

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
    const apps = Dependency<AppController>();
    if (apps.isShowing("Menu")) return;

    const weaponName = this.state.weapons[slot - 1];
    if (weaponName === undefined) return;

    this.crosshair.toggle();
    this.crosshair.toggleDot();
    const model = waitFor<WeaponModel>(Replicated.Weapons, weaponName).Clone();
    this.attachMotors(model);

    const components = Dependency<Components>();
    this.viewModel!.setEquipped(model);
    this.currentWeapon = {
      model: model,
      data: this.viewModel!.data!,
      vfx: components.addComponent<GunEffects>(model),
      anims: {},
    };

    this.state.currentSlot = slot;

    for (const offset of model.Offsets.GetChildren()) {
      const cfm = offset.Clone() as CFrameValue;
      cfm.Value = new CFrame();
      cfm.Parent = model.CFrameManipulators;
    }

    this.state.weapon.firemode = this.currentWeapon.data.stats.firemodes[0];
    this.state.weapon.ammo.mag = this.currentWeapon.data.stats.magSize;
    this.state.weapon.ammo.reserve = this.currentWeapon.data.stats.reserve;
    this.events.ammoChanged.Fire(this.state.weapon.ammo);

    this.crosshair.maxSize = this.currentWeapon.data.crossExpansion.max;
    this.crosshair.setSize(this.currentWeapon.data.crossExpansion.hip);

    model.Parent = this.viewModel!.instance;
    const equipAnim = this.viewModel!.playAnimation("Equip", false)!;
    this.viewModel!.playAnimation("Idle");

    equipAnim
      .GetMarkerReachedSignal("BoltBack")
      .Once(() => this.currentWeapon?.model.Sounds.SlidePull.Play());
    equipAnim
      .GetMarkerReachedSignal("BoltClosed")
      .Once(() => this.currentWeapon?.model.Sounds.SlideRelease.Play());

    const conn = equipAnim.Stopped.Connect(() => {
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
    this.currentWeapon?.anims.inspect?.Stop();
  }

  /**
   * Begin weapon inspection
   */
  public inspect(): void {
    if (!this.state.equipped) return;
    if (this.state.inspecting) return;
    if (this.state.reloading) return;
    if (this.state.shooting) return;
    if (!this.currentWeapon) return;

    this.state.inspecting = true;
    if (this.state.aimed) {
      this.aim(false);
      task.wait(0.1);
    }

    this.currentWeapon.anims.inspect = this.viewModel!.playAnimation(
      "Inspect",
      false
    )!;
    const conn = this.currentWeapon.anims.inspect.Stopped.Connect(() => {
      this.state.inspecting = false;
      conn.Disconnect();
    });
    this.currentWeapon.anims.inspect.Play();
  }

  /**
   * Cancel reloading and inspection
   */
  public melee(): void {
    if (!this.state.equipped) return;
    if (!this.currentWeapon) return;
    this.cancelReload();
    this.cancelInspect();
  }

  /**
   * Cancel reloading
   */
  public cancelReload(): void {
    if (!this.state.equipped) return;
    if (!this.state.reloading) return;
    if (!this.currentWeapon) return;
    this.state.reloadCancelled = true;
    this.currentWeapon.anims.reload?.Stop();
    this.state.reloadCancelled = false;
  }

  /**
   * Begin reloading
   */
  public reload(): void {
    if (!this.state.equipped) return;
    if (this.state.reloading) return;
    if (this.state.inspecting) return;
    if (this.state.aimed) return; //aiming reload anim
    if (this.state.shooting) return;

    if (!this.currentWeapon) return;
    if (
      this.state.weapon.ammo.mag ===
      this.currentWeapon.data.stats.magSize +
        this.currentWeapon.data.stats.chamber
    )
      return;
    if (this.state.weapon.ammo.reserve === 0) return;
    this.state.reloading = true;

    // this.reloadAnim = this.viewModel.playAnimation("Reload")!.Ended.Connect(() => {});
    if (this.state.reloadCancelled) return;
    const magBeforeReload = this.state.weapon.ammo.mag;
    this.state.weapon.ammo.mag = this.currentWeapon.data.stats.magSize;
    if (magBeforeReload > 0)
      this.state.weapon.ammo.mag += this.currentWeapon.data.stats.chamber;

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
    if (!this.currentWeapon) return;
    this.cancelInspect();
    this.state.aimed = on;

    this.currentWeapon.model.Sounds[on ? "AimDown" : "AimUp"].Play();

    const info = new TweenInfo(
      0.25,
      Enum.EasingStyle.Quad,
      Enum.EasingDirection[on ? "Out" : "InOut"]
    );
    tween(this.viewModel!.getManipulator("Aim"), info, {
      Value: on ? this.currentWeapon.model.Offsets.Aim.Value : new CFrame(),
    });

    this.crosshair.setSize(on ? 0 : this.currentWeapon.data.crossExpansion.hip);
  }

  /**
   * Toggle trigger pull
   *
   * @param on Pulling trigger
   */
  public toggleTriggerPull(on: boolean): void {
    if (!this.state.equipped) return;
    if (!this.currentWeapon) return;

    const fadeSpd = 0.05;
    if (on) {
      this.currentWeapon.anims.trigger =
        this.viewModel!.playAnimation("Trigger");
      this.currentWeapon.anims.trigger.AdjustWeight(undefined, fadeSpd);
    } else {
      this.currentWeapon.anims.trigger?.Stopped.Once(() =>
        this.currentWeapon?.anims.trigger?.Destroy()
      );
      this.currentWeapon.anims.trigger?.Stop();
      this.currentWeapon.anims.trigger = undefined;
    }
  }

  /**
   * Shoot weapon
   */
  public shoot(): void {
    if (!this.state.equipped) return;
    if (this.state.shooting) return;
    if (!this.currentWeapon) return;

    this.cancelReload();
    this.cancelInspect();
    if (this.state.weapon.ammo.mag === 0) {
      this.currentWeapon.model.Sounds.EmptyClick.Play();
      this.reload();
      return;
    }

    const pew = () => {
      if (!this.state.equipped) return;
      if (!this.currentWeapon) return;
      if (this.state.weapon.ammo.mag === 0) {
        this.currentWeapon.model.Sounds.EmptyClick.Play();
        this.mouseDown = false;
        this.state.shooting = false;
        this.reload();
        return;
      }

      this.state.weapon.ammo.mag--;
      this.events.ammoChanged.Fire(this.state.weapon.ammo);

      this.calculateRecoil();
      this.currentWeapon.vfx.createTracer(this.currentWeapon.data);
      this.currentWeapon.vfx.createMuzzleFlash();
      this.sounds.clone(
        waitFor<Sound>(this.currentWeapon.model.Sounds, "Fire")
      );

      const boltAnim = this.viewModel!.playAnimation("Shoot", false)!;
      boltAnim
        .GetMarkerReachedSignal("SlideBack")
        .Once(() =>
          this.currentWeapon?.vfx.createEjectedShell(
            this.currentWeapon.data.shell,
            this.currentWeapon.model
          )
        );

      boltAnim.Play();
      if (!this.state.aimed) this.crosshair.pulse(this.currentWeapon.data);
    };

    const fireSpeed = 60 / this.currentWeapon.data.stats.rpm;
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
          i <= (this.currentWeapon.data.stats.burstCount ?? 3) &&
          this.mouseDown;
          i++
        ) {
          pew();
          task.wait(fireSpeed);
        }
        break;

      default:
        $error("Invalid firemode: " + tostring(this.state.weapon.firemode));
    }

    this.state.shooting = false;
  }

  /**
   * Calculate recoil (crazy I know)
   */
  private calculateRecoil(): void {
    if (!this.state.equipped) return;
    if (!this.currentWeapon) return;

    const r = new Random();
    const torqueDir = r.NextInteger(1, 2) === 1 ? 1 : -1;
    const data = this.currentWeapon.data;

    const [[cy1, cy2], [cx1, cx2], [cz1, cz2]] = data.recoil.camera;
    const cforce = new Vector3(
      r.NextNumber(cy1, cy2),
      r.NextNumber(cx1, cx2),
      r.NextNumber(cz1, cz2)
    );

    const [[my1, my2], [mx1, mx2], [mz1, mz2]] = data.recoil.model;
    const mforce = new Vector3(
      r.NextNumber(my1, my2),
      r.NextNumber(mx1, mx2),
      r.NextNumber(mz1, mz2)
    );

    let stabilization = 1;
    if (this.state.aimed) stabilization += 0.4;
    if (this.state.crouched) stabilization += 0.1;
    if (this.state.proned) stabilization += 0.2;

    this.vmRecoil!.kick(data, cforce, stabilization, torqueDir);
    this.camRecoil!.kick(data, mforce, stabilization, torqueDir);
    task.delay(0.12, () => {
      this.vmRecoil!.kick(data, cforce.mul(-1), stabilization, torqueDir);
      this.camRecoil!.kick(data, mforce.mul(-1), stabilization, torqueDir);
    });
  }
}
