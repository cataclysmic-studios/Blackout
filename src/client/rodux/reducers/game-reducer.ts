import { Scene } from "types/enum/scene";
import { ActionSetScene } from "../actions/scene-actions";
import Rodux from "@rbxts/rodux";

export interface GameReducer {
	currentScene: Scene;
}

const InitialState = {
	currentScene: Scene.Menu,
};

export type GameActions = ActionSetScene;

export const gameReducer = Rodux.createReducer<GameReducer, GameActions>(InitialState, {
	SetScene: (state, action) => {
		return { ...state, currentScene: action.newScene };
	}
});