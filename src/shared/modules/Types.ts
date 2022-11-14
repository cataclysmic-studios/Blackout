import { Firemode } from "./Enums";

type RecoilPattern = [ [number, number], [number, number], [number, number] ];
export type LeanState = -1 | 0 | 1;
export type Slot = 1 | 2 | 3;

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

export interface WeaponModel extends Folder {
    CFrameManipulators: Folder;
    Offsets: Folder & {
        Aim: CFrameValue;
    };
    Sounds: Folder & {
        Fire: Sound;
        AimDown: Sound;
        AimUp: Sound;
        ChangeFiremode: Sound;
        EmptyClick: Sound;
        MagIn: Sound;
        MagOut: Sound;
        SlidePull: Sound;
        SlideRelease: Sound;
    };
    Trigger: Part & {
        ViewModel: Motor6D;
        Chamber: Attachment & {
            Smoke: ParticleEmitter;
        };
        Muzzle: Attachment;
    };
    Chamber: Part;
    Mag: Part;
    Bolt: Part;
    ChargingHandle?: Part;
}