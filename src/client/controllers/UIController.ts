import { Controller, OnStart, OnInit } from "@flamework/core";
import { Players } from "@rbxts/services";

@Controller({})
export class UIController {
    public getScreen(name: string): ScreenGui {
        return <ScreenGui>Players.LocalPlayer.WaitForChild("PlayerGui").WaitForChild(name);
    }
}