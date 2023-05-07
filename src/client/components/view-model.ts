import { BaseComponent, Component } from "@flamework/components";
import { OnStart } from "@flamework/core";
import { UserInputService as UIS, Workspace as World } from "@rbxts/services";
import { Spring, waitFor } from "shared/utility";
import { WeaponData, WeaponModel } from "../../shared/interfaces/game-types";

const camera = World.CurrentCamera!;
const { sin, clamp } = math;

interface CameraOffset {
  readonly CFrame: CFrame;
  readonly Lerp: boolean;
  readonly LerpAlpha: number;
}

@Component()
export default class ViewModel
  extends BaseComponent<{}, Model>
  implements OnStart
{
  private prevCamCF?: CFrame;
  private springs = {
    mouseSway: new Spring(),
  };

  public readonly root = this.instance.PrimaryPart!;
  public weapon?: WeaponModel;
  public data?: WeaponData;

  public onStart(): void {
    this.instance.Parent = World.CurrentCamera!;
  }

  /**
   * Set rig CFrame
   *
   * @param cf Rig CFrame
   */
  public setCFrame(cf: CFrame): void {
    this.root.CFrame = cf;
  }

  /**
   * Returns a CFrame offset for the camera defined in the current equipped weapon
   *
   * @param name CFrame manipulator name
   * @returns Camera CFrame offset
   */
  public getManipulator(name: string): CFrameValue {
    return waitFor<CFrameValue>(this.weapon!.CFrameManipulators, name);
  }

  /**
   * Sync the camera's movement to the camera bone's movement
   */
  public syncCameraBone(): void {
    const newCF = waitFor<Part>(this.instance, "Camera").CFrame.ToObjectSpace(
      this.root.CFrame
    );
    if (this.prevCamCF) {
      const [_, __, z] = newCF.ToOrientation();
      const [x, y] = newCF.ToObjectSpace(this.prevCamCF).ToEulerAnglesXYZ();
      World.CurrentCamera!.CFrame = World.CurrentCamera!.CFrame.mul(
        CFrame.Angles(x, y, -z)
      );
    }

    this.prevCamCF = newCF;
  }

  /**
   * Returns the CFrame offset for the idle animation (breathing)
   *
   * @param dt Delta time
   * @param aiming Whether or not the player is aiming
   * @param camY Mouse Y
   * @returns Idle animation CFrame offset
   */
  private getIdleOffset(
    dt: number,
    aiming: boolean,
    leanOffset: CFrame,
    camY: number
  ): CFrame {
    camY = aiming ? 0 : camY;
    return new CFrame(0, sin(tick()) / (aiming ? 325 : 130), 0)
      .mul(new CFrame(0, -camY / 2, camY / 5))
      .mul(leanOffset);
  }

  /**
   * Returns a CFrame of where the rig should be
   *
   * @param dt Delta time
   * @param aimed Whether or not the player is aiming
   * @returns CFrame of where the rig should be
   */
  public getCFrame(dt: number, aimed: boolean, leanOffset: CFrame): CFrame {
    if (!this.weapon || !this.data) return new CFrame();

    const { X: dx, Y: dy } = UIS.GetMouseDelta().div(150);
    const [ly] = camera.CFrame.ToEulerAnglesYXZ();
    const limit = aimed ? 0.02 : 0.04;
    this.springs.mouseSway.shove(
      new Vector3(clamp(dx, -limit, limit), clamp(dy, -limit, limit), 0)
    );

    const lv = this.weapon.Trigger.AssemblyLinearVelocity;
    this.weapon.Trigger.AssemblyLinearVelocity = new Vector3(lv.X, 0, lv.Y);

    const sway = this.springs.mouseSway.update(dt).div(aimed ? 3 : 1);
    const aimSway = new CFrame(-sway.X, sway.Y, -sway.X).mul(
      CFrame.Angles(-sway.Y, -sway.X, sway.X)
    );
    const hipSway = new CFrame(-sway.X * 1.75, sway.Y / 1.5, -sway.X * 1.5).mul(
      CFrame.Angles(-sway.Y / 1.5, -sway.X, 0)
    );

    return World.CurrentCamera!.CFrame.mul(this.data.vmOffset)
      .mul(this.getIdleOffset(dt, aimed, leanOffset, ly / 5))
      .mul(this.getManipulator("Aim").Value)
      .mul(aimed ? aimSway : hipSway);
  }

  /**
   * Update weapon
   *
   * @param model Weapon model
   */
  public setEquipped(model?: WeaponModel): void {
    this.weapon = model;
    if (this.weapon)
      try {
        this.data = require(waitFor<ModuleScript>(
          this.weapon,
          "Data"
        )) as WeaponData;
      } catch (e) {
        warn(
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
          `Weapon data for "${this.weapon.Name}" failed to load. Stack trace:\n${e}`
        );
      }
  }

  /**
   * Play an animation
   *
   * @param name Animation name
   * @param playImmediately Whether to play it immediately or not
   * @returns Animation track
   */
  public playAnimation(name: string, playImmediately = true): AnimationTrack {
    const anims = this.weapon!.WaitForChild("Animations");
    const anim = waitFor<Animation>(anims, name);
    const controller = waitFor<AnimationController>(
      this.instance,
      "AnimationController"
    );
    const track = controller.LoadAnimation(anim);

    track.Stopped.Once(() => track.Destroy());
    if (playImmediately) track.Play();

    return track;
  }
}
