import { Controller, OnStart } from "@flamework/core";
import { Players, UserInputService as UIS } from "@rbxts/services";
import { FPSController } from "./FPSController";

@Controller({})
export class InputController implements OnStart {
    public mouseDown = false;

    public constructor(
        private readonly fps: FPSController
    ) {}


    public onStart(): void {
        const mouse = Players.LocalPlayer.GetMouse();
        mouse.Button1Down.Connect(() => {
            this.fps.mouseDown = true;
            this.fps.toggleTriggerPull(true);
            this.fps.shoot();
        });
        mouse.Button1Up.Connect(() => {
            this.fps.toggleTriggerPull(false);
            this.fps.mouseDown = false;
        });

        mouse.Button2Down.Connect(() => this.fps.aim(true));
        mouse.Button2Up.Connect(() => this.fps.aim(false));
        UIS.InputBegan.Connect(({ KeyCode: key }) => {
            switch(key.Name) {
                case "R":
                    this.fps.reload();
                    break;
                case "H":
                    this.fps.inspect();
                    break;

                case "Q":
                case "E":
                    // this.fps.lean(key.Name === "Q" ? -1 : 1);
                    break;
            }
        });
    }
}