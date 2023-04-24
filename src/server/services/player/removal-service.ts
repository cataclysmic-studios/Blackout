import { Service } from "@flamework/core";
import { GAME_NAME } from "shared/shared-constants";
import { BanReason, KickReason } from "shared/enums";
import { DiscordService } from "../discord-service";
import { PlayerDataService } from "./data-service";
import { BanService } from "./ban-service";

@Service()
export class PlayerRemovalService {
	public constructor(
		private readonly discord: DiscordService,
		private readonly playerData: PlayerDataService,
		private readonly banService: BanService
	) { }

	private remove(player: Player, message: string, reason: KickReason): void {
		player.Kick(message + "\nKick Reason: " + reason);
	}

	public removeDueToBan(player: Player, reason: BanReason): void {
		this.remove(player, "You have been banned.\nBan Reason: " + reason, KickReason.Banned);
	}

	public ban(player: Player, reason: BanReason): void {
		const profile = this.playerData.getProfile(player.UserId);
		if (!profile)
			return this.removeDueToBug(player, KickReason.PlayerProfileUndefined);

		this.banService.ban(player, reason);
		this.discord.log(player, "Player was banned.\nBan Reason: " + reason, "Player Banned")
	}

	public removeDueToBug(player: Player, reason: KickReason): void {
		player.Kick(
			"\n\nYou have been kicked from the game due to a bug. This has been logged " +
			"but you should also report this to the developers with more information " +
			"and steps to reproduce the bug in our communication server.\n\n" +
			`${GAME_NAME} Error Code: ${reason}`
		);
		this.discord.log(player, `Player was removed.\n${GAME_NAME} Error Code: ${reason}`, "Player Removed Due To Bug");
	}
}