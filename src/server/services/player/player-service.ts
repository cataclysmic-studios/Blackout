import { OnInit, Service } from "@flamework/core";
import { Players } from "@rbxts/services";
import { PlayerDataService } from "./player-data-service";
import { PlayerRemovalService } from "./player-removal-service";
import { KickReason } from "types/enum/kick-reason";
import { Janitor } from "@rbxts/janitor";
import PlayerEntity from "server/modules/classes/player-entity";
import Signal from "@rbxts/signal";

@Service()
export class PlayerService implements OnInit {
	// what does this need to do?
	// - load player data
	// - save player data
	// - implement OnPlayerJoin lifecycle hook

	private playerEntities = new Map<Player, PlayerEntity>;
	private onEntityRemoving = new Signal;

	constructor(
		private readonly playerData: PlayerDataService,
		private readonly playerRemoval: PlayerRemovalService
	) { }

	public onInit(): void {
		Players.PlayerAdded.Connect((player) => this.onPlayerAdded(player));
		Players.PlayerRemoving.Connect((player) => this.onPlayerRemoving(player));
		game.BindToClose(() => {
			while (this.playerEntities.size() > 0)
				this.onEntityRemoving.Wait();
		});
	}

	private async onPlayerAdded(player: Player) {
		const playerProfile = await this.playerData.loadPlayerProfile(player);
		if (!playerProfile) return this.playerRemoval.removeDueToBug(player, KickReason.PlayerEntityInstantiationError);

		const janitor = new Janitor();
		janitor.Add(() => {
			player.SetAttribute("PlayerRemoving", true);
			playerProfile.Release();

			this.playerEntities.delete(player);
			this.onEntityRemoving.Fire();
		}, true);

		const playerEntity = new PlayerEntity(player, janitor, playerProfile);
		this.playerEntities.set(player, playerEntity)
	}

	private onPlayerRemoving(player: Player) {
		const playerEntity = this.playerEntities.get(player);
		if (!playerEntity) return;
		playerEntity.janitor.Destroy();
	}

	public getPlayerEntity(player: Player) {
		return this.playerEntities.get(player);
	}
}