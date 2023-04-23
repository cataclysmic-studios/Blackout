import Rodux from "@rbxts/rodux";
import { Scene } from "shared/enums";

export interface ActionSetScene extends Rodux.Action<"SetScene"> {
	newScene: Scene;
}