import { Profile } from "@rbxts/profileservice/globals";

const DefaultPlayerData = {
	currency: {
		cash: 0,
		experiencePoints: 0,
	}
}

export default DefaultPlayerData;

export type IPlayerData = typeof DefaultPlayerData;
export type PlayerDataProfile = Profile<IPlayerData>;