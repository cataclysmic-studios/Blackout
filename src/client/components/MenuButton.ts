import { OnStart } from "@flamework/core";
import { Component, BaseComponent } from "@flamework/components";
import { Janitor } from "@rbxts/janitor";

interface Attributes {}

@Component({ tag: "MenuButton" })
export class MenuButton extends BaseComponent<Attributes, TextButton> implements OnStart {
    private readonly janitor = new Janitor;
    private readonly selectColor = Color3.fromRGB(255, 155, 16);
    private readonly defaultColors = {
        background: this.instance.BackgroundColor3,
        text: this.instance.TextColor3
    }

    public destroy(): void {
        this.janitor.Cleanup();
    }

    public onStart(): void {
        this.janitor.LinkToInstance(this.instance, false);
        this.janitor.Add(this.instance.MouseEnter.Connect(() => {
            this.instance.BackgroundColor3 = this.selectColor;
            this.instance.TextColor3 = Color3.fromRGB(27, 27, 27);
        }));
        this.janitor.Add(this.instance.MouseLeave.Connect(() => {
            this.instance.BackgroundColor3 = this.defaultColors.background;
            this.instance.TextColor3 = this.defaultColors.text;
        }));
    }
}