import { OnStart } from "@flamework/core";
import { Component, BaseComponent } from "@flamework/components";
import { Janitor } from "@rbxts/janitor";
import { ViewmodelController } from "client/controllers/viewmodel-controller";

interface Attributes { }

interface AmmoUI extends Frame {
  UICorner: UICorner;
  UIPadding: UIPadding;
  UIStroke: UIStroke;
  Line: Frame;
  Mag: TextLabel & {
    UIStroke: UIStroke;
    UIGradient: UIGradient;
    UIPadding: UIPadding;
  };
  Reserve: TextLabel & {
    UIStroke: UIStroke;
    UIGradient: UIGradient;
    UIPadding: UIPadding;
  };
}

@Component({ tag: "AmmoHUD" })
export class AmmoHUD extends BaseComponent<Attributes, AmmoUI> implements OnStart {
  private readonly janitor = new Janitor;

  public constructor(
    private readonly fps: ViewmodelController
  ) {
    super();
  }

  /**
   * Cleanup
   */
  public destroy(): void {
    this.janitor.Cleanup();
  }

  /**
   * On start lifecycle method
   * @hidden
   */
  public onStart(): void {
    this.janitor.Add(this.fps.events.ammoChanged.Connect(ammo => {
      this.instance.Mag.Text = tostring(ammo.mag);
      this.instance.Reserve.Text = tostring(ammo.reserve);
    }));
  }
}
