import { Components } from "@flamework/components";
import { Controller, Dependency } from "@flamework/core";
import { Players } from "@rbxts/services";
import { WaitFor } from "shared/modules/utility/WaitFor";
import { HUD } from "client/components/HUD";

@Controller({})
export class UI {
  private readonly playerUI = WaitFor<PlayerGui>(Players.LocalPlayer, "PlayerGui");

  // Returns the HUD component
  public getHUD(): HUD | undefined {
    const components = Dependency<Components>();
    const hud = components.getComponent<HUD>(this.getScreen("HUD"));
    return hud;
  }

  // Returns a ScreenGui inside of PlayerGui
  public getScreen<T extends keyof PlayerGui>(name: T): PlayerGui[T] {
    return <PlayerGui[T]>this.playerUI.WaitForChild(name);
  }
}
