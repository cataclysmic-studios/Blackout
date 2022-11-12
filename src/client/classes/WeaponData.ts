type RecoilPattern = [
    [number, number], [number, number], [number, number]
];

export interface WeaponData {
    vmOffset: CFrame;
    recoil: {
        camera: RecoilPattern;
        model: RecoilPattern;
    };

    shell: string;
}