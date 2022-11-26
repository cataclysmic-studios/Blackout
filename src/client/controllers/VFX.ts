import { Controller } from "@flamework/core";
import { Debris, Players, ReplicatedStorage as Replicated, Workspace as World } from "@rbxts/services";
import { Events } from "client/network";
import { WeaponData, WeaponModel } from "shared/modules/Types";
import { WaitFor } from "shared/modules/utility/WaitFor";
import { SoundPlayer } from "./SoundPlayer";


@Controller({})
export class VFX {
    public constructor(
        private readonly sound: SoundPlayer
    ) {}

    public createTracer(model: WeaponModel, data: WeaponData): void {
        Events.createBullet.fire(model.Trigger.Muzzle.WorldPosition, Players.LocalPlayer.GetMouse().Hit.LookVector, data);
    }

    public createMuzzleFlash(model: WeaponModel): void {
        const muzzleFlash = model.Trigger.Muzzle.Clone();
        muzzleFlash.Parent = model.Trigger;
        
        for (const v of <(ParticleEmitter | Light)[]>muzzleFlash.GetChildren()) {
            v.Enabled = true;
            task.delay(v.Name === "BarrelSmoke" ? 1.5 : .1, () => v.Enabled = false);
        }
        task.delay(2.5, () => muzzleFlash.Destroy());

        const chamberSmoke = model.Trigger.Chamber.Smoke;
        chamberSmoke.Enabled = true;
        task.delay(.1, () => chamberSmoke.Enabled = false);
    }

    public createEjectedShell(shellType: string, weapon: WeaponModel): void {
        const shell = WaitFor<Part>(Replicated.VFX.Shells, shellType).Clone();
        shell.CFrame = new CFrame(weapon.Trigger.Chamber.WorldPosition, weapon.Trigger.CFrame.LookVector);
        shell.Parent = World.Debris;

        const r = new Random;
        const mod = r.NextNumber(-1, 1);
        const ejectForce = weapon.Trigger.CFrame.RightVector.Unit.div(50).add(new Vector3(0, .02, 0)); // fling right and up
        const ejectTorque = weapon.Trigger.CFrame.LookVector.Unit.div(10).mul(mod);
        shell.ApplyImpulseAtPosition(ejectForce, shell.CFrame.Position.add(ejectTorque));

        let db = false;
        let conn: RBXScriptConnection;
        conn = shell.Touched.Connect(hit => {
            if (!hit.CanCollide) return;
            if (db) return;
            db = true;

            this.sound.play("MetalShell", shell, () => Debris.AddItem(shell, 1));
            conn.Disconnect();
        });
    }
}