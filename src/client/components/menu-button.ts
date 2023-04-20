import { OnStart } from "@flamework/core";
import { Component, BaseComponent } from "@flamework/components";
import { Janitor } from "@rbxts/janitor";
import { MenuController } from "client/controllers/menu-controller";
import Tween from "shared/modules/utility/Tween";

interface Attributes { }

@Component({ tag: "MenuButton" })
export class MenuButton extends BaseComponent<Attributes, TextButton> implements OnStart {
  private readonly janitor = new Janitor;
  private readonly selectColor = Color3.fromRGB(255, 176, 15);
  private readonly defaultColors = {
    background: this.instance.BackgroundColor3,
    text: this.instance.TextColor3
  }

  public constructor(
    private readonly menu: MenuController
  ) {
    super();
  }


  /**
   * Destroy button
   */
  public destroy(): void {
    this.janitor.Cleanup();
  }

  /**
   * On start lifecycle method
   * 
   * @hidden
   */
  public onStart(): void {
    const info = new TweenInfo(.175, Enum.EasingStyle.Quad);
    this.janitor.Add(this.instance.MouseEnter.Connect(() =>
      Tween(this.instance, info, {
        BackgroundColor3: this.selectColor,
        TextColor3: Color3.fromRGB(27, 27, 27)
      })
    ));
    this.janitor.Add(this.instance.MouseLeave.Connect(() =>
      Tween(this.instance, info, {
        BackgroundColor3: this.defaultColors.background,
        TextColor3: this.defaultColors.text
      })
    ));
    this.janitor.Add(this.instance.MouseButton1Click.Connect(() => {
      switch (this.instance.Name) {
        case "Play":
          this.menu.destroy();
          this.destroy();
          break;

        default:
          print("unhandled");
          break;
      }
    }));
  }
}
