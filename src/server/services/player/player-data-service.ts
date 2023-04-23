import { Service } from "@flamework/core";
import { PlayerRemovalService } from "./player-removal-service";
import ProfileService from "@rbxts/profileservice";
import DefaultPlayerData, { IPlayerData } from "shared/meta/default-player-data";

@Service({})
export class PlayerDataService {
	constructor(private readonly playerRemovalService: PlayerRemovalService) { }

	private gameProfileStore = ProfileService.GetProfileStore<IPlayerData>("PlayerData", DefaultPlayerData);
}