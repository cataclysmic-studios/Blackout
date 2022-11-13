type RecoilPattern = [
    [number, number], [number, number], [number, number]
];

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
    magSize: number;
    reserve: number;
    chamber: number;

    crossExpansion: {
        hip: number;
        max: number;
        shoot: number;
    }
}