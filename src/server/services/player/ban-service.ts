import { Service } from "@flamework/core";
import { PlayerRemovalService } from "./removal-service";
import { PlayerDataService } from "./data-service";
import { BanReason } from "shared/enums";
import { OnPlayerAdded } from "./join";

@Service()
export class BanService implements OnPlayerAdded {
  public constructor(
    private readonly playerData: PlayerDataService,
    private readonly playerRemoval: PlayerRemovalService
  ) { }

  public onPlayerAdded(player: Player): void {
    const profile = this.playerData.getProfile(player.UserId);
    if (!profile) return;
    if (!profile.Data.banInfo.banned && profile.Data.banInfo.reason === BanReason.Unbanned) return;
    this.playerRemoval.removeDueToBan(player, profile.Data.banInfo.reason);
  }

  public async ban(player: Player, reason: BanReason): Promise<void> {
    const profile = await this.playerData.getProfile(player.UserId);
    if (!profile) return;
    profile.Data.banInfo.banned = true;
    profile.Data.banInfo.reason = reason;
    this.playerRemoval.removeDueToBan(player, reason);
  }

  public async unban(userID: number): Promise<void> {
    const profile = await this.playerData.loadProfile(userID);
    if (!profile) return;
    profile.Data.banInfo.banned = false;
    profile.Data.banInfo.reason = BanReason.Unbanned;
  }
}