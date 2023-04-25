import { Controller, OnStart } from "@flamework/core";
import { ClientStore } from "client/rodux/rodux";
import { AppScene } from "shared/enums";
import Signal from "@rbxts/signal";

@Controller()
export class SceneController implements OnStart {
	public OnSceneChanged = new Signal<(scene: AppScene, prevScene?: AppScene) => void>()

	public onStart(): void {
		this.triggerSceneChange(ClientStore.getState().gameState.currentScene);
		ClientStore.changed.connect((state, prevState) => {
			if (state.gameState.currentScene !== prevState.gameState.currentScene)
				this.triggerSceneChange(state.gameState.currentScene, prevState.gameState.currentScene);
		});
	}

	/**
	 * Creates a signal that fires when the current scene changes
	 * 
	 * @param {AppScene} scene
	 * @returns Signal that's fired when the scene changes
	 */
	public getSceneEnteredSignal(scene: AppScene): Signal {
		const sceneEntered = new Signal;
		this.OnSceneChanged.Connect(newScene => {
			if (newScene === scene) sceneEntered.Fire();
		});
		return sceneEntered;
	}

	/**
	 * Swaps the current scene out for a new one
	 * 
	 * @param {AppScene} scene
	 */
	public swapScene(scene: AppScene): void {
		ClientStore.dispatch({ type: "SetScene", newScene: scene });
	}

	/**
	 * Fires the OnSceneChanged event
	 * 
	 * @param {AppScene} scene
	 */
	private triggerSceneChange(scene: AppScene, prevScene?: AppScene): void {
		this.OnSceneChanged.Fire(scene, prevScene);
	}
}