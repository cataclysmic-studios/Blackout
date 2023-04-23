import { Janitor } from "@rbxts/janitor";
import { Events } from "server/network";
import { IPlayerData, PlayerDataProfile } from "shared/meta/default-player-data";
import { DeepReadonly } from "types/util/readonly";

/**
 * This class should handle *everything* to do with a specific player. This
 * includes things like their data and state.
 */
export default class PlayerEntity {
	public readonly name: string;

	/**
	 * Readonly version of the players data. Updates should be done through the
	 * `updateData` method.
	 */
	public data: DeepReadonly<IPlayerData>;

	constructor(
		public readonly player: Player,
		public readonly janitor: Janitor,
		private dataProfile: PlayerDataProfile,
	) {
		this.name = player.Name;
		this.data = dataProfile.Data;
	}

	/**
	 * Method to update the player's data and alert the client of changes
	 * 
	 * @param callback Callback that returns the new data
	 */
	public updateData(callback: (existingData: DeepReadonly<IPlayerData>) => IPlayerData) {
		const currentData = this.dataProfile.Data;
		const newData = callback(currentData);
		this.dataProfile.Data = newData;
		this.data = newData;

		// TODO: Only send the changed data
		Events.playerDataChanged(this.player, newData);
	}
}