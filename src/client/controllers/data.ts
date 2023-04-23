import { Controller, OnStart } from "@flamework/core";
import { Events } from "client/network";
import { PlayerData } from "shared/meta/default-player-data";

@Controller()
export class DataController implements OnStart {
	onStart(): void {
		Events.playerDataChanged.connect((data) => this.onReceivedNewData(data));
	}

	private onReceivedNewData(data: Partial<PlayerData>) {
		// Do something with the data
	}
}