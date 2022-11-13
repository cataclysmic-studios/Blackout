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
    };
    Chamber: Part;
    Mag: Part;
    Bolt: Part;
    CharingHandle?: Part;
}
