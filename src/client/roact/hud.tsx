import Roact from "@rbxts/roact";

const { ZIndexBehavior, TextXAlignment, FontWeight, FontStyle } = Enum;
const inconsolata = new Font("rbxasset://fonts/families/Inconsolata.json", FontWeight.SemiBold, FontStyle.Normal);

export const HUD = (
  <screengui Key="HUD" Enabled={false} ZIndexBehavior={ZIndexBehavior.Sibling}>
    <frame
      Key="Crosshair"
      AnchorPoint={new Vector2(0.5, 0.5)}
      BackgroundTransparency={1}
      Position={new UDim2(0.5, 0, 0.5, 0)}
      Size={new UDim2(0.4, 0, 0.4, 0)}
      Visible={false}
    >
      <frame
        Key="T"
        AnchorPoint={new Vector2(0.5, 0)}
        BackgroundColor3={Color3.fromRGB(255, 255, 255)}
        BorderSizePixel={0}
        Position={new UDim2(0.5, 0, 0, 0)}
        Size={new UDim2(0, 2, 0, 12)}
      />
      <frame
        Key="B"
        AnchorPoint={new Vector2(0.5, 1)}
        BackgroundColor3={Color3.fromRGB(255, 255, 255)}
        BorderSizePixel={0}
        Position={new UDim2(0.5, 0, 1, 0)}
        Size={new UDim2(0, 2, 0, 12)}
      />
      <frame
        Key="L"
        AnchorPoint={new Vector2(0, 0.5)}
        BackgroundColor3={Color3.fromRGB(255, 255, 255)}
        BorderSizePixel={0}
        Position={new UDim2(0, 0, 0.5, 0)}
        Size={new UDim2(0, 12, 0, 2)}
      />
      <frame
        Key="R"
        AnchorPoint={new Vector2(1, 0.5)}
        BackgroundColor3={Color3.fromRGB(255, 255, 255)}
        BorderSizePixel={0}
        Position={new UDim2(1, 0, 0.5, 0)}
        Size={new UDim2(0, 12, 0, 2)}
      />
      <uiaspectratioconstraint />
    </frame>
    <frame
      Key="Ammo"
      AnchorPoint={new Vector2(1, 1)}
      BackgroundColor3={Color3.fromRGB(0, 0, 0)}
      BackgroundTransparency={0.45}
      Position={new UDim2(1, -20, 1, -35)}
      Rotation={2}
      Size={new UDim2(0.135, 0, 0.08, 0)}
    >
      <textlabel
        Key="Mag"
        AnchorPoint={new Vector2(0, 0.5)}
        BackgroundTransparency={1}
        FontFace={inconsolata}
        Position={new UDim2(0, 0, 0.5, 0)}
        Size={new UDim2(0.425, 0, 1, 0)}
        Text="30"
        TextColor3={Color3.fromRGB(250, 255, 249)}
        TextScaled={true}
        TextSize={14}
        TextWrapped={true}
        TextXAlignment={TextXAlignment.Right}
      >
        <uipadding PaddingBottom={new UDim(0.04, 0)} PaddingTop={new UDim(0.04, 0)} />
        <uistroke Color={Color3.fromRGB(49, 49, 49)} Thickness={1.5} Transparency={0.4} />
        <uigradient
          Color={new ColorSequence([new ColorSequenceKeypoint(0, Color3.fromRGB(190, 190, 190)), new ColorSequenceKeypoint(0.5, Color3.fromRGB(255, 255, 255)), new ColorSequenceKeypoint(1, Color3.fromRGB(190, 190, 190))])}
          Rotation={90}
        />
      </textlabel>
      <textlabel
        Key="Reserve"
        AnchorPoint={new Vector2(1, 1)}
        BackgroundTransparency={1}
        FontFace={inconsolata}
        Position={new UDim2(1, 0, 1, 0)}
        Size={new UDim2(0.425, 0, 0.85, 0)}
        Text="150"
        TextColor3={Color3.fromRGB(248, 255, 255)}
        TextScaled={true}
        TextSize={14}
        TextTransparency={0.2}
        TextWrapped={true}
        TextXAlignment={TextXAlignment.Left}
      >
        <uipadding PaddingBottom={new UDim(0.04, 0)} PaddingTop={new UDim(0.04, 0)} />
        <uistroke Color={Color3.fromRGB(49, 49, 49)} Thickness={1.5} Transparency={0.4} />
        <uigradient
          Color={new ColorSequence([new ColorSequenceKeypoint(0, Color3.fromRGB(190, 190, 190)), new ColorSequenceKeypoint(0.5, Color3.fromRGB(255, 255, 255)), new ColorSequenceKeypoint(1, Color3.fromRGB(190, 190, 190))])}
          Rotation={90}
        />
      </textlabel>
      <uipadding
        PaddingBottom={new UDim(0.075, 0)}
        PaddingLeft={new UDim(0.05, 0)}
        PaddingRight={new UDim(0.05, 0)}
        PaddingTop={new UDim(0.075, 0)}
      />
      <uicorner CornerRadius={new UDim(0, 16)} />
      <uistroke Color={Color3.fromRGB(134, 134, 134)} Thickness={1.2} Transparency={0.4} />
      <frame
        Key="Line"
        AnchorPoint={new Vector2(0.5, 0.5)}
        BackgroundColor3={Color3.fromRGB(255, 255, 255)}
        BackgroundTransparency={0.4}
        BorderSizePixel={0}
        Position={new UDim2(0.5, 2, 0.5, 0)}
        Size={new UDim2(0, 2, 0.8, 0)}
      />
    </frame>
    <frame
      Key="Dot"
      AnchorPoint={new Vector2(0.5, 0.5)}
      BackgroundColor3={Color3.fromRGB(255, 255, 255)}
      BorderSizePixel={0}
      Position={new UDim2(0.5, 0, 0.5, 0)}
      Size={new UDim2(0, 4, 0, 4)}
    >
      <uicorner />
      <uistroke Thickness={0.5} />
    </frame>
  </screengui>
)