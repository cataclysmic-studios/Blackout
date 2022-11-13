import { Controller, OnStart } from "@flamework/core";
import { Players } from "@rbxts/services";
import { FPSController } from "./FPSController";

@Controller({})
export class InputController implements OnStart {
    public constructor(
        private fps: FPSController
    ) {}

    public onStart(): void {
        const mouse = Players.LocalPlayer.GetMouse();
        mouse.Button1Down.Connect(() => {
            this.fps.toggleTriggerPull(true);
            this.fps.shoot();
        });

        mouse.Button1Up.Connect(() => this.fps.toggleTriggerPull(false));
    }
}