import { Service } from "@flamework/core";
import { BanReason, KickReason } from "shared/enums";
import { GAME_NAME } from "shared/shared-constants";
import { DiscordService } from "../discord-service";

@Service()
export class PlayerRemovalService {
  public constructor(private readonly discord: DiscordService) {}

  private remove(player: Player, message: string, reason: KickReason): void {
    player.Kick(`${message}\nKick Reason: ${reason}`);
  }

  public removeDueToBan(player: Player, reason: BanReason): void {
    this.remove(
      player,
      `You have been banned.\nBan Reason: ${reason}`,
      KickReason.Banned
    );
  }

  public removeDueToBug(player: Player, reason: KickReason): void {
    player.Kick(
      "\n\nYou have been kicked from the game due to a bug. This has been logged " +
        "but you should also report this to the developers with more information " +
        "and steps to reproduce the bug in our communication server.\n\n" +
        `${GAME_NAME} Error Code: ${reason}`
    );
    this.discord.log(
      player,
      `Player was removed.\n${GAME_NAME} Error Code: ${reason}`,
      "Player Removed Due To Bug"
    );
  }
}
