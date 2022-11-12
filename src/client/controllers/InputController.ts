import { Controller, OnStart } from "@flamework/core";
import { Players } from "@rbxts/services";
import { FPSController } from "./FPSController";

@Controller({})
export class InputController implements OnStart {
    public constructor(
        private fps: FPSController
    ) {}

    public onStart(): void {
        Players.LocalPlayer.GetMouse().Button1Down.Connect(() => this.fps.shoot());
    }
}