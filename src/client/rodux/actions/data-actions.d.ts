import Rodux from "@rbxts/rodux";
import { PlayerData } from "shared/meta/default-player-data";

export interface ActionSetPlayerData extends Rodux.Action<"SetPlayerData"> {
  newPlayerData: Partial<PlayerData>;
}
