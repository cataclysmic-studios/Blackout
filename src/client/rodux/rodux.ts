import Rodux from "@rbxts/rodux";
import { DataActions, DataReducer, dataReducer } from "./reducers/data-reducer";
import { GameActions, GameReducer, gameReducer } from "./reducers/game-reducer";

export interface ClientStore {
	gameState: GameReducer,
	playerData: DataReducer,
}

export type StoreActions = GameActions | DataActions;

export const StoreReducer = Rodux.combineReducers<ClientStore, StoreActions>({
	gameState: gameReducer,
	playerData: dataReducer,
});

export const ClientStore = new Rodux.Store<ClientStore, StoreActions>(StoreReducer, {}, [
	Rodux.thunkMiddleware,
] as never); // `never` is a hacky way to get around Rodux's fiddly type definitions (should be fine)