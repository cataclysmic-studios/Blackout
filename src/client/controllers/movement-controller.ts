import { Controller } from "@flamework/core";
import { LeanState } from "shared/types";
import { ViewmodelController } from "./viewmodel-controller";

@Controller()
export class MovementController {
  public constructor(
    private readonly fps: ViewmodelController
  ) { }

  /**
   * Toggle/set crouching status
   * 
   * @param on Whether or not to crouch
   */
  public crouch(on?: boolean): void {
    this.fps.state.crouched = on ?? !this.fps.state.crouched;
  }

  /**
   * Set proning status
   * 
   * @param on Whether or not to prone
   */
  public prone(on: boolean): void {
    if (this.fps.state.lean !== 0) this.lean(0);
    if (this.fps.state.crouched) this.crouch(false);
    this.fps.state.proned = on;
  }

  /**
   * Set the lean state
   * 
   * @param leanState Desired lean state
   */
  public lean(leanState: LeanState): void {
    if (this.fps.state.lean === leanState) return this.lean(0);
    this.fps.state.lean = leanState;
  }
}
