import { BaseComponent, Component } from "@flamework/components";
import { Debris, Players, ReplicatedStorage as Replicated, Workspace as World } from "@rbxts/services";
import { Events } from "client/network";
import { WeaponData, WeaponModel } from "../../shared/interfaces/game-types";
import { waitFor } from "shared/utility";
import { SoundController } from "client/controllers/sound-player";
import { Dependency } from "@flamework/core";

@Component()
export default class GunEffects extends BaseComponent<{}, WeaponModel> {
  private readonly sound = Dependency<SoundController>();

  /**
   * Create tracer
   * 
   * @param model Weapon model
   * @param data Weapon data
   */
  public createTracer(data: WeaponData): void {
    Events.createBullet.fire(this.instance.Trigger.Muzzle.WorldPosition, Players.LocalPlayer.GetMouse().Hit.LookVector, data);
  }

  /**
   * Create muzzle flash
   * 
   * @param model Weapon model
   */
  public createMuzzleFlash(): void {
    const muzzleFlash = this.instance.Trigger.Muzzle.Clone();
    muzzleFlash.Parent = this.instance.Trigger;

    for (const v of <(ParticleEmitter | Light)[]>muzzleFlash.GetChildren()) {
      v.Enabled = true;
      task.delay(v.Name === "BarrelSmoke" ? 1.5 : .1, () => v.Enabled = false);
    }

    task.delay(2.5, () => muzzleFlash.Destroy());
    const chamberSmoke = this.instance.Trigger.Chamber.Smoke;
    chamberSmoke.Enabled = true;
    task.delay(.1, () => chamberSmoke.Enabled = false);
  }

  /**
   * Create ejected shell effect
   * 
   * @param shellType Shell type name
   * @param weapon Weapon model
   */
  public createEjectedShell(shellType: string, weapon: WeaponModel): void {
    const shell = waitFor<Part>(Replicated.VFX.Shells, shellType).Clone();
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
