import { Firemode } from "./Enums";

type RecoilPattern = [ [number, number], [number, number], [number, number] ];

export interface WeaponData {
    vmOffset: CFrame;
    recoil: {
        camera: RecoilPattern;
        model: RecoilPattern;
    };
    recoilSpringModifiers: {
        camRecoverSpeed: number;
        camKickSpeed: number;
        camKickMult: number;
        camKickDamper: number;
        modelRecoverSpeed: number;
        modelKickSpeed: number;
        modelKickMult: number;
        modelKickDamper: number;
    }

    shell: string;
    stats: {
        rpm: number;
        damage: [number, number];
        range: [number, number];
        muzzleVelocity: number;
        peakVelocity: number;

        firemodes: Firemode[];
        burstCount?: number;    
        magSize: number;
        reserve: number;
        chamber: number;
    }

    crossExpansion: {
        hip: number;
        max: number;
        shoot: number;
    }
}