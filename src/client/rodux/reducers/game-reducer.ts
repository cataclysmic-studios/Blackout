import { ActionSetScene } from "../actions/scene-actions";
import Rodux from "@rbxts/rodux";
import { AppScene } from "shared/enums";

export interface GameReducer {
	currentScene: AppScene;
}

const InitialState = {
	currentScene: AppScene.Menu,
};

export type GameActions = ActionSetScene;

export const gameReducer = Rodux.createReducer<GameReducer, GameActions>(InitialState, {
	SetScene: (state, action) => {
		return { ...state, currentScene: action.newScene };
	}
});