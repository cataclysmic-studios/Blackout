import { Service } from "@flamework/core";
import { GAME_NAME } from "shared/shared-constants";
import { DiscordService } from "../discord-service";
import { BanReason, KickReason } from "shared/enums";

@Service()
export class PlayerRemovalService {
	public constructor(
		private readonly discord: DiscordService
	) { }

	public ban(player: Player, reason: BanReason): void {

	}

	public removeDueToBug(player: Player, reason: KickReason): void {
		player.Kick(
			"\n\nYou have been kicked from the game due to a bug. This has been logged " +
			"but you should also report this to the developers with more information " +
			"and steps to reproduce the bug in our communication server.\n\n" +
			`${GAME_NAME} Error Code: ${reason}`
		);
		this.discord.log(player, "Player removed due to bug.", "Player Removed");
	}
}