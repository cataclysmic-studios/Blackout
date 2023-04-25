import { Networking } from "@flamework/networking";
import { WeaponData } from "./types";
import { PlayerData } from "./meta/default-player-data";
import { ServerResponse } from "./interfaces/network-types";

export interface ServerEvents {
	/**
	 * @uuid
	 */
	discordLog(message: string, logType: string): void;
	/**
	 * @uuid
	 */
	createBullet(origin: Vector3, dir: Vector3, weaponData: WeaponData): void;
}

export interface ClientEvents {
	ammoChanged(ammo: { mag: number; reserve: number; }): void;
	playerDataChanged(newPlayerData: Partial<PlayerData>): void;
}

export interface ServerFunctions {
	/**
	 * @uuid
	 */
	requestPlayerData(): ServerResponse<PlayerData>;
}

export interface ClientFunctions { }

export const GlobalEvents = Networking.createEvent<ServerEvents, ClientEvents>();
export const GlobalFunctions = Networking.createFunction<ServerFunctions, ClientFunctions>();
