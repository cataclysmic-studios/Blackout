import { Controller, OnStart } from "@flamework/core";
import { Players, UserInputService as UIS } from "@rbxts/services";
import { FPS } from "./FPS";
import { Movement } from "./Movement";

@Controller({})
export class InputController implements OnStart {
    public mouseDown = false;

    public constructor(
        private readonly fps: FPS,
        private readonly movement: Movement
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

        let cHeld = false;
        let timeCHeld = 0;
        UIS.InputEnded.Connect(({ KeyCode: key }) => {
            switch(key.Name) {
                case "C":
                    cHeld = false;
                    timeCHeld = 0;
                    break;
            }
        })

        UIS.InputBegan.Connect(({ KeyCode: key }) => {
            switch(key.Name) {
                case "R":
                    this.fps.reload();
                    break;
                case "H":
                    this.fps.inspect();
                    break;

                case "X": {
                    if (this.fps.state.proned) {
                        this.movement.prone(false);
                        this.movement.crouch(true);
                    } else
                        this.movement.crouch();
                    break;
                }
                case "C": {
                    if (this.fps.state.proned) {
                        this.movement.prone(false);
                        this.movement.crouch(true);
                    } else
                        this.movement.crouch();

                    task.spawn(() => {
                        cHeld = true;
                        while (cHeld) {
                            task.wait();
                            timeCHeld += 1/30;
                            if (timeCHeld > 1.25 && this.fps.state.crouched)
                                this.movement.prone(true);
                        }
                    });
                    break;
                }

                case "Q":
                case "E":
                    this.movement.lean(key.Name === "Q" ? -1 : 1);
                    break;
            }
        });
    }
}