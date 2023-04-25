import { Controller, OnStart } from "@flamework/core";
import { ClientStore } from "client/rodux/rodux";
import { AppScene } from "shared/enums";
import Signal from "@rbxts/signal";

@Controller()
export class SceneController implements OnStart {
	public OnSceneChanged = new Signal<(newScene: AppScene, prevScene?: AppScene) => void>()

	public onStart(): void {
		this.onSceneChanged(ClientStore.getState().gameState.currentScene);
		ClientStore.changed.connect((newState, oldState) => {
			if (newState.gameState.currentScene !== oldState.gameState.currentScene)
				this.onSceneChanged(newState.gameState.currentScene, oldState.gameState.currentScene);
		});
	}

	public getSceneEnteredSignal(scene: AppScene): Signal {
		const sceneEntered = new Signal;
		this.OnSceneChanged.Connect(newScene => {
			if (newScene === scene) sceneEntered.Fire();
		});
		return sceneEntered;
	}

	public setScene(newScene: AppScene) {
		ClientStore.dispatch({ type: "SetScene", newScene });
	}

	private onSceneChanged(newScene: AppScene, prevScene?: AppScene) {
		this.OnSceneChanged.Fire(newScene, prevScene);
	}
}