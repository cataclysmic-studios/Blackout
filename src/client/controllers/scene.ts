import { Controller, OnStart } from "@flamework/core";
import Signal from "@rbxts/signal";
import { ClientStore } from "client/rodux/rodux";
import { Scene } from "shared/enums";

@Controller({})
export class SceneController implements OnStart {
	public OnSceneChanged = new Signal<(newScene: Scene, oldScene?: Scene) => void>()

	public onStart(): void {
		this.onSceneChanged(ClientStore.getState().gameState.currentScene);

		ClientStore.changed.connect((newState, oldState) => {
			if (newState.gameState.currentScene !== oldState.gameState.currentScene) {
				this.onSceneChanged(newState.gameState.currentScene, oldState.gameState.currentScene);
			}
		});
	}

	public getSceneEnteredSignal(scene: Scene): Signal {
		const sceneEntered = new Signal();
		this.OnSceneChanged.Connect((newScene, oldScene) => {
			if (newScene === scene) sceneEntered.Fire();
		});
		return sceneEntered;
	}

	public setScene(newScene: Scene) {
		ClientStore.dispatch({ type: "SetScene", newScene });
	}

	private onSceneChanged(newScene: Scene, oldScene?: Scene) {
		print(`Scene changed to ${newScene}`);
		this.OnSceneChanged.Fire(newScene, oldScene);
	}
}