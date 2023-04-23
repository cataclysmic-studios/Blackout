import { Controller, OnInit } from "@flamework/core";
import Roact from "@rbxts/roact";

import { StaticUI } from "client/static-ui";
import { LoadScreen } from "client/ui/views/loadscreen";
import { HUD } from "client/ui/views/hud";

@Controller()
export class RoactController implements OnInit {
  public onInit(): void {
    Roact.mount(LoadScreen, StaticUI.container);
    Roact.mount(HUD, StaticUI.container);
  }
}
