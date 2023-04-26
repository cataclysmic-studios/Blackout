import Roact, { Children, PropsWithChildren } from "@rbxts/roact";

interface ButtonContainerProps {
	MainPage?: boolean;
}

export default function ButtonContainer(props: PropsWithChildren<ButtonContainerProps>) {
	return (
    <frame
      Key="Buttons"
      BackgroundTransparency={1}
      Position={new UDim2(0, 0, 0.5, 0)}
      AnchorPoint={new Vector2(0, 0.5)}
      Rotation={-2}
      Size={new UDim2(0.15, 0, (props.MainPage ?? false) ? 0.75 : 0.5, 0)}
      AutomaticSize={Enum.AutomaticSize.Y}
    >
      <uilistlayout
        Padding={new UDim(0, 12)}
        SortOrder={Enum.SortOrder.LayoutOrder}
        VerticalAlignment={Enum.VerticalAlignment.Bottom}
      />
      {props[Children]}
    </frame>
  )
}