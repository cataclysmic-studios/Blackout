import { Component, BaseComponent } from "@flamework/components";
import { OnInit } from "@flamework/core";
import { Janitor } from "@rbxts/janitor";

interface Attributes {}

@Component({ tag: "HUD" })
export class HUD extends BaseComponent<Attributes, PlayerGui["HUD"]> implements OnInit {
    private readonly janitor = new Janitor;
    
    public onInit(): void {
        this.janitor.LinkToInstance(this.instance, false);
    }

    public toggle(): void {
        this.instance.Enabled = !this.instance.Enabled;
    }

    public destroy(): void {
        this.janitor.Cleanup();
    }
}