import { Controller } from "@flamework/core";
import { LeanState } from "client/classes/Types";
import { FPS } from "./FPS";

@Controller({})
export class Movement {
    public constructor(
        private readonly fps: FPS
    ) {}

    public crouch(on?: boolean): void {
        this.fps.state.crouched = on ?? !this.fps.state.crouched;
    }

    public prone(on: boolean): void {
        if (this.fps.state.lean !== 0) this.lean(0);
        if (this.fps.state.crouched) this.crouch(false);
        this.fps.state.proned = on;
    }

    public lean(leanState: LeanState): void {
        if (this.fps.state.lean === leanState) return this.lean(0);
        this.fps.state.lean = leanState;
    }
}