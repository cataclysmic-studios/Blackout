import { Controller, OnInit, OnRender } from "@flamework/core";
import { Players, SoundService as Sound, Workspace as World } from "@rbxts/services";
import { Events } from "client/network";
import { Crosshair } from "./Crosshair";
import { FPS } from "./FPS";
import { UI } from "./UI";

const { rad } = math;

type MenuPage = Folder & {
  Cam: CFrameValue;
};

@Controller({})
export class Menu implements OnInit, OnRender {
  private readonly plr = Players.LocalPlayer;
  private readonly mouse = this.plr.GetMouse();
  private initialCF = new CFrame;
  private currentPage?: MenuPage;

  public active = false;

  public constructor(
    private readonly fps: FPS,
    private readonly ui: UI,
    private readonly crosshair: Crosshair
  ) { }

  // Toggle visibility of page elements
  private togglePage(page: MenuPage, on?: boolean): void {
    for (const e of <GuiObject[]>page.GetChildren().filter(e => e.IsA("GuiObject")))
      e.Visible = on ?? !e.Visible;
  }

  // Disables current page and enables specified page
  public setPage(page: MenuPage): void {
    if (this.currentPage === page) return;
    if (this.currentPage)
      this.togglePage(this.currentPage, false);

    this.togglePage(page, true);
    this.initialCF = page.Cam.Value;
    this.currentPage = page;
  }

  // Camera rotation
  public onRender(dt: number): void {
    if (!this.active) return;

    const damp = 450;
    const { X: mx, Y: my } = new Vector2((this.initialCF.X - this.mouse.X) / damp, (this.initialCF.Y - this.mouse.Y) / damp);
    const camOffset = new CFrame().mul(CFrame.Angles(rad(my), rad(mx), 0));
    World.CurrentCamera!.CFrame = this.initialCF.mul(camOffset);
  }

  public onInit(): void {
    World.CurrentCamera!.CameraType = Enum.CameraType.Scriptable;
    World.CurrentCamera!.FieldOfView = 60;
    this.active = true;
  }

  // Menu is finished being used (play button is pressed)
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
