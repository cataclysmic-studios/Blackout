import { Controller } from "@flamework/core";
import { Debris, ReplicatedStorage as Replicated, Workspace as World } from "@rbxts/services";

import { WaitFor } from "shared/modules/utility/WaitFor";

@Controller({})
export class VFXController {
    public createMuzzleFlash(model: Folder): void {
        const trigger = model.WaitForChild("Trigger");
        const muzzleFlash = WaitFor<Attachment>(trigger, "Muzzle").Clone();
        for (const v of <(ParticleEmitter | Light)[]>muzzleFlash.GetChildren()) {
            v.Enabled = true;
            task.delay(v.Name === "BarrelSmoke" ? .15 : .1, () => {
                v.Enabled = false
            });
        }
        task.delay(1.5, () => muzzleFlash.Destroy());

        const chamberSmoke = WaitFor<ParticleEmitter>(trigger.WaitForChild("Chamber"), "Smoke");
        chamberSmoke.Enabled = true;
        task.delay(.18, () => {
            chamberSmoke.Enabled = false
        });
    }

    public createEjectedShell(shellType: string, weapon: Folder): void {
        const vfx = Replicated.WaitForChild("VFX");
        const shell = WaitFor<Part>(vfx.WaitForChild("Shells"), shellType).Clone();
        const trigger = WaitFor<Part>(weapon, "Trigger");
        const chamber = WaitFor<Attachment>(trigger, "Chamber");
        shell.CFrame = chamber.WorldCFrame;
        shell.Parent = World.Debris;

        
        const r = new Random;
        const mod = r.NextNumber(-1, 1);
        const ejectForce = trigger.CFrame.RightVector.Unit.div(50).add(new Vector3(0, .02, 0));
        const ejectTorque = trigger.CFrame.LookVector.Unit.mul(mod);
        shell.ApplyImpulseAtPosition(ejectForce, shell.CFrame.Position.add(ejectTorque));
        Debris.AddItem(shell, 5);
    }
}