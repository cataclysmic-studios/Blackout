import { Controller } from "@flamework/core";
import { LeanState } from "shared/interfaces/game-types";
import { tween } from "shared/utility";
// import { FPSController } from "./fps";

@Controller()
export class MovementController {
  public constructor(
    // private readonly fps: FPSController
  ) { }

  /**
   * Toggle/set crouching status
   * 
   * @param on Whether or not to crouch
   */
  public crouch(on?: boolean): void {
    // this.fps.state.crouched = on ?? !this.fps.state.crouched;
  }

  /**
   * Set proning status
   * 
   * @param on Whether or not to prone
   */
  public prone(on: boolean): void {
    // if (this.fps.state.lean !== 0) this.lean(0);
    // if (this.fps.state.crouched) this.crouch(false);
    // this.fps.state.proned = on;
  }

  /**
   * Set the lean state
   * 
   * @param leanState Desired lean state
   */
  public lean(leanState: LeanState): void {
    // if (this.fps.state.lean === leanState) return this.lean(0);
    // this.fps.state.lean = leanState;
    // const leanInfo = new TweenInfo(0.25, Enum.EasingStyle.Quad);
    // tween(this.fps.leanOffset, leanInfo, {
    // Value: new CFrame(leanState, 0, 0).mul(CFrame.Angles(0, 0, math.rad(-20 * leanState)))
    // });
  }
}
