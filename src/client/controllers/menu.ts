import { Controller, OnRender, OnStart } from "@flamework/core";
import { Players, ReplicatedStorage as Replicated, SoundService as Sound, Workspace as World } from "@rbxts/services";
import { CrosshairController } from "./crosshair";
import { FPSController } from "./fps";
import { StaticUI } from "../static-ui";

const { rad } = math;

interface MenuPage extends Folder {
  readonly Cam: CFrameValue;
}

@Controller()
export class MenuController implements OnStart, OnRender {
  private readonly plr = Players.LocalPlayer;
  private readonly mouse = this.plr.GetMouse();
  private initialCF = new CFrame;
  private currentPage?: MenuPage;

  public active = false;

  public constructor(
    private readonly fps: FPSController,
    private readonly crosshair: CrosshairController
  ) { }

  public onStart(): void {
    // World.CurrentCamera!.CameraType = Enum.CameraType.Scriptable;
    // World.CurrentCamera!.FieldOfView = 60;
    // this.active = true;

    // const menu = UI.getScreen("Menu");
    // for (const cam of Replicated.MenuCameras.GetChildren()) {
    //   const camCF = cam.Clone();
    //   camCF.Name = "Cam";
    //   camCF.Parent = <Folder>menu[<keyof typeof menu>cam.Name];
    // }

    // this.setPage(menu.Main);
  }

  public onRender(dt: number): void {
    if (!this.active) return;

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

  /**
   * Destroy/hide menu
   */
  public destroy(): void {
    World.CurrentCamera!.CameraType = Enum.CameraType.Custom;
    this.plr.CameraMode = Enum.CameraMode.LockFirstPerson;
    Sound.Music.Menu.Stop();

    this.crosshair.toggleMouseIcon();
    StaticUI.getScreen("Menu").Enabled = false;
    // this.ui.getHUD()?.toggle();
    const hud = StaticUI.getHUD()!;
    hud.Enabled = !hud.Enabled

    this.fps.addWeapon("HK416", 1);
    this.active = false;
  }
}
