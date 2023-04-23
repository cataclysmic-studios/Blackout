import { Service } from "@flamework/core";
import { PlayerRemovalService } from "./player-removal-service";
import ProfileService from "@rbxts/profileservice";
import DefaultPlayerData, { IPlayerData, PlayerDataProfile } from "shared/meta/default-player-data";
import { KickReason } from "types/enum/kick-reason";
import { Players } from "@rbxts/services";

@Service({})
export class PlayerDataService {
	constructor(private readonly playerRemovalService: PlayerRemovalService) { }

	private gameProfileStore = ProfileService.GetProfileStore<IPlayerData>("PlayerData", DefaultPlayerData);

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
		if (profile === undefined) return this.playerRemovalService.removePlayerForBug(player, KickReason.PlayerProfileUndefined);

		// The player left before the profile could be loaded
		if (!player.IsDescendantOf(Players)) profile.Release();

		// Fill in missing data from default data
		profile.Reconcile();

		// Listen for when the profile is released
		profile.ListenToRelease(() => {
			if (!player.IsDescendantOf(game)) return;
			this.playerRemovalService.removePlayerForBug(player, KickReason.PlayerProfileReleased);
		});

		return profile;
	}
}