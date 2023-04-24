import { OnInit, OnStart, Service } from "@flamework/core";
import { Players } from "@rbxts/services";
import { Janitor } from "@rbxts/janitor";
import { KickReason } from "shared/enums";
import { Functions } from "server/network";
import { ServerResponse } from "shared/interfaces/network-types";
import { PlayerData } from "shared/meta/default-player-data";
import { PlayerDataService } from "./data-service";
import { PlayerRemovalService } from "./removal-service";
import Signal from "@rbxts/signal";
import PlayerEntity from "server/modules/classes/player-entity";

@Service()
export class PlayerService implements OnStart, OnInit {
	// what does this need to do?
	// - load player data
	// - save player data

	private playerEntities = new Map<Player, PlayerEntity>;
	private onEntityRemoving = new Signal;

	constructor(
		private readonly playerData: PlayerDataService,
		private readonly playerRemoval: PlayerRemovalService
	) { }

	public onInit(): void {
		Players.PlayerAdded.Connect(player => this.onPlayerAdded(player));
		Players.PlayerRemoving.Connect(player => this.onPlayerRemoving(player));
		game.BindToClose(() => {
			while (this.playerEntities.size() > 0)
				this.onEntityRemoving.Wait();
		});
	}

	public onStart(): void {
		Functions.requestPlayerData.setCallback(player => this.onPlayerRequestedData(player));
	}

	private onPlayerRequestedData(player: Player): ServerResponse<PlayerData> {
		const entity = this.playerEntities.get(player);
		if (!entity) return { success: false, error: "Player entity not found" };

		return { success: true, data: entity.data };
	}


	private async onPlayerAdded(player: Player) {
		const profile = await this.playerData.loadProfile(player);
		if (!profile)
			return this.playerRemoval.removeDueToBug(player, KickReason.PlayerEntityInstantiationError);

		const janitor = new Janitor;
		janitor.Add(() => {
			player.SetAttribute("PlayerRemoving", true);
			profile.Release();

			this.playerEntities.delete(player);
			this.onEntityRemoving.Fire();
		}, true);

		const playerEntity = new PlayerEntity(player, janitor, profile);
		this.playerEntities.set(player, playerEntity)
	}

	private onPlayerRemoving(player: Player) {
		const playerEntity = this.playerEntities.get(player);
		if (!playerEntity) return;
		playerEntity.destroy();
	}

	public getPlayerEntity(player: Player) {
		return this.playerEntities.get(player);
	}
}