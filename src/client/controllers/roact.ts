import { Controller, OnInit } from "@flamework/core";
import Roact from "@rbxts/roact";

import { StaticUI } from "client/static-ui";
import { LoadScreen } from "client/ui/views/loadscreen";

@Controller()
export class RoactController implements OnInit {
  public onInit(): void {
    Roact.mount(LoadScreen, StaticUI.container);
  }
}
