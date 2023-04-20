import { Controller, OnInit, OnRender } from "@flamework/core";
import { Players, SoundService as Sound, Workspace as World } from "@rbxts/services";
import { Events } from "client/network";
import { CrosshairController } from "./crosshair-controller";
import { ViewmodelController } from "./viewmodel-controller";
import { InterfaceController } from "./interface-controller";

const { rad } = math;

type MenuPage = Folder & {
  Cam: CFrameValue;
};

@Controller({})
export class MenuController implements OnInit, OnRender {
  private readonly plr = Players.LocalPlayer;
  private readonly mouse = this.plr.GetMouse();
  private initialCF = new CFrame;
  private currentPage?: MenuPage;

  public active = false;

  public constructor(
    private readonly fps: ViewmodelController,
    private readonly ui: InterfaceController,
    private readonly crosshair: CrosshairController
  ) { }

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
   * RenderStepped update function
   * 
   * @hidden
   * @param dt Delta time
   */
  public onRender(dt: number): void {
    if (!this.active) return;

    const damp = 450;
    const { X: mx, Y: my } = new Vector2((this.initialCF.X - this.mouse.X) / damp, (this.initialCF.Y - this.mouse.Y) / damp);
    const camOffset = new CFrame().mul(CFrame.Angles(rad(my), rad(mx), 0));
    World.CurrentCamera!.CFrame = this.initialCF.mul(camOffset);
  }

  /**
   * Initialisation lifecycle method
   * 
   * @hidden
   */
  public onInit(): void {
    World.CurrentCamera!.CameraType = Enum.CameraType.Scriptable;
    World.CurrentCamera!.FieldOfView = 60;
    this.active = true;
  }

  /**
   * Destroy/hide menu
   */
  public destroy(): void {
    World.CurrentCamera!.CameraType = Enum.CameraType.Custom;
    this.plr.CameraMode = Enum.CameraMode.LockFirstPerson;
    Sound.Music.Menu.Stop();

    this.crosshair.toggleMouseIcon();
    this.ui.getScreen("Menu").Enabled = false;
    this.ui.getHUD()?.toggle();

    this.fps.addWeapon("HK416", 1);
    this.active = false;
  }
}
