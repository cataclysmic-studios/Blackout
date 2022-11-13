import { Controller, OnStart } from "@flamework/core";
import { Action } from "@rbxts/gamejoy/out/Actions";
import { Players } from "@rbxts/services";
import { FPSController } from "./FPSController";

@Controller({})
export class InputController implements OnStart {
    public constructor(
        private readonly fps: FPSController
    ) {}

    public onStart(): void {
        const mouse = Players.LocalPlayer.GetMouse();

        mouse.Button1Down.Connect(() => {
            this.fps.toggleTriggerPull(true);
            this.fps.shoot();
        });

        mouse.Button1Up.Connect(() => this.fps.toggleTriggerPull(false));
        mouse.Button2Down.Connect(() => this.fps.aim(true));
        mouse.Button2Up.Connect(() => this.fps.aim(false));

        const reload = new Action("R");
        reload.Began.Connect(() => this.fps.reload());
    }
}