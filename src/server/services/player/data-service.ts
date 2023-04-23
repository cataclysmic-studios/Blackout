import { Service } from "@flamework/core";
<<<<<<< HEAD:src/server/services/player/player-data-service.ts
import { PlayerRemovalService } from "./player-removal-service";
import ProfileService from "@rbxts/profileservice";
import DefaultPlayerData, { PlayerData, PlayerDataProfile } from "shared/meta/default-player-data";
import { KickReason } from "types/enum/kick-reason";
=======
>>>>>>> 5fea7b3dc15d7e1376cbd12fda5a7f68ed7f0638:src/server/services/player/data-service.ts
import { Players } from "@rbxts/services";
import { KickReason } from "types/enum/kick-reason";
import { PlayerRemovalService } from "./removal-service";

import ProfileService from "@rbxts/profileservice";
import DefaultPlayerData, { PlayerData, PlayerDataProfile } from "shared/meta/default-player-data";

@Service()
export class PlayerDataService {
	constructor(
		private readonly playerRemoval: PlayerRemovalService
	) { }

	private gameProfileStore = ProfileService.GetProfileStore<PlayerData>("PlayerData", DefaultPlayerData);

	/**
	 * Load a player's data profile
	 * 
	 * @param player Player to load the profile for
	 * @returns The player's data profile
	 */
	public async loadPlayerProfile(player: Player): Promise<PlayerDataProfile | void> {
		const dataKey = tostring(player.UserId);
		const profile = this.gameProfileStore.LoadProfileAsync(dataKey, "ForceLoad");

		// The profile couldn't be loaded
		if (profile === undefined)
			return this.playerRemoval.removeDueToBug(player, KickReason.PlayerProfileUndefined);

		// The player left before the profile could be loaded
		if (!player.IsDescendantOf(Players))
			profile.Release();

		// Fill in missing data from default data
		profile.Reconcile();
		profile.ListenToRelease(() => {
			if (!player.IsDescendantOf(game)) return;
			this.playerRemoval.removeDueToBug(player, KickReason.PlayerProfileReleased);
		});

		return profile;
	}
}