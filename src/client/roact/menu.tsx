import Roact from "@rbxts/roact";
import { Loadout } from "./menu-loadout";
import { tween } from "shared/utility";
import { Dependency } from "@flamework/core";
import { MenuController } from "client/controllers/menu";

const { ScreenInsets, ZIndexBehavior, SortOrder, VerticalAlignment, FontWeight, FontStyle } = Enum;
const oswald = new Font("rbxasset://fonts/families/Oswald.json", FontWeight.Regular, FontStyle.Normal);

const hoverInfo = new TweenInfo(.175, Enum.EasingStyle.Quad);
const selectColor = Color3.fromRGB(255, 176, 15);
const defaultColors = {
  background: Color3.fromRGB(32, 32, 32),
  text: Color3.fromRGB(255, 255, 255)
};

function handleClick(b: TextButton): void {
  const menu = Dependency<MenuController>();
    switch (b.Name) {
      case "Play":
        menu.destroy();
        break;
      default:
        print("unhandled menu button");
        break;
    }
}

function handleHover(b: TextButton): void {
  tween(b, hoverInfo, {
    BackgroundColor3: selectColor,
    TextColor3: Color3.fromRGB(27, 27, 27)
  });
}

function handleUnhover(b: TextButton): void {
  tween(b, hoverInfo, {
    BackgroundColor3: defaultColors.background,
    TextColor3: defaultColors.text
  });
}

const buttonEvents = {
  MouseButton1Click: handleClick,
  MouseEnter: handleHover,
  MouseLeave: handleUnhover
};

export const Menu = (
  <screengui
    Key="Menu"
    IgnoreGuiInset={true}
    ScreenInsets={ScreenInsets.DeviceSafeInsets}
    ZIndexBehavior={ZIndexBehavior.Sibling}
  >
    <Loadout />
    <folder Key="Main">
      <frame
        Key="Buttons"
        BackgroundTransparency={1}
        Position={new UDim2(0, 0, 0.35, 0)}
        Rotation={-2}
        Size={new UDim2(0.15, 0, 0.275, 0)}
        Visible={false}
      >
        <uilistlayout
          Padding={new UDim(0, 12)}
          SortOrder={SortOrder.LayoutOrder}
          VerticalAlignment={VerticalAlignment.Center}
        />
        <textbutton
          Key="Play"
          AutoButtonColor={false}
          BackgroundColor3={defaultColors.background}
          TextColor3={defaultColors.text}
          BackgroundTransparency={0.4}
          FontFace={oswald}
          Position={new UDim2(0, 0, 0, 0)}
          Size={new UDim2(0.475, 0, 0.225, 0)}
          Text="PLAY"
          LayoutOrder={0}
          TextScaled={true}
          TextSize={14}
          TextWrapped={true}
          Event={buttonEvents}
        >
          <uicorner CornerRadius={new UDim(0, 6)} />
          <uipadding
            PaddingBottom={new UDim(0.12, 0)}
            PaddingLeft={new UDim(0, 15)}
            PaddingRight={new UDim(0, 15)}
            PaddingTop={new UDim(0.12, 0)}
          />
          <uigradient
            Rotation={90}
            Color={new ColorSequence([
              new ColorSequenceKeypoint(0, Color3.fromRGB(190, 190, 190)), 
              new ColorSequenceKeypoint(0.5, Color3.fromRGB(255, 255, 255)), 
              new ColorSequenceKeypoint(1, Color3.fromRGB(190, 190, 190))
            ])}
          />
        </textbutton>
        <textbutton
          Key="Loadout"
          AutoButtonColor={false}
          BackgroundColor3={defaultColors.background}
          TextColor3={defaultColors.text}
          BackgroundTransparency={0.4}
          FontFace={oswald}
          Position={new UDim2(0, 0, 0.18, 0)}
          Size={new UDim2(0.675, 0, 0.225, 0)}
          Text="LOADOUT"
          LayoutOrder={1}
          TextScaled={true}
          TextSize={14}
          TextWrapped={true}
          Event={buttonEvents}
        >
          <uicorner CornerRadius={new UDim(0, 6)} />
          <uigradient
            Rotation={90}
            Color={new ColorSequence([
              new ColorSequenceKeypoint(0, Color3.fromRGB(190, 190, 190)), 
              new ColorSequenceKeypoint(0.5, Color3.fromRGB(255, 255, 255)), 
              new ColorSequenceKeypoint(1, Color3.fromRGB(190, 190, 190))
            ])}
          />
          <uipadding
            PaddingBottom={new UDim(0.12, 0)}
            PaddingLeft={new UDim(0, 15)}
            PaddingRight={new UDim(0, 15)}
            PaddingTop={new UDim(0.12, 0)}
          />
        </textbutton>
        <textbutton
          Key="Settings"
          AutoButtonColor={false}
          BackgroundColor3={defaultColors.background}
          TextColor3={defaultColors.text}
          BackgroundTransparency={0.4}
          FontFace={oswald}
          Position={new UDim2(0, 0, 0.18, 0)}
          Size={new UDim2(0.7, 0, 0.225, 0)}
          Text="SETTINGS"
          LayoutOrder={2}
          TextScaled={true}
          TextSize={14}
          TextWrapped={true}
          Event={buttonEvents}
        >
          <uicorner CornerRadius={new UDim(0, 6)} />
          <uigradient
            Rotation={90}
            Color={new ColorSequence([
              new ColorSequenceKeypoint(0, Color3.fromRGB(190, 190, 190)), 
              new ColorSequenceKeypoint(0.5, Color3.fromRGB(255, 255, 255)), 
              new ColorSequenceKeypoint(1, Color3.fromRGB(190, 190, 190))
            ])}
          />
          <uipadding
            PaddingBottom={new UDim(0.12, 0)}
            PaddingLeft={new UDim(0, 15)}
            PaddingRight={new UDim(0, 15)}
            PaddingTop={new UDim(0.12, 0)}
          />
        </textbutton>
      </frame>
      <imagelabel
        Key="Title"
        BackgroundTransparency={1}
        Image="http://www.roblox.com/asset/?id=11531960984"
        Position={new UDim2(0, 0, 0.05, 0)}
        Size={new UDim2(0.4, 0, 0.15, 0)}
        Visible={false}
      />
      <frame
        Key="Shadow"
        BackgroundColor3={Color3.fromRGB(49, 49, 49)}
        BackgroundTransparency={0.1}
        BorderSizePixel={0}
        Position={new UDim2(-0.045, -7, 0, -50)}
        Size={new UDim2(0.3, 0, 2, 0)}
        Visible={false}
        ZIndex={-1}
      >
        <uigradient
          Transparency={new NumberSequence([new NumberSequenceKeypoint(0, 0.3, 0), new NumberSequenceKeypoint(1, 1, 0)])}
        />
      </frame>
    </folder>
    <uipadding
      PaddingBottom={new UDim(0.04, 0)}
      PaddingLeft={new UDim(0.045, 0)}
      PaddingRight={new UDim(0.045, 0)}
      PaddingTop={new UDim(0, 50)}
    />
  </screengui>
);
