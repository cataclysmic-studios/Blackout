import { Controller, OnRender, OnStart } from "@flamework/core";
import { Debris, ReplicatedStorage as Replicated, Workspace as World } from "@rbxts/services";
// import { CrosshairController } from "./CrosshairController";
import { RecoilController } from "./RecoilController";
import { Janitor } from "@rbxts/janitor";
import { WaitFor } from "shared/modules/utility/WaitFor";
import { WeaponData } from "client/classes/WeaponData";
import { SoundController } from "./SoundController";

interface WeaponModel extends Model {
    Trigger: Part & {
        GunMotor6D: Motor6D
    };
    Chamber: Part;
    Flame: Part;
    Mag: Part;
    Slide: Part;
}

const cam = World.CurrentCamera!;

@Controller({})
export class FPSController implements OnStart, OnRender {
    private readonly janitor = new Janitor;
    // private viewModel: ViewModel;
    private weaponData?: WeaponData;
    private weaponModel?: WeaponModel;
    private chamberCF = new CFrame;

    public constructor(
        // private crosshair: CrosshairController,
        private sounds: SoundController,
        private recoil: RecoilController
    ) {
        recoil.attach(cam);

        // this.viewModel = new ViewModel(WaitFor<Model>(Replicated.WaitForChild("Character"), "ViewModel"));
        // recoil.attach(this.viewModel);
        // proceduralAnims.attach(this.viewModel);
        
        this.janitor.Add(() => {
            this.recoil.destroy();
            // this.viewModel.destroy();
        });
    }

    public onStart(): void {
        // this.equip("Glock");
    }

    public onRender(dt: number): void {
        if (!this.weaponModel || !this.weaponData) return;

        const chamber = WaitFor<Part>(this.weaponModel, "Chamber");
        this.chamberCF = chamber.CFrame
    }

    // public equip(weaponName: string): void {
    //    const model = WaitFor<WeaponModel>(Replicated.WaitForChild("Weapons"), weaponName).Clone();
    //    model.Trigger.GunMotor6D.Part0 = <Part>this.viewModel.model.WaitForChild("RootPart");
    //    model.Parent = this.viewModel.model;

    //    this.viewModel.setEquipped(model);
    //    this.viewModel.playAnimation("Idle");
    //    this.weaponData = this.viewModel.data;
    //    this.weaponModel = model;
    // }

    // private createEjectedShell(): void {
    //     if (!this.weaponModel || !this.weaponData) return;

    //     const vfx = Replicated.WaitForChild("VFX");
    //     const shell = WaitFor<Part>(vfx.WaitForChild("Shells"), this.weaponData.shell).Clone();
    //     shell.CFrame = this.chamberCF;
    //     shell.Parent = World.Debris;

    //     const trigger = this.weaponModel.Trigger;
    //     const ejectForce = trigger.CFrame.RightVector.Unit.div(10).add(new Vector3(0, .1, 0));

    //     const r = new Random;
    //     const mod = r.NextNumber(-1, 1);
    //     const ejectTorque = trigger.CFrame.LookVector.Unit.mul(mod);
    //     shell.ApplyImpulseAtPosition(ejectForce, shell.CFrame.Position.add(ejectTorque));
    //     Debris.AddItem(shell, 5);
    // }

    // private createShootVFX(): void {
    //     if (!this.weaponModel || !this.weaponData) return;

    //     const vfx = Replicated.WaitForChild("VFX");
    //     const muzzleFlash = WaitFor<Folder>(vfx, "MuzzleFlash").Clone();
    //     for (const v of <(ParticleEmitter | Light)[]>muzzleFlash.GetChildren()) {
    //         v.Parent = this.weaponModel.Flame;
    //         v.Enabled = true;
    //         task.delay(v.Name === "Smoke" ? .15 : .1, () => {
    //             v.Enabled = false
    //             task.delay(2, () => v.Destroy());
    //         });
    //     }

    //     const chamberSmoke = WaitFor<ParticleEmitter>(this.weaponModel.Chamber, "Smoke");
    //     chamberSmoke.Enabled = true;
    //     task.delay(.18, () => {
    //         chamberSmoke.Enabled = false
    //     });
    // }
    
    public shoot(): void {
        // if (!this.viewModel || !this.weaponModel || !this.weaponData) return;

        // this.createShootVFX();
        // this.sounds.clone(<Sound>this.weaponModel.Flame.WaitForChild("Fire"));
        
        // const slideAnim = this.viewModel.playAnimation("Shoot", false)!;
        // slideAnim.GetMarkerReachedSignal("SlideBack").Once(() => this.createEjectedShell());
        // slideAnim.Play();

        const r = new Random;
        const torqueDir = (new Random).NextInteger(1, 2) === 1 ? 1 : -1;
        // const crp = this.weaponData.recoil.camera;
        const crp = [[1, 2], [.2, .3], [20, 25]];
        const cforce = new Vector3(
            r.NextNumber(crp[0][0], crp[0][1]), 
            r.NextNumber(crp[1][0], crp[1][1]) * torqueDir, 
            r.NextNumber(crp[2][0], crp[2][1])
        );

        // const mrp = this.weaponData.recoil.model;
        // const mforce = new Vector3(
        //     r.NextNumber(mrp[0][0], mrp[0][1]), 
        //     r.NextNumber(mrp[1][0], mrp[1][1]) * torqueDir, 
        //     r.NextNumber(mrp[2][0], mrp[2][1])
        // );
        
        this.recoil.kick(cforce, "Camera");
        // this.recoil.kick(mforce, "Model");
        task.wait(.12);
        this.recoil.kick(cforce.mul(-1), "Camera");
        // this.recoil.kick(mforce.mul(-1), "Model");
    }
}