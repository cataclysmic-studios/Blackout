import DefaultPlayerData, { PlayerData } from "shared/meta/default-player-data";
import { ActionSetPlayerData } from "../actions/data-actions";
import Rodux from "@rbxts/rodux";

export type DataReducer = PlayerData;

const InitialState: DataReducer = DefaultPlayerData;

export type DataActions = ActionSetPlayerData;

export const dataReducer = Rodux.createReducer<DataReducer, DataActions>(
  InitialState,
  {
    SetPlayerData: (state, action) => {
      return { ...state, ...action.newPlayerData };
    },
  }
);
