interface PlayerGui extends BasePlayerGui {
  LoadScreen: ScreenGui & {
    Background: Frame & {
      Line: Frame & {
        UIGradient: UIGradient;
      };
      Title: ImageLabel;
      Logo: ImageLabel & {
        UICorner: UICorner;
        UIStroke: UIStroke;
      };
      Completion: TextLabel;
      UIGradient: UIGradient;
      Tip: TextLabel;
    };
  };
  Menu: ScreenGui & {
    Loadout: Folder & {
      Cam: CFrameValue;
      Shadow: Frame & {
        UIGradient: UIGradient;
      };
      Title: Frame & {
        TextLabel: TextLabel & {
          UIGradient: UIGradient;
        };
        BottomLine: Frame;
      };
      Bottom: Frame & {
        UIListLayout: UIListLayout;
        Back: TextButton & {
          UICorner: UICorner;
          TextLabel: TextLabel;
          UIGradient: UIGradient;
        };
      };
      TextButton: TextButton & {
        UICorner: UICorner;
        TextLabel: TextLabel;
        UIGradient: UIGradient;
      };
      WeaponInfo: Frame & {
        Title: TextLabel;
        UICorner: UICorner;
        UIGradient: UIGradient;
        UIPadding: UIPadding;
        Body: TextLabel;
      };
      WeaponsList: Frame & {
        UIListLayout: UIListLayout;
      };
      MainFrame: Frame & {
        UIListLayout: UIListLayout;
        Primary: TextButton & {
          TextLabel: TextLabel;
          UIGradient: UIGradient;
          WeaponName: TextLabel;
          UICorner: UICorner;
          Icon: ImageLabel & {
            UIAspectRatioConstraint: UIAspectRatioConstraint;
          };
          UIPadding: UIPadding;
        };
        Melee: TextButton & {
          UIPadding: UIPadding;
          WeaponName: TextLabel;
          UICorner: UICorner;
          TextLabel: TextLabel;
          Icon: ImageLabel & {
            UIAspectRatioConstraint: UIAspectRatioConstraint;
          };
          UIGradient: UIGradient;
        };
        Secondary: TextButton & {
          UIPadding: UIPadding;
          WeaponName: TextLabel;
          UICorner: UICorner;
          TextLabel: TextLabel;
          Icon: ImageLabel & {
            UIAspectRatioConstraint: UIAspectRatioConstraint;
          };
          UIGradient: UIGradient;
        };
      };
    };
    UIPadding: UIPadding;
    Main: Folder & {
      Cam: CFrameValue;
      Shadow: Frame & {
        UIGradient: UIGradient;
      };
      Title: ImageLabel;
      Buttons: Frame & {
        UIListLayout: UIListLayout;
        Settings: TextButton & {
          UICorner: UICorner;
          UIGradient: UIGradient;
          UIPadding: UIPadding;
        };
        Play: TextButton & {
          UICorner: UICorner;
          UIPadding: UIPadding;
          UIGradient: UIGradient;
        };
        Loadout: TextButton & {
          UICorner: UICorner;
          UIGradient: UIGradient;
          UIPadding: UIPadding;
        };
      };
    };
  };
  HUD: ScreenGui & {
    Ammo: Frame & {
      Mag: TextLabel & {
        UIPadding: UIPadding;
        UIStroke: UIStroke;
      };
      Reserve: TextLabel & {
        UIPadding: UIPadding;
        UIStroke: UIStroke;
      };
      Line: Frame;
    };
    Crosshair: Frame & {
      B: Frame;
      R: Frame;
      L: Frame;
      UIAspectRatioConstraint: UIAspectRatioConstraint;
      T: Frame;
    };
  };
}
