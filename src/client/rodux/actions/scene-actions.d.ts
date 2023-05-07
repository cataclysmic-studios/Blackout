import Rodux from "@rbxts/rodux";
import { AppScene } from "shared/enums";

export interface ActionSetScene extends Rodux.Action<"SetScene"> {
  newScene: AppScene;
}
