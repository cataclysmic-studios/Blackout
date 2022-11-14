import { Controller, Dependency, OnRender } from "@flamework/core";
import { ReplicatedStorage as Replicated, Workspace as World } from "@rbxts/services";
import { Janitor } from "@rbxts/janitor";
import { WaitFor } from "shared/modules/utility/WaitFor";
import { LeanState, Slot, WeaponData, WeaponModel } from "shared/modules/Types";
import { AmmoHUD } from "client/components/AmmoHUD";
import { MenuButton } from "client/components/MenuButton";
import { Recoil } from "./Recoil";
import { Crosshair } from "./Crosshair";
import { SoundPlayer } from "./SoundPlayer";
import { VFX } from "./VFX";
import { Firemode } from "shared/modules/Enums";
import { HUD } from "client/components/HUD";
import Signal from "@rbxts/signal";
import Tween from "shared/modules/utility/Tween";
import ViewModel from "client/classes/ViewModel";

interface FPSState {
    equipped: boolean;
    currentSlot: Slot;
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
    inspecting: boolean;

    sprinting: boolean;
    crouched: boolean;
    proned: boolean;
    lean: LeanState;
}

@Controller({})
export class FPS implements OnRender {
    private readonly janitor = new Janitor;
    private viewModel: ViewModel;
    private weaponData?: WeaponData;
    private weaponModel?: WeaponModel;
    private triggerAnim?: AnimationTrack;
    private inspectAnim?: AnimationTrack;

    public mouseDown = false;
    public readonly events = {
        ammoChanged: new Signal<(ammo: { mag: number; reserve: number; }) => void>()
    }

    public readonly state: FPSState = {
        equipped: false,
        currentSlot: 1,
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
        inspecting: false,
        sprinting: false,
        crouched: false,
        proned: false,
        lean: 0
    }

    public constructor(
        private readonly crosshair: Crosshair,
        private readonly sounds: SoundPlayer,
        private readonly recoil: Recoil,
        private readonly vfx: VFX
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

            const menuButtons = Dependency<MenuButton>();
            const ammoHUD = Dependency<AmmoHUD>();
            const hud = Dependency<HUD>();
            menuButtons.destroy();
            ammoHUD.destroy();
            hud.destroy();
        });
    }

    public onRender(dt: number): void {
        this.recoil.update(dt, this.state.aimed);
    }

    public cancelInspect(): void {
        this.inspectAnim?.Stop();
    }

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

    // Attach all Motor6D's inside of the weapon to the ViewModel
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

    public addWeapon(name: string, slot: Slot): void {
        this.state.weapons[slot - 1] = name;
    }

    public removeWeapon(slot: Slot): void {
        this.state.weapons[slot - 1] = undefined;
    }

    public unequip(): void {
        this.viewModel.setEquipped(undefined);
        this.weaponData = undefined;

        this.weaponModel?.Destroy();
        this.weaponModel = undefined;
        
        this.crosshair.toggleMouseIcon();
        // const unequipAnim = this.viewModel.playAnimation("Unequip")!;
    }

    public equip(slot: Slot): void {
        const weaponName = this.state.weapons[slot - 1];
        if (!weaponName) return;

        const model = WaitFor<WeaponModel>(Replicated.Weapons, weaponName).Clone();
        this.attachMotors(model);
        
        this.viewModel.setEquipped(model);
        this.weaponData = this.viewModel.data!;
        this.weaponModel = model;
        
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
        
        model.Parent = this.viewModel.model;
        const equipAnim = this.viewModel.playAnimation("Equip", false)!;
        this.viewModel.playAnimation("Idle");

        equipAnim.GetMarkerReachedSignal("BoltBack").Once(() => this.weaponModel!.Sounds.SlidePull.Play());
        equipAnim.GetMarkerReachedSignal("BoltClosed").Once(() => this.weaponModel!.Sounds.SlideRelease.Play());

        let conn: RBXScriptConnection;
        conn = equipAnim.Stopped.Connect(() => {
            this.state.equipped = true;
            conn.Disconnect();
        });
        equipAnim.Play();
    }

    public reload(): void {
        if (!this.state.equipped) return;
        if (!this.weaponModel || !this.weaponData) return;
        if (this.state.reloading) return;
        if (this.state.inspecting) return;
        if (this.state.aimed) return;
        if (this.state.shooting) return;
        if (this.state.weapon.ammo.mag === this.weaponData.stats.magSize + this.weaponData.stats.chamber) return;
        if (this.state.weapon.ammo.reserve === 0) return;
        this.state.reloading = true;
        
        // this.viewModel.playAnimation("Reload");
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

    public aim(on: boolean): void {
        if (!this.state.equipped) return;
        if (this.state.aimed === on) return;
        if (!this.weaponModel || !this.weaponData) return;
        if (this.state.inspecting)
            this.cancelInspect();
    
        this.state.aimed = on;

        this.weaponModel.Sounds[on ? "AimDown" : "AimUp"].Play();

        const info = new TweenInfo(.25, Enum.EasingStyle.Quad, Enum.EasingDirection[on ? "Out" : "InOut"])
        Tween(this.viewModel.getManipulator("Aim"), info, {
            Value: on ? this.weaponModel.Offsets.Aim.Value : new CFrame
        });

        this.crosshair.setSize(on ? 0 : this.weaponData.crossExpansion.hip);
    }

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
    
    public shoot(): void {
        if (!this.state.equipped) return;
        if (this.state.inspecting)
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
        switch(this.state.weapon.firemode) {
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

    private calculateRecoil(): void {
        if (!this.weaponData) return;

        const r = new Random;
        const torqueDir = (new Random).NextInteger(1, 2) === 1 ? 1 : -1;
        const [cy, cx, cz] = this.weaponData.recoil.camera;
        const cforce = new Vector3(
            r.NextNumber(cy[0], cy[1]),
            r.NextNumber(cx[0], cx[1]) * torqueDir,
            r.NextNumber(cz[0], cz[1])
        );

        const [my, mx, mz] = this.weaponData.recoil.model;
        const mforce = new Vector3(
            r.NextNumber(my[0], my[1]),
            r.NextNumber(mx[0], mx[1]) * torqueDir,
            r.NextNumber(mz[0], mz[1])
        );

        let stabilization = 1;
        if (this.state.aimed)
            stabilization += 0.8;

        this.recoil.kick(this.weaponData, cforce, "Camera", stabilization);
        this.recoil.kick(this.weaponData, mforce, "Model", stabilization);
        task.delay(.12, () => {
            this.recoil.kick(this.weaponData!, cforce.mul(-1), "Camera", stabilization);
            this.recoil.kick(this.weaponData!, mforce.mul(-1), "Model", stabilization);
        });
    }
}