import { Controller, Dependency, OnRender } from "@flamework/core";
import { Players, Workspace as World } from "@rbxts/services";
import { AppController } from "./apps";

const { rad } = math;

interface MenuPage extends Folder {
  readonly Cam: CFrameValue;
}

@Controller()
export class MenuController implements OnRender {
  private readonly plr = Players.LocalPlayer;
  private readonly mouse = this.plr.GetMouse();
  private initialCF = new CFrame;

  public onRender(dt: number): void {
    const apps = Dependency<AppController>();
    if (!apps.isShowing("Menu")) return;
    const damp = 450;
    const { X, Y } = new Vector2((this.initialCF.X - this.mouse.X) / damp, (this.initialCF.Y - this.mouse.Y) / damp);
    const camOffset = new CFrame().mul(CFrame.Angles(rad(Y * dt * 60), rad(X * dt * 60), 0));
    World.CurrentCamera!.CFrame = this.initialCF.mul(camOffset);
  }
}
