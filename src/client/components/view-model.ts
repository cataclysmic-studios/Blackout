import { BaseComponent, Component } from "@flamework/components";
import { UserInputService as UIS, Workspace as World } from "@rbxts/services";
import { waitFor, Spring } from "shared/utility";
import { WeaponData, WeaponModel } from "shared/types";

const camera = World.CurrentCamera!;

@Component()
export default class ViewModel<M extends Model = Model> extends BaseComponent<{}, M> {
  private prevCamCF?: CFrame;
  private springs = {
    mouseSway: new Spring
  };

  public readonly root: BasePart;
  public weapon?: WeaponModel;
  public data?: WeaponData;

  public constructor(model: M) {
    super();
    this.instance = model.Clone();
    this.root = this.instance.PrimaryPart!;
    this.maid.GiveTask(this.instance);
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
   * Returns a CFrame offset for the camera
   * 
   * @param name CFrame manipulator name
   * @returns Camera CFrame offset
   */
  public getManipulator(name: string): CFrameValue {
    const value = waitFor<CFrameValue>(this.weapon!.CFrameManipulators, name);
    return value;
  }

  /**
   * Sync the camera's movement to the camera bone's movement
   */
  public syncCameraBone(): void {
    const newCF = waitFor<Part>(this.instance, "Camera").CFrame.ToObjectSpace(this.root.CFrame);
    if (this.prevCamCF) {
      const [_, __, z] = newCF.ToOrientation();
      const [x, y] = newCF.ToObjectSpace(this.prevCamCF).ToEulerAnglesXYZ();
      World.CurrentCamera!.CFrame = World.CurrentCamera!.CFrame.mul(CFrame.Angles(x, y, -z));
    }

    this.prevCamCF = newCF;
  }

  /**
   * Returns the CFrame offset for the idle animation (breathing)
   * 
   * @param dt Delta time
   * @param aiming Whether or not the player is aiming
   * @param mouseY Mouse Y
   * @returns Idle animation CFrame offset
   */
  public getIdleOffset(dt: number, aiming: boolean, mouseY: number): CFrame {
    mouseY = aiming ? 0 : mouseY;
    return new CFrame(0, math.sin(tick()) / (aiming ? 325 : 130), 0)
      .mul(new CFrame(0, -mouseY / 2, mouseY / 5));
  }

  /**
   * Returns a CFrame of where the rig should be
   * 
   * @param dt Delta time
   * @param aiming Whether or not the player is aiming
   * @returns CFrame of where the rig should be
   */
  public getCFrame(dt: number, aiming: boolean): CFrame {
    if (!this.weapon || !this.data) return new CFrame();

    const { X: dx, Y: dy } = UIS.GetMouseDelta().div(150);
    const [ly] = camera.CFrame.ToEulerAnglesYXZ();
    const limit = aiming ? .02 : .04;
    this.springs.mouseSway.shove(new Vector3(math.clamp(dx, -limit, limit), math.clamp(dy, -limit, limit), 0));

    const lv = this.weapon.Trigger.AssemblyLinearVelocity;
    this.weapon.Trigger.AssemblyLinearVelocity = new Vector3(lv.X, 0, lv.Y);

    const sway = this.springs.mouseSway.update(dt).div(aiming ? 3 : 1);
    const aimSway = new CFrame(-sway.X, sway.Y, -sway.X).mul(CFrame.Angles(-sway.Y, -sway.X, sway.X));
    const hipSway = new CFrame(-sway.X * 1.75, sway.Y / 1.5, -sway.X * 1.5).mul(CFrame.Angles(-sway.Y / 1.5, -sway.X, 0));
    return World.CurrentCamera!.CFrame
      .mul(this.data.vmOffset)
      .mul(this.getIdleOffset(dt, aiming, ly / 5))
      .mul(this.getManipulator("Aim").Value)
      .mul(aiming ? aimSway : hipSway);
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
        this.data = <WeaponData>require(waitFor<ModuleScript>(this.weapon, "Data"));
      } catch (e) {
        warn(`Weapon data for "${this.weapon.Name}" failed to load. Stack trace:\n${e}`);
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
    const controller = waitFor<AnimationController>(this.instance, "AnimationController");
    const track = controller.LoadAnimation(anim);

    track.Stopped.Once(() => track.Destroy());
    if (playImmediately)
      track.Play();

    return track;
  }

  /**
   * Cleanup ViewModel
   */
  public destroy(): void {
    this.maid.Destroy();
  }
}
