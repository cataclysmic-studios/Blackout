import { Service } from "@flamework/core";
import { Players } from "@rbxts/services";
import { PlayerRemovalService } from "./removal-service";
import { DiscordService } from "../discord-service";
import { KickReason } from "shared/enums";
import ProfileService from "@rbxts/profileservice";
import DefaultPlayerData, { PlayerData, PlayerDataProfile } from "shared/meta/default-player-data";

@Service()
export class PlayerDataService {
	constructor(
		private readonly playerRemoval: PlayerRemovalService,
		private readonly discord: DiscordService
	) { }

	private gameProfileStore = ProfileService.GetProfileStore<PlayerData>("PlayerData", DefaultPlayerData);
	public readonly profiles = new Map<string, PlayerDataProfile>();

	/**
	 * Returns a loaded player data profile
	 * 
	 * @param player Player to get the loaded profile for
	 * @returns The player's loaded data profile
	 */
	public getProfile(userID: number): Maybe<PlayerDataProfile> {
		return this.profiles.get(tostring(userID));
	}

	/**
	 * Load a player's data profile
	 * 
	 * @param player Player to load the profile for
	 * @returns The player's data profile
	 */
	public async loadProfile(userID: number): Promise<Maybe<PlayerDataProfile>> {
		const dataKey = tostring(userID);
		const profile = this.gameProfileStore.LoadProfileAsync(dataKey, "ForceLoad");

		// The profile couldn't be loaded
		const player = Players.GetPlayerByUserId(userID);
		if (!player) return;
		if (profile === undefined)
			return this.playerRemoval.removeDueToBug(player, KickReason.PlayerProfileUndefined);

		// The player left before the profile could be loaded
		if (!player.IsDescendantOf(Players))
			profile.Release();

		// Fill in missing data from default data
		profile.Reconcile();
		profile.ListenToRelease(() => {
			if (!player.IsDescendantOf(game)) return;
			this.discord.log(player, "", "Data Saved");
		});

		this.profiles.set(dataKey, profile);
		return profile;
	}
}