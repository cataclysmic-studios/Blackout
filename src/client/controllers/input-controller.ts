import { Controller, OnStart } from "@flamework/core";
import { Players, UserInputService as UIS } from "@rbxts/services";
import { ViewmodelController } from "./viewmodel-controller";
import { MovementController } from "./movement-controller";

@Controller({})
export class InputController implements OnStart {
  public mouseDown = false;

  public constructor(
    private readonly fps: ViewmodelController,
    private readonly movement: MovementController
  ) { }

  /** @hidden */
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
      switch (key.Name) {
        case "C":
          cHeld = false;
          timeCHeld = 0;
          break;
      }
    })

    UIS.InputBegan.Connect(({ KeyCode: key }) => {
      switch (key.Name) {
        case "One":
          if (this.fps.state.currentSlot === 1)
            this.fps.unequip();
          else
            this.fps.equip(1);
          break;
        case "Two":
          if (this.fps.state.currentSlot === 2)
            this.fps.unequip();
          else
            this.fps.equip(2);
          break;
        case "Three":
          if (this.fps.state.currentSlot === 3)
            this.fps.unequip();
          else
            this.fps.equip(3);
          break;

        case "F":
          this.fps.melee();
          break

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
              timeCHeld += 1 / 30;
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

        case "P":
          UIS.MouseIconEnabled = !UIS.MouseIconEnabled;
          break;
      }
    });
  }
}
