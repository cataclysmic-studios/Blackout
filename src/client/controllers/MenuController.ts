import { Controller, OnInit, OnRender } from "@flamework/core";
import { Players, Workspace as World } from "@rbxts/services";

const { rad } = math;

type MenuPage = Folder & {
    Cam: CFrameValue;
};

@Controller({})
export class MenuController implements OnInit, OnRender {
    private readonly mouse = Players.LocalPlayer.GetMouse();
    private initialCF = new CFrame;
    private active = false;
    private currentPage?: MenuPage;

    private togglePage(page: MenuPage, on?: boolean): void {
        for (const e of <GuiObject[]>page.GetChildren().filter(e => e.IsA("GuiObject")))
            e.Visible = on ?? !e.Visible;
    }

    public setPage(page: MenuPage): void {
        if (this.currentPage === page) return;
        if (this.currentPage)
            this.togglePage(this.currentPage, false);

        this.togglePage(page, true);
        this.initialCF = page.Cam.Value;
        this.currentPage = page;
    }

    public onRender(dt: number): void {
        if (!this.active) return;

        const damp = 450
        const { X: mx, Y: my } = new Vector2((this.initialCF.X - this.mouse.X) / damp, (this.initialCF.Y - this.mouse.Y) / damp);
        const camOffset = new CFrame().mul(CFrame.Angles(rad(my), rad(mx), 0));
        World.CurrentCamera!.CFrame = this.initialCF.mul(camOffset);
    }

    public onInit(): void {
        World.CurrentCamera!.CameraType = Enum.CameraType.Scriptable;
        World.CurrentCamera!.FieldOfView = 60;
        this.active = true;
    }

    public destroy(): void {
        this.active = false;
        World.CurrentCamera!.CameraType = Enum.CameraType.Custom;
    }
}