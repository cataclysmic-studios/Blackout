import Roact from '@rbxts/roact';
import { Spring, useSingleMotor } from '@rbxts/roact-hooked-plus';

interface Props {
	text: string;
}

export default function Button(props: Props) {
	const [hovered, setHovered] = useSingleMotor(0);

	return (
		<textbutton
			AutoButtonColor={false}
			BackgroundColor3={hovered.map((value) =>
				Color3.fromRGB(0, 0, 0).Lerp(Color3.fromRGB(0, 120, 207), value)
			)}
			TextColor3={Color3.fromRGB(255, 255, 255)}
			BackgroundTransparency={hovered.map((value) => 0.5 - value * 0.5)}
			BorderSizePixel={0}
			Font={Enum.Font.GothamBlack}
			Text={props.text.upper()}
			TextSize={24}
			AutomaticSize={Enum.AutomaticSize.XY}
			Event={{
				MouseEnter: () => setHovered(new Spring(1)),
				MouseLeave: () => setHovered(new Spring(0)),
			}}
		>
			<uipadding
				PaddingTop={new UDim(0, 10)}
				PaddingBottom={new UDim(0, 10)}
				PaddingLeft={new UDim(0, 15)}
				PaddingRight={new UDim(0, 15)}
			/>
			<uistroke
				Color={Color3.fromRGB(255, 255, 255)}
				Thickness={2}
				ApplyStrokeMode={Enum.ApplyStrokeMode.Border}
				Transparency={hovered.map((value) => 1 - value)}
			/>
		</textbutton>
	);
}
