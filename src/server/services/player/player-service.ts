import { OnInit, OnStart, Service } from "@flamework/core";
import { Janitor } from "@rbxts/janitor";
import { KickReason } from "shared/enums";
import { Functions } from "server/network";
import { ServerResponse } from "shared/interfaces/network-types";
import { PlayerData } from "shared/meta/default-player-data";
import { PlayerDataService } from "./data-service";
import { PlayerRemovalService } from "./removal-service";
import {
  OnPlayerAdded,
  OnPlayerRemoving,
} from "shared/meta/player-lifecycle-hooks";
import Signal from "@rbxts/signal";
import PlayerEntity from "server/modules/classes/player-entity";

@Service()
export class PlayerService
  implements OnStart, OnInit, OnPlayerAdded, OnPlayerRemoving
{
  // what does this need to do?
  // - load player data
  // - save player data

  private playerEntities = new Map<Player, PlayerEntity>();
  private onEntityRemoving = new Signal();

  constructor(
    private readonly playerData: PlayerDataService,
    private readonly playerRemoval: PlayerRemovalService
  ) {}

  public onInit(): void {
    game.BindToClose(() => {
      while (this.playerEntities.size() > 0) this.onEntityRemoving.Wait();
    });
  }

  public onStart(): void {
    Functions.requestPlayerData.setCallback((player: Player) =>
      this.onPlayerRequestedData(player)
    );
  }

  public async onPlayerAdded(player: Player): Promise<void> {
    const profile = await this.playerData.loadProfile(player.UserId);
    if (!profile)
      return this.playerRemoval.removeDueToBug(
        player,
        KickReason.PlayerEntityInstantiationError
      );

    const janitor = new Janitor();
    janitor.Add(() => {
      player.SetAttribute("PlayerRemoving", true);
      profile.Release();

      this.playerEntities.delete(player);
      this.onEntityRemoving.Fire();
    }, true);

    const playerEntity = new PlayerEntity(player, janitor, profile);
    this.playerEntities.set(player, playerEntity);
  }

  public onPlayerRemoving(player: Player): void {
    const playerEntity = this.playerEntities.get(player);
    if (!playerEntity) return;
    playerEntity.destroy();
  }

  private onPlayerRequestedData(player: Player): ServerResponse<PlayerData> {
    const entity = this.playerEntities.get(player);
    if (!entity) return { success: false, error: "Player entity not found" };

    return { success: true, data: entity.data };
  }

  public getPlayerEntity(player: Player) {
    return this.playerEntities.get(player);
  }
}
