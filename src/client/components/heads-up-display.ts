import { Component, BaseComponent } from "@flamework/components";
import { OnInit } from "@flamework/core";
import { Janitor } from "@rbxts/janitor";

interface Attributes { }

@Component({ tag: "HUD" })
export class HUD extends BaseComponent<Attributes, ScreenGui> implements OnInit {
  private readonly janitor = new Janitor;

  /** @hidden */
  public onInit(): void {
    this.janitor.LinkToInstance(this.instance, false);
  }

  /**
   * Toggle HUD
   */
  public toggle(): void {
    this.instance.Enabled = !this.instance.Enabled;
  }

  /**
   * Destroy HUD
   */
  public destroy(): void {
    this.janitor.Cleanup();
  }
}
