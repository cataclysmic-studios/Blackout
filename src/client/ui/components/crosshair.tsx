import Roact, { Ref } from "@rbxts/roact";

interface Props {
  Ref?: Ref<Frame>;
}

export function Crosshair(props: Props) {
  return (
    <frame
      Key="Crosshair"
      Ref={props.Ref}
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
      >
        <uistroke />
      </frame>
      <frame
        Key="B"
        AnchorPoint={new Vector2(0.5, 1)}
        BackgroundColor3={Color3.fromRGB(255, 255, 255)}
        BorderSizePixel={0}
        Position={new UDim2(0.5, 0, 1, 0)}
        Size={new UDim2(0, 2, 0, 12)}
      >
        <uistroke />
      </frame>
      <frame
        Key="L"
        AnchorPoint={new Vector2(0, 0.5)}
        BackgroundColor3={Color3.fromRGB(255, 255, 255)}
        BorderSizePixel={0}
        Position={new UDim2(0, 0, 0.5, 0)}
        Size={new UDim2(0, 12, 0, 2)}
      >
        <uistroke />
      </frame>
      <frame
        Key="R"
        AnchorPoint={new Vector2(1, 0.5)}
        BackgroundColor3={Color3.fromRGB(255, 255, 255)}
        BorderSizePixel={0}
        Position={new UDim2(1, 0, 0.5, 0)}
        Size={new UDim2(0, 12, 0, 2)}
      >
        <uistroke />
      </frame>
      <uiaspectratioconstraint />
    </frame>
  );
}
