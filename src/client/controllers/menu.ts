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
  private currentPage?: MenuPage;

  public onRender(dt: number): void {
    const apps = Dependency<AppController>();
    if (!apps.isShowing("Menu")) return;
    const damp = 450;
    const { X, Y } = new Vector2((this.initialCF.X - this.mouse.X) / damp, (this.initialCF.Y - this.mouse.Y) / damp);
    const camOffset = new CFrame().mul(CFrame.Angles(rad(Y), rad(X), 0));
    World.CurrentCamera!.CFrame = this.initialCF.mul(camOffset);
  }

  /**
   * Set/toggle visibility of page elements
   * 
   * @param page Menu page
   * @param on Whether or not to show page
   */
  private togglePage(page: MenuPage, on?: boolean): void {
    for (const e of <GuiObject[]>page.GetChildren().filter(e => e.IsA("GuiObject")))
      e.Visible = on ?? !e.Visible;
  }

  /**
   * Disables the current page and enables the desired page
   * 
   * @param page Desired page
   */
  public setPage(page: MenuPage): void {
    if (this.currentPage === page) return;
    if (this.currentPage)
      this.togglePage(this.currentPage, false);

    this.togglePage(page, true);
    this.initialCF = page.Cam.Value;
    this.currentPage = page;
  }
}
