import { Networking } from "@flamework/networking";
import { Slot } from "./modules/Types";

interface ServerEvents {
    discordLog(message: string, logType: string): void;
    createBullet(origin: Vector3, dir: Vector3, velocity: number): void;
}

interface ClientEvents {}

interface ServerFunctions {}

interface ClientFunctions {}

export const GlobalEvents = Networking.createEvent<ServerEvents, ClientEvents>();
export const GlobalFunctions = Networking.createFunction<ServerFunctions, ClientFunctions>();
