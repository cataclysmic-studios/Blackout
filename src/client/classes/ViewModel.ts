import { Janitor } from "@rbxts/janitor";
import { Workspace as World } from "@rbxts/services";
import { WaitFor } from "shared/modules/utility/WaitFor";
import { WeaponData } from "./WeaponData";
import { WeaponModel } from "./WeaponModel";

const camera = World.CurrentCamera!;
export default class ViewModel {
    private readonly janitor = new Janitor;
    private oldCamCF?: CFrame;
    private offsets = {
        walkCycle: new CFrame
    }
    
    public readonly model: Model;
    public readonly root: BasePart;
    public weapon?: WeaponModel;
    public data?: WeaponData;

    public constructor(model: Model) {
        this.model = model.Clone();
        this.model.Parent = camera;
        this.root = this.model.PrimaryPart!;

        this.janitor.Add(this.model);
    }

    // Camera offset for walk cycle
    public setWalkCycleCFrame(cf: CFrame): void {
        this.offsets.walkCycle = cf;
    }

    // Set rig CFrame
    public setCFrame(cf: CFrame): void {
        this.root.CFrame = cf;
    }

    // Returns a CFrame offset for the camera
    public getManipulator(name: string): CFrameValue {
        const value = WaitFor<CFrameValue>(this.weapon!.CFrameManipulators, name);
        return value;
    }

    // Sync the camera's movement to the camera bone's movement
    public syncCameraBone(): void {
        const newCF = WaitFor<Part>(this.model, "Camera").CFrame.ToObjectSpace(this.root.CFrame);
        if (this.oldCamCF) {
            const [_, __, z] = newCF.ToOrientation();
            const [x, y] = newCF.ToObjectSpace(this.oldCamCF).ToEulerAnglesXYZ();
            World.CurrentCamera!.CFrame = World.CurrentCamera!.CFrame.mul(CFrame.Angles(x, y, -z));
        }

        this.oldCamCF = newCF;
    }

    // Returns a CFrame of where the rig should be
    public getCFrame(): CFrame {
        if (!this.weapon || !this.data) return new CFrame();
        return World.CurrentCamera!.CFrame
            .mul(this.data.vmOffset)
            .mul(this.offsets.walkCycle)
            .mul(this.getManipulator("Aim").Value);
    }

    // Update weapon
    public setEquipped(model?: WeaponModel): void {
        this.weapon = model;
        if (this.weapon)
            try {
                this.data = <WeaponData>require(WaitFor<ModuleScript>(this.weapon, "Data"));
            } catch(e) {
                warn(`Weapon data for "${this.weapon.Name}" failed to load. Stack trace:\n${e}`);
            }
    }

    // Play an animation
    public playAnimation(name: string, playImmediately = true): AnimationTrack | undefined {
        if (!this.weapon || !this.data) return;

        const anims = this.weapon.WaitForChild("Animations");
        const anim = WaitFor<Animation>(anims, name);
        const controller = WaitFor<AnimationController>(this.model, "AnimationController");
        const track = controller.LoadAnimation(anim);

        track.Stopped.Once(() => track.Destroy());
        if (playImmediately)
            track.Play();
            
        return track;
    }

    // Cleanup ViewModel
    public destroy(): void {
        this.janitor.Cleanup();
    }
}