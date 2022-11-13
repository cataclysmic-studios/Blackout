import { Controller, Dependency } from "@flamework/core";
import { ReplicatedStorage as Replicated, Workspace as World } from "@rbxts/services";
import { Janitor } from "@rbxts/janitor";
import { WaitFor } from "shared/modules/utility/WaitFor";
import { WeaponData } from "client/classes/WeaponData";
import { WeaponModel } from "client/classes/WeaponModel";
import { RecoilController } from "./RecoilController";
import { CrosshairController } from "./CrosshairController";
import { SoundController } from "./SoundController";
import { VFXController } from "./VFXController";
import ViewModel from "client/classes/ViewModel";
import Tween from "shared/modules/utility/Tween";
import Signal from "@rbxts/signal";
import { AmmoHUD } from "client/components/AmmoHUD";
import { MenuButton } from "client/components/MenuButton";

const cam = World.CurrentCamera!;

@Controller({})
export class FPSController {
    private readonly janitor = new Janitor;
    private viewModel: ViewModel;
    private weaponData?: WeaponData;
    private weaponModel?: WeaponModel;
    private triggerAnim?: AnimationTrack;

    public readonly events = {
        ammoChanged: new Signal<(ammo: { mag: number; reserve: number; }) => void>()
    }

    public readonly state = {
        equipped: false,
        aimed: false,
        shooting: false,
        reloading: false,
        ammo: {
            mag: 0,
            reserve: 0
        },

        sprinting: false,
        crouched: false,
        proned: false,
        lean: 0
    }

    public constructor(
        private readonly crosshair: CrosshairController,
        private readonly sounds: SoundController,
        private readonly recoil: RecoilController,
        private readonly vfx: VFXController
    ) {
        recoil.attach(cam);

        this.viewModel = new ViewModel(WaitFor<Model>(Replicated.WaitForChild("Character"), "ViewModel"));
        recoil.attach(this.viewModel);
        
        this.janitor.Add(() => {
            this.recoil.destroy();
            this.viewModel.destroy();

            const menuButtons = Dependency<MenuButton>();
            const ammoHUD = Dependency<AmmoHUD>();
            menuButtons.destroy();
            ammoHUD.destroy();
        });
    }

    private attachMotors(model: WeaponModel): void {
        model.Trigger.ViewModel.Part0 = this.viewModel.root;
        do task.wait(); while (model.Trigger.ViewModel.Part0 !== this.viewModel.root);
    }

    public equip(weaponName: string): void {
        const model = WaitFor<WeaponModel>(Replicated.WaitForChild("Weapons"), weaponName).Clone();
        
        this.attachMotors(model);
        model.Parent = this.viewModel.model;
        
        this.viewModel.setEquipped(model);
        this.weaponData = this.viewModel.data!;
        this.weaponModel = model;

        for (const offset of model.Offsets.GetChildren()) {
            const cfm = <CFrameValue>offset.Clone();
            cfm.Value = new CFrame;
            cfm.Parent = model.CFrameManipulators;
        }

        this.state.ammo.mag = this.weaponData.magSize;
        this.state.ammo.reserve = this.weaponData.reserve;
        this.events.ammoChanged.Fire(this.state.ammo);

        this.crosshair.maxSize = this.weaponData.crossExpansion.max;
        this.crosshair.setSize(this.weaponData.crossExpansion.hip);

        const equipAnim = this.viewModel.playAnimation("Equip", false)!;
        this.viewModel.playAnimation("Idle");
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
        if (this.state.aimed) return;
        if (this.state.shooting) return;
        if (this.state.ammo.mag >= this.weaponData.magSize) return;
        if (this.state.ammo.reserve === 0) return;
        this.state.reloading = true;

        const magBeforeReload = this.state.ammo.mag;
        this.state.ammo.mag = this.weaponData.magSize;
        if (magBeforeReload > 0)
            this.state.ammo.mag += this.weaponData.chamber;

        const ammoUsed = this.state.ammo.mag - magBeforeReload;
        this.state.ammo.reserve -= ammoUsed;
        this.events.ammoChanged.Fire(this.state.ammo);

        this.state.reloading = false;
    }

    public aim(on: boolean): void {
        if (!this.state.equipped) return;
        if (this.state.aimed === on) return;
        if (!this.weaponModel || !this.weaponData) return;
        this.state.aimed = on;

        this.weaponModel.Sounds[on ? "AimDown" : "AimUp"].Play();

        const info = new TweenInfo(.25, Enum.EasingStyle.Quad, Enum.EasingDirection[on ? "Out" : "In"])
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
        if (!this.weaponModel || !this.weaponData) return;
        if (this.state.ammo.mag === 0) {
            this.weaponModel.Sounds.EmptyClick.Play();
            this.reload();
            return;
        };

        this.state.shooting = true;
        this.state.ammo.mag--;
        this.events.ammoChanged.Fire(this.state.ammo);

        this.vfx.createMuzzleFlash(this.weaponModel);
        this.sounds.clone(<Sound>this.weaponModel.Sounds.WaitForChild("Fire"));
        
        const slideAnim = this.viewModel.playAnimation("Shoot", false)!;
        slideAnim.GetMarkerReachedSignal("SlideBack").Once(() => this.vfx.createEjectedShell(this.weaponData!.shell, this.weaponModel!));
        slideAnim.Play();

        const r = new Random;
        const torqueDir = (new Random).NextInteger(1, 2) === 1 ? 1 : -1;
        const crp = this.weaponData.recoil.camera;
        const cforce = new Vector3(
            r.NextNumber(crp[0][0], crp[0][1]), 
            r.NextNumber(crp[1][0], crp[1][1]) * torqueDir, 
            r.NextNumber(crp[2][0], crp[2][1])
        );

        const mrp = this.weaponData.recoil.model;
        const mforce = new Vector3(
            r.NextNumber(mrp[0][0], mrp[0][1]), 
            r.NextNumber(mrp[1][0], mrp[1][1]) * torqueDir, 
            r.NextNumber(mrp[2][0], mrp[2][1])
        );
        
        let stabilization = 1;
        if (this.state.aimed)
            stabilization += 0.5;

        this.recoil.kick(this.weaponData, cforce, "Camera", stabilization);
        this.recoil.kick(this.weaponData, mforce, "Model", stabilization);
        task.delay(.12, () => {
            this.recoil.kick(this.weaponData!, cforce.mul(-1), "Camera", stabilization);
            this.recoil.kick(this.weaponData!, mforce.mul(-1), "Model", stabilization);
        });

        if (!this.state.aimed)
            this.crosshair.pulse(this.weaponData);

        this.state.shooting = false;
    }
}