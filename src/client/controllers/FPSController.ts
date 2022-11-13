import { Controller } from "@flamework/core";
import { ReplicatedStorage as Replicated, Workspace as World } from "@rbxts/services";
// import { CrosshairController } from "./CrosshairController";
import { RecoilController } from "./RecoilController";
import { Janitor } from "@rbxts/janitor";
import { WaitFor } from "shared/modules/utility/WaitFor";
import { WeaponData } from "client/classes/WeaponData";
import { WeaponModel } from "client/classes/WeaponModel";
import { SoundController } from "./SoundController";
import { VFXController } from "./VFXController";
import ViewModel from "client/classes/ViewModel";
import Tween from "shared/modules/utility/Tween";

const cam = World.CurrentCamera!;

@Controller({})
export class FPSController {
    private readonly janitor = new Janitor;
    private viewModel: ViewModel;
    private weaponData?: WeaponData;
    private weaponModel?: WeaponModel;
    private triggerAnim?: AnimationTrack;

    public readonly state = {
        equipped: false,
        shooting: false,
        reloading: false,
        aiming: false,
        sprinting: false,
        crouched: false,
        proned: false,
        lean: 0,
        ammo: {
            mag: 0,
            reserve: 0
        }
    }

    public constructor(
        // private crosshair: CrosshairController,
        private sounds: SoundController,
        private recoil: RecoilController,
        private vfx: VFXController
    ) {
        recoil.attach(cam);

        this.viewModel = new ViewModel(WaitFor<Model>(Replicated.WaitForChild("Character"), "ViewModel"));
        recoil.attach(this.viewModel);
        // proceduralAnims.attach(this.viewModel);
        
        this.janitor.Add(() => {
            this.recoil.destroy();
            this.viewModel.destroy();
        });
    }

    private attachMotors(model: WeaponModel): void {
        // for (const motor of <Motor6D[]>model.GetDescendants().filter(d => d.IsA("Motor6D")))
        //     motor.Part0 = this.viewModel.root;

        model.Trigger.ViewModel.Part0 = this.viewModel.root;
    }

    public equip(weaponName: string): void {
        const model = WaitFor<WeaponModel>(Replicated.WaitForChild("Weapons"), weaponName).Clone();
        
        this.attachMotors(model);
        task.wait(1);
        model.Parent = this.viewModel.model;
        
        this.viewModel.setEquipped(model);
        this.viewModel.playAnimation("Idle");
        this.weaponData = this.viewModel.data!;
        this.weaponModel = model;

        for (const offset of model.Offsets.GetChildren()) {
            const cfm = <CFrameValue>offset.Clone();
            cfm.Value = new CFrame;
            cfm.Parent = model.CFrameManipulators;
        }

        this.state.ammo.mag = this.weaponData.magSize;
        this.state.ammo.reserve = this.weaponData.reserve;
        this.state.equipped = true;
    }

    public reload(): void {
        if (!this.state.equipped) return;
        if (!this.weaponModel || !this.weaponData) return;
        if (this.state.reloading) return;
        if (this.state.aiming) return;
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
        this.state.reloading = false;
    }

    public aim(on: boolean): void {
        if (!this.state.equipped) return;
        if (this.state.aiming === on) return;
        if (!this.weaponModel || !this.weaponData) return;
        this.state.aiming = on;

        this.weaponModel.Sounds[on ? "AimDown" : "AimUp"].Play();

        const info = new TweenInfo(.3, Enum.EasingStyle.Quad)
        Tween(this.viewModel.getManipulator("Aim"), info, {
            Value: on ? this.weaponModel.Offsets.Aim.Value : new CFrame
        });
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
        
        this.recoil.kick(cforce, "Camera");
        this.recoil.kick(mforce, "Model");
        task.delay(.12, () => {
            this.recoil.kick(cforce.mul(-1), "Camera");
            this.recoil.kick(mforce.mul(-1), "Model");
        });
        
        this.state.shooting = false;
    }
}