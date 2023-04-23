import { Networking } from "@flamework/networking";
import { Slot, WeaponData } from "./types";

export interface ServerEvents {
    discordLog(message: string, logType: string): void;
    createBullet(origin: Vector3, dir: Vector3, weaponData: WeaponData): void;
}

export interface ClientEvents { }

export interface ServerFunctions { }

export interface ClientFunctions { }

export const GlobalEvents = Networking.createEvent<ServerEvents, ClientEvents>();
export const GlobalFunctions = Networking.createFunction<ServerFunctions, ClientFunctions>();
