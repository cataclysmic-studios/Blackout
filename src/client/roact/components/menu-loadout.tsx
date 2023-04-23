import Roact from "@rbxts/roact";

const oswaldLight = new Font("rbxasset://fonts/families/Oswald.json", Enum.FontWeight.Light, Enum.FontStyle.Normal);
const oswald = new Font("rbxasset://fonts/families/Oswald.json", Enum.FontWeight.Regular, Enum.FontStyle.Normal);

interface Props {}

export function Loadout(props: Props) {
  return <folder Key="Loadout">
    <frame
      Key="Shadow"
      BackgroundColor3={Color3.fromRGB(49, 49, 49)}
      BackgroundTransparency={0.1}
      BorderSizePixel={0}
      Position={new UDim2(-0.04, -7, 0, -50)}
      Size={new UDim2(0.3, 0, 2, 0)}
      Visible={false}
      ZIndex={-1}
    >
      <uigradient
        Transparency={new NumberSequence([new NumberSequenceKeypoint(0, 0.3, 0), new NumberSequenceKeypoint(1, 1, 0)])}
      />
    </frame>
    <frame
      Key="Bottom"
      AnchorPoint={new Vector2(0.5, 1)}
      BackgroundTransparency={1}
      Position={new UDim2(0.5, 0, 1, 0)}
      Rotation={-2}
      Size={new UDim2(1, 0, 0.07, 0)}
      Visible={false}
    >
      <textbutton
        Key="Back"
        AutoButtonColor={false}
        BackgroundColor3={Color3.fromRGB(32, 32, 32)}
        BackgroundTransparency={0.4}
        BorderSizePixel={0}
        FontFace={oswaldLight}
        Rotation={2}
        Size={new UDim2(0.065, 0, 0.75, 0)}
        Text={""}
        TextColor3={Color3.fromRGB(244, 244, 244)}
        TextScaled={true}
        TextSize={14}
        TextWrapped={true}
      >
        <textlabel
          AnchorPoint={new Vector2(0.5, 0.5)}
          BackgroundTransparency={1}
          FontFace={oswaldLight}
          Position={new UDim2(0.5, 0, 0.5, 0)}
          Size={new UDim2(1, 0, 0.75, 0)}
          Text="BACK"
          TextColor3={Color3.fromRGB(232, 232, 232)}
          TextScaled={true}
          TextSize={14}
          TextWrapped={true}
          ZIndex={2}
        />
        <uicorner CornerRadius={new UDim(0.1, 0)} />
        <uigradient
          Color={new ColorSequence([new ColorSequenceKeypoint(0, Color3.fromRGB(185, 185, 185)), new ColorSequenceKeypoint(0.5, Color3.fromRGB(255, 255, 255)), new ColorSequenceKeypoint(1, Color3.fromRGB(185, 185, 185))])}
          Rotation={90}
        />
      </textbutton>
      <uilistlayout
        FillDirection={Enum.FillDirection.Horizontal}
        Padding={new UDim(0.01, 0)}
        SortOrder={Enum.SortOrder.LayoutOrder}
        VerticalAlignment={Enum.VerticalAlignment.Center}
      />
    </frame>
    <frame
      Key="WeaponsList"
      AnchorPoint={new Vector2(0, 0.5)}
      BackgroundTransparency={1}
      Position={new UDim2(0, 0, 0.5, 0)}
      Rotation={-2}
      Size={new UDim2(0.2, 0, 0.7, 0)}
      Visible={false}
    >
      <uilistlayout
        Padding={new UDim(0.025, 0)}
        SortOrder={Enum.SortOrder.LayoutOrder}
        VerticalAlignment={Enum.VerticalAlignment.Center}
      />
      <textbutton
        Key="Primary"
        AutoButtonColor={false}
        BackgroundColor3={Color3.fromRGB(32, 32, 32)}
        BackgroundTransparency={0.4}
        BorderSizePixel={0}
        FontFace={oswaldLight}
        LayoutOrder={1}
        Position={new UDim2(0.1, 0, 0, 0)}
        Size={new UDim2(1, 0, 0.25, 0)}
        Text={""}
        TextColor3={Color3.fromRGB(244, 244, 244)}
        TextScaled={true}
        TextSize={14}
        TextWrapped={true}
      >
        <imagelabel
          Key="Icon"
          AnchorPoint={new Vector2(0.5, 0.5)}
          BackgroundTransparency={1}
          Image="http://www.roblox.com/asset/?id=10902725630"
          Position={new UDim2(0.5, 0, 0.5, 0)}
          Size={new UDim2(0.6, 0, 0.8, 0)}
        >
          <uiaspectratioconstraint AspectRatio={2} />
        </imagelabel>
        <textlabel
          BackgroundTransparency={1}
          FontFace={oswaldLight}
          Size={new UDim2(1, 0, 0.2, 0)}
          Text="PRIMARY"
          TextColor3={Color3.fromRGB(232, 232, 232)}
          TextScaled={true}
          TextSize={14}
          TextStrokeColor3={Color3.fromRGB(32, 32, 32)}
          TextStrokeTransparency={0.9}
          TextTransparency={0.2}
          TextWrapped={true}
        />
        <textlabel
          Key="WeaponName"
          AnchorPoint={new Vector2(0, 1)}
          BackgroundTransparency={1}
          FontFace={oswaldLight}
          Position={new UDim2(0, 0, 1, 0)}
          Size={new UDim2(1, 0, 0.2, 0)}
          Text="MURASAMA"
          TextColor3={Color3.fromRGB(232, 232, 232)}
          TextScaled={true}
          TextSize={14}
          TextStrokeColor3={Color3.fromRGB(32, 32, 32)}
          TextStrokeTransparency={0.9}
          TextWrapped={true}
        />
        <uipadding
          PaddingBottom={new UDim(0.1, 0)}
          PaddingLeft={new UDim(0.1, 0)}
          PaddingRight={new UDim(0.1, 0)}
          PaddingTop={new UDim(0.1, 0)}
        />
        <uicorner CornerRadius={new UDim(0.05, 0)} />
        <uigradient
          Color={new ColorSequence([new ColorSequenceKeypoint(0, Color3.fromRGB(185, 185, 185)), new ColorSequenceKeypoint(0.5, Color3.fromRGB(255, 255, 255)), new ColorSequenceKeypoint(1, Color3.fromRGB(185, 185, 185))])}
          Rotation={90}
        />
      </textbutton>
      <textbutton
        Key="Melee"
        AutoButtonColor={false}
        BackgroundColor3={Color3.fromRGB(32, 32, 32)}
        BackgroundTransparency={0.4}
        BorderSizePixel={0}
        FontFace={oswaldLight}
        LayoutOrder={3}
        Position={new UDim2(0.1, 0, 0, 0)}
        Size={new UDim2(1, 0, 0.25, 0)}
        Text={""}
        TextColor3={Color3.fromRGB(244, 244, 244)}
        TextScaled={true}
        TextSize={14}
        TextWrapped={true}
      >
        <uicorner CornerRadius={new UDim(0.05, 0)} />
        <uigradient
          Color={new ColorSequence([new ColorSequenceKeypoint(0, Color3.fromRGB(185, 185, 185)), new ColorSequenceKeypoint(0.5, Color3.fromRGB(255, 255, 255)), new ColorSequenceKeypoint(1, Color3.fromRGB(185, 185, 185))])}
          Rotation={90}
        />
        <uipadding
          PaddingBottom={new UDim(0.1, 0)}
          PaddingLeft={new UDim(0.1, 0)}
          PaddingRight={new UDim(0.1, 0)}
          PaddingTop={new UDim(0.1, 0)}
        />
        <imagelabel
          Key="Icon"
          AnchorPoint={new Vector2(0.5, 0.5)}
          BackgroundTransparency={1}
          Image="http://www.roblox.com/asset/?id=10902725630"
          Position={new UDim2(0.5, 0, 0.5, 0)}
          Size={new UDim2(0.6, 0, 0.8, 0)}
        >
          <uiaspectratioconstraint AspectRatio={2} />
        </imagelabel>
        <textlabel
          BackgroundTransparency={1}
          FontFace={oswaldLight}
          Size={new UDim2(1, 0, 0.2, 0)}
          Text="MELEE"
          TextColor3={Color3.fromRGB(232, 232, 232)}
          TextScaled={true}
          TextSize={14}
          TextStrokeColor3={Color3.fromRGB(32, 32, 32)}
          TextStrokeTransparency={0.9}
          TextTransparency={0.2}
          TextWrapped={true}
        />
        <textlabel
          Key="WeaponName"
          AnchorPoint={new Vector2(0, 1)}
          BackgroundTransparency={1}
          FontFace={oswald}
          Position={new UDim2(0, 0, 1, 0)}
          Size={new UDim2(1, 0, 0.2, 0)}
          Text="KATANA"
          TextColor3={Color3.fromRGB(232, 232, 232)}
          TextScaled={true}
          TextSize={14}
          TextStrokeColor3={Color3.fromRGB(32, 32, 32)}
          TextStrokeTransparency={0.9}
          TextWrapped={true}
        />
      </textbutton>
      <textbutton
        Key="Secondary"
        AutoButtonColor={false}
        BackgroundColor3={Color3.fromRGB(32, 32, 32)}
        BackgroundTransparency={0.4}
        BorderSizePixel={0}
        FontFace={oswaldLight}
        LayoutOrder={2}
        Position={new UDim2(0.1, 0, 0, 0)}
        Size={new UDim2(1, 0, 0.25, 0)}
        Text={""}
        TextColor3={Color3.fromRGB(244, 244, 244)}
        TextScaled={true}
        TextSize={14}
        TextWrapped={true}
      >
        <uicorner CornerRadius={new UDim(0.05, 0)} />
        <uigradient
          Color={new ColorSequence([new ColorSequenceKeypoint(0, Color3.fromRGB(185, 185, 185)), new ColorSequenceKeypoint(0.5, Color3.fromRGB(255, 255, 255)), new ColorSequenceKeypoint(1, Color3.fromRGB(185, 185, 185))])}
          Rotation={90}
        />
        <uipadding
          PaddingBottom={new UDim(0.1, 0)}
          PaddingLeft={new UDim(0.1, 0)}
          PaddingRight={new UDim(0.1, 0)}
          PaddingTop={new UDim(0.1, 0)}
        />
        <imagelabel
          Key="Icon"
          AnchorPoint={new Vector2(0.5, 0.5)}
          BackgroundTransparency={1}
          Image="http://www.roblox.com/asset/?id=10902725630"
          Position={new UDim2(0.5, 0, 0.5, 0)}
          Size={new UDim2(0.6, 0, 0.8, 0)}
        >
          <uiaspectratioconstraint AspectRatio={2} />
        </imagelabel>
        <textlabel
          BackgroundTransparency={1}
          FontFace={oswaldLight}
          Size={new UDim2(1, 0, 0.2, 0)}
          Text="SECONDARY"
          TextColor3={Color3.fromRGB(232, 232, 232)}
          TextScaled={true}
          TextSize={14}
          TextStrokeColor3={Color3.fromRGB(32, 32, 32)}
          TextStrokeTransparency={0.9}
          TextTransparency={0.2}
          TextWrapped={true}
        />
        <textlabel
          Key="WeaponName"
          AnchorPoint={new Vector2(0, 1)}
          BackgroundTransparency={1}
          FontFace={oswald}
          Position={new UDim2(0, 0, 1, 0)}
          Size={new UDim2(1, 0, 0.2, 0)}
          Text="OUTLAW"
          TextColor3={Color3.fromRGB(232, 232, 232)}
          TextScaled={true}
          TextSize={14}
          TextStrokeColor3={Color3.fromRGB(32, 32, 32)}
          TextStrokeTransparency={0.9}
          TextWrapped={true}
        />
      </textbutton>
    </frame>
    <frame
      Key="Title"
      AnchorPoint={new Vector2(0.5, 0)}
      BackgroundTransparency={1}
      Position={new UDim2(0.5, 0, 0, 0)}
      Size={new UDim2(1, 0, 0.07, 0)}
      Visible={false}
    >
      <textlabel
        BackgroundTransparency={1}
        FontFace={oswaldLight}
        Size={new UDim2(1, 0, 1, 0)}
        Text="EDIT LOADOUT"
        TextColor3={Color3.fromRGB(232, 232, 232)}
        TextScaled={true}
        TextSize={14}
        TextWrapped={true}
        TextXAlignment={Enum.TextXAlignment.Left}
      >
        <uigradient
          Color={new ColorSequence([new ColorSequenceKeypoint(0, Color3.fromRGB(185, 185, 185)), new ColorSequenceKeypoint(0.5, Color3.fromRGB(255, 255, 255)), new ColorSequenceKeypoint(1, Color3.fromRGB(185, 185, 185))])}
          Rotation={90}
        />
      </textlabel>
      <frame
        Key="BottomLine"
        AnchorPoint={new Vector2(0.5, 0)}
        BackgroundColor3={Color3.fromRGB(232, 232, 232)}
        BackgroundTransparency={0.4}
        BorderSizePixel={0}
        Position={new UDim2(0.5, 0, 1, 0)}
        Size={new UDim2(2, 0, 0, 1)}
      />
    </frame>
    <frame
      Key="WeaponInfo"
      AnchorPoint={new Vector2(0.5, 1)}
      BackgroundColor3={Color3.fromRGB(32, 32, 32)}
      BackgroundTransparency={0.4}
      BorderSizePixel={0}
      Position={new UDim2(0.5, 0, 0.925, 0)}
      Size={new UDim2(0.25, 0, 0.2, 0)}
      Visible={false}
    >
      <uicorner CornerRadius={new UDim(0.05, 0)} />
      <textlabel
        Key="Title"
        AnchorPoint={new Vector2(0.5, 0)}
        BackgroundTransparency={1}
        FontFace={oswald}
        Position={new UDim2(0.5, 0, 0.1, 0)}
        Size={new UDim2(0.9, 0, 0.25, 0)}
        Text="MURASAMA"
        TextColor3={Color3.fromRGB(232, 232, 232)}
        TextScaled={true}
        TextSize={14}
        TextWrapped={true}
        TextXAlignment={Enum.TextXAlignment.Left}
      />
      <textlabel
        Key="Body"
        AnchorPoint={new Vector2(0.5, 0)}
        BackgroundTransparency={1}
        FontFace={oswald}
        Position={new UDim2(0.5, 0, 0.35, 0)}
        RichText={true}
        Size={new UDim2(0.8, 0, 0.55, 0)}
        Text={""}
        TextColor3={Color3.fromRGB(232, 232, 232)}
        TextScaled={true}
        TextSize={14}
        TextTransparency={0.2}
        TextWrapped={true}
        TextXAlignment={Enum.TextXAlignment.Left}
      />
      <uipadding
        PaddingBottom={new UDim(0.05, 0)}
        PaddingLeft={new UDim(0.05, 0)}
        PaddingRight={new UDim(0.05, 0)}
        PaddingTop={new UDim(0.05, 0)}
      />
      <uigradient
        Color={new ColorSequence([new ColorSequenceKeypoint(0, Color3.fromRGB(185, 185, 185)), new ColorSequenceKeypoint(0.5, Color3.fromRGB(255, 255, 255)), new ColorSequenceKeypoint(1, Color3.fromRGB(185, 185, 185))])}
        Rotation={90}
      />
    </frame>
    <textbutton
      AnchorPoint={new Vector2(0.5, 1)}
      AutoButtonColor={false}
      BackgroundColor3={Color3.fromRGB(32, 32, 32)}
      BackgroundTransparency={0.4}
      BorderSizePixel={0}
      FontFace={oswaldLight}
      Position={new UDim2(0.5, 0, 1, 0)}
      Size={new UDim2(0.1, 0, 0.05, 0)}
      Text={""}
      TextColor3={Color3.fromRGB(244, 244, 244)}
      TextScaled={true}
      TextSize={14}
      TextWrapped={true}
      Visible={false}
    >
      <textlabel
        AnchorPoint={new Vector2(0.5, 0.5)}
        BackgroundTransparency={1}
        Font={Enum.Font.Unknown}
        FontFace={oswaldLight}
        Position={new UDim2(0.5, 0, 0.5, 0)}
        Size={new UDim2(1, 0, 0.75, 0)}
        Text={""}
        TextColor3={Color3.fromRGB(232, 232, 232)}
        TextScaled={true}
        TextSize={14}
        TextWrapped={true}
        ZIndex={2}
      />
      <uicorner CornerRadius={new UDim(0.1, 0)} />
      <uigradient
        Color={new ColorSequence([new ColorSequenceKeypoint(0, Color3.fromRGB(185, 185, 185)), new ColorSequenceKeypoint(0.5, Color3.fromRGB(255, 255, 255)), new ColorSequenceKeypoint(1, Color3.fromRGB(185, 185, 185))])}
        Rotation={90}
      />
    </textbutton>
  </folder>;
}