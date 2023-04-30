import Roact, { Children, PropsWithChildren } from "@rbxts/roact";
import { MenuPage } from "shared/enums";

interface PageProps {
	Title: MenuPage;
	Visible: boolean;
};

export function PageFrame(props: PropsWithChildren<PageProps>) {
	return (
		<frame
			Key={props.Title}
			Visible={props.Visible}
			BackgroundTransparency={1}
			Position={new UDim2(0, 0, 0, -50)}
			Size={new UDim2(1, 0, 1, 50)}
		>
			<uipadding
				PaddingBottom={new UDim(0.04, 0)}
				PaddingLeft={new UDim(0.045, 0)}
				PaddingRight={new UDim(0.045, 0)}
				PaddingTop={new UDim(0, 50)}
			/>
			{props[Children]}
		</frame>
	);
}
