import { Controller, Dependency, OnStart } from "@flamework/core";
import { Components } from "@flamework/components";
import { Players, ReplicatedStorage as Replicated, Workspace } from "@rbxts/services";
import { Janitor } from "@rbxts/janitor";
import { WeaponModel } from "shared/interfaces/game-types";
import { waitFor } from "shared/utility";
import ViewModel from "client/components/view-model";

const camera = Workspace.CurrentCamera!;
const player = Players.LocalPlayer;

@Controller()
export class FirstPersonController implements OnStart {
	private readonly lifeJanitor = new Janitor;
	private viewModel?: ViewModel;
	private weapon?: WeaponModel;

	public onStart(): void {
		const [character] = player.CharacterAdded.Wait();
		const humanoid = waitFor<Humanoid>(character, "Humanoid");
		this.lifeJanitor.Add(() => this.onDied());
		humanoid.Died.Connect(() => this.lifeJanitor.Cleanup());

		const components = Dependency<Components>();
		const model = waitFor<Model>(Replicated.WaitForChild("Character"), "ViewModel").Clone();
		this.viewModel = components.addComponent<ViewModel>(model);

		this.weapon = waitFor<WeaponModel>(Replicated.WaitForChild("Weapons"), "HK416 (test)").Clone();
		this.weapon.Parent = model;
		model.Parent = camera;

		const joint = new Instance("Motor6D");
		joint.C0 = new CFrame(1, -1.5, -2);
		// joint.Part0 = this.viewModel.Head;
		// joint.Part1 = this.weapon.Handle;
		// joint.Parent = this.viewModel.Head;
	}

	private onDied(): void {
		if (!this.viewModel) return;
		this.viewModel.instance.Parent = undefined;
	}
}