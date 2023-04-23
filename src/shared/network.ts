import { Networking } from "@flamework/networking";
import { WeaponData } from "./types";
import { PlayerData } from "./meta/default-player-data";

export interface ServerEvents {
	discordLog(message: string, logType: string): void;
	createBullet(origin: Vector3, dir: Vector3, weaponData: WeaponData): void;
}

export interface ClientEvents {
	ammoChanged(ammo: { mag: number; reserve: number; }): void;

	/** Fired by the server when the player's data changes */
	playerDataChanged(newPlayerData: Partial<PlayerData>): void;
}

export interface ServerFunctions { }

export interface ClientFunctions { }

export const GlobalEvents = Networking.createEvent<ServerEvents, ClientEvents>();
export const GlobalFunctions = Networking.createFunction<ServerFunctions, ClientFunctions>();
