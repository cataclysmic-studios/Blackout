import { Service } from "@flamework/core";
import { GAME_NAME } from "shared/shared-constants";
import { KickReason } from "types/enum/kick-reason";

@Service()
export class PlayerRemovalService {
	public removePlayerForBug(player: Player, reason: KickReason) {
		player.Kick(
			"\n\nYou have been kicked from the game due to a bug. This has been logged " +
			"but you should also report this to the developers with more information " +
			"and steps to reproduce the bug in our communication server.\n\n" +
			`${GAME_NAME} Error Code: ${reason}`
		)
	}
}