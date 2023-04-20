import { Controller } from "@flamework/core";
import { UserInputService as UIS } from "@rbxts/services";
import { WaitFor } from "shared/modules/utility/WaitFor";
import { WeaponData } from "shared/modules/Types";
import { InterfaceController } from "./interface-controller";
import Tween from "shared/modules/utility/Tween";

@Controller({})
export class CrosshairController {
  private enabled = false;
  private size = 1;
  private tweenSpeed = .075;

  public maxSize = 10;

  public constructor(
    private readonly ui: InterfaceController
  ) { }

  /**
   * Toggle crosshair dot
   */
  public toggleDot(): void {
    const hud = this.ui.getScreen("HUD");
    const dot = WaitFor<Frame>(hud, "Dot");
    const frame = WaitFor<Frame>(hud, "Crosshair");
    dot.Visible = !frame.Visible
  }

  /**
   * Toggle crosshair visiblity
   */
  public toggle(): void {
    const hud = this.ui.getScreen("HUD");
    const frame = WaitFor<Frame>(hud, "Crosshair");
    this.enabled = !this.enabled;
    frame.Visible = !frame.Visible;
  }

  /**
   * Increase the size of the crosshair
   * 
   * @param value Size to add
   * @returns Tween animating size
   */
  public addSize(value: number): Tween {
    this.size += value;
    return this.update();
  }

  /**
   * Set the crosshair's size
   * 
   * @param value Size
   * @returns Tween animating size
   */
  public setSize(value: number): Tween {
    this.size = value;
    return this.update();
  }

  /**
   * Temporarily increase the size of the crosshair
   * 
   * @param weaponData Weapon data 
   */
  public pulse({ crossExpansion }: WeaponData): void {
    const inc = crossExpansion.shoot;
    this.addSize(inc);
    task.delay(this.tweenSpeed * 1.3, () => this.addSize(-inc));
  }

  /**
   * Tween crosshair size
   */
  public update(): Tween {
    this.size = math.clamp(this.size, 0, this.maxSize);

    const hud = this.ui.getScreen("HUD");
    const frame = WaitFor<Frame>(hud, "Crosshair");
    const info = new TweenInfo(this.tweenSpeed, Enum.EasingStyle.Quad);
    const sizeTween = Tween(frame, info, {
      Size: UDim2.fromScale(this.size / 10, this.size / 10)
    });

    for (const line of <Frame[]>frame.GetChildren().filter(c => c.IsA("Frame")))
      Tween(line, info, {
        BackgroundTransparency: this.size === 0 ? 1 : 0
      });

    return sizeTween;
  }

  /**
   * Toggle mouse icon enabled
   */
  public toggleMouseIcon(): void {
    UIS.MouseIconEnabled = !UIS.MouseIconEnabled;
  }
}
