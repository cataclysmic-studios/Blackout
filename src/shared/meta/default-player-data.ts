import { Profile } from "@rbxts/profileservice/globals";
import { BanReason } from "shared/enums";

const DefaultPlayerData = {
  banInfo: {
    banned: false,
    reason: BanReason.Unbanned,
  },
  currency: {
    cash: 0,
    xp: 0,
  },
};

export default DefaultPlayerData;

export type PlayerData = typeof DefaultPlayerData;
export type PlayerDataProfile = Profile<PlayerData>;
