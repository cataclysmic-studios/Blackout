import { Controller, OnInit } from "@flamework/core";
import Roact from "@rbxts/roact";

import { UI } from "client/ui";
import { Menu } from "client/roact/menu";
import { HUD } from "client/roact/hud";

@Controller()
export class RoactController implements OnInit {
  public onInit(): void {
    Roact.mount(HUD, UI.container);
    Roact.mount(Menu, UI.container);
  }
}
