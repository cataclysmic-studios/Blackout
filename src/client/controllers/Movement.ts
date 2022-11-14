import { Controller } from "@flamework/core";
import { LeanState } from "client/classes/Types";
import { FPS } from "./FPS";

@Controller({})
export class Movement {
    public constructor(
        private readonly fps: FPS
    ) {}

    public crouch(): void {

    }

    public prone(): void {

    }

    public lean(state: LeanState): void {

    }
}