import { Controller, OnRender, OnStart } from "@flamework/core";
import { Players, ReplicatedStorage, Workspace } from "@rbxts/services";

const camera = Workspace.CurrentCamera!;
const player = Players.LocalPlayer;

@Controller()
export class FirstPersonController implements OnStart, OnRender {
	private viewModel?: Instance;
	private weapon?: Model;

	onStart(): void {
		const humanoid = player.CharacterAdded.Wait()[0].WaitForChild("Humanoid") as Humanoid;
		humanoid.Died.Connect(() => this.onDied());

		this.viewModel = ReplicatedStorage.WaitForChild("Character").WaitForChild("ViewModel").Clone();
		this.weapon = (ReplicatedStorage.WaitForChild("Weapons").WaitForChild("HK416") as Model).Clone();

		this.weapon.Parent = this.viewModel;
		this.viewModel.Parent = camera;

		const joint = new Instance("Motor6D");
		joint.C0 = new CFrame(1, -1.5, -2);
		// joint.Part0 = this.viewModel.Head;
		// joint.Part1 = this.weapon.Handle;
		// joint.Parent = this.viewModel.Head;
	}

	onRender(dt: number): void {
		if (this.viewModel === undefined) return;

		const cameraPart = this.viewModel.FindFirstChild("Camera") as BasePart | undefined;
		if (cameraPart === undefined) return;

		cameraPart.CFrame = camera.CFrame;
	}

	private onDied() {
		if (this.viewModel === undefined) return;
		this.viewModel.Parent = undefined;
	}
}