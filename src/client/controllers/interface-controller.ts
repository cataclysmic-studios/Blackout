import { Components } from "@flamework/components";
import { Controller, Dependency } from "@flamework/core";
import { Players } from "@rbxts/services";
import { WaitFor } from "shared/modules/utility/WaitFor";
import { HUD } from "client/components/heads-up-display";

@Controller({})
export class InterfaceController {
  private readonly playerUI = WaitFor<PlayerGui>(Players.LocalPlayer, "PlayerGui");

  /**
   * Function to get the HUD component
   * 
   * @returns HUD component
   */
  public getHUD(): HUD | undefined {
    const components = Dependency<Components>();
    const hud = components.getComponent<HUD>(this.getScreen("HUD"));
    return hud;
  }

  /**
   * Returns a ScreenGui inside of PlayerGui
   * 
   * @param name ScreenGui name
   * @returns ScreenGui with the given name
   */
  public getScreen<T extends keyof PlayerGui>(name: T): PlayerGui[T] {
    return <PlayerGui[T]>this.playerUI.WaitForChild(name);
  }
}
