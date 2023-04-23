import { Players } from "@rbxts/services";
import { waitFor } from "shared/utility";
// import { HUD } from "client/components/heads-up-display";

export class UI {
  public static readonly container = waitFor<PlayerGui>(Players.LocalPlayer, "PlayerGui");

  /**
   * Function to get the HUD component
   * 
   * @returns HUD component
   */
  public static getHUD() {
    // const components = Dependency<Components>();
    // const hud = components.getComponent<HUD>(this.getScreen("HUD"));
    // return hud;
    return this.getScreen("HUD");
  }

  /**
   * Returns a ScreenGui inside of PlayerGui
   * 
   * @param name ScreenGui name
   * @returns ScreenGui with the given name
   */
  public static getScreen<T extends Exclude<keyof PlayerGui, Instance>>(name: T): PlayerGui[T] {
    return <PlayerGui[T]>this.container.WaitForChild(name);
  }
}
