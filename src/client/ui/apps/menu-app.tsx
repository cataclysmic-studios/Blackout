import { Dependency } from "@flamework/core";
import { SoundService as Sound} from "@rbxts/services";
import { AppScene } from "shared/enums";
import { App } from "client/controllers/apps";
import { SceneController } from "client/controllers/scene";
import Roact, { Children, PropsWithChildren } from "@rbxts/roact";
import Button from "client/ui/components/button";

function PageFrame(props: PropsWithChildren) {
	return (
		<frame
			BackgroundTransparency={1}
			Position={new UDim2(0, 0, 0, -50)}
			Size={new UDim2(1, 0, 1, 50)}
		>
			{props[Children]}
		</frame>
	);
}

@App({
	name: "Menu",
	requiredScene: AppScene.Menu,
	ignoreGuiInset: true,
})
export class MenuApp extends Roact.Component {
	protected willUnmount(): void {
    Sound.Music.Menu.Stop();
	}

	public render() {
		return (
			<>
				<PageFrame Key="Main">
					<frame
						Key="Buttons"
						BackgroundTransparency={1}
						Position={new UDim2(0, 0, 0.5, 0)}
						AnchorPoint={new Vector2(0, 0.5)}
						Rotation={-2}
						Size={new UDim2(0.15, 0, 0.5, 0)}
						AutomaticSize={Enum.AutomaticSize.Y}
					>
						<uilistlayout
							Padding={new UDim(0, 12)}
							SortOrder={Enum.SortOrder.LayoutOrder}
							VerticalAlignment={Enum.VerticalAlignment.Center}
						/>
						<imagelabel
							BackgroundTransparency={1}
							Image="http://www.roblox.com/asset/?id=11531960984"
							Size={new UDim2(1, 0, .5, 0)}
							AutomaticSize={Enum.AutomaticSize.Y}
						/>
						<Button Text="Play" OnClick={() => Dependency<SceneController>().setScene(AppScene.Game)} />
						<Button Text="Loadout" OnClick={(b) => b} />
						<Button Text="Settings" OnClick={(b) => b} />
					</frame>
					<frame
						Key="Shadow"
						BackgroundColor3={Color3.fromRGB(49, 49, 49)}
						BackgroundTransparency={0.1}
						BorderSizePixel={0}
						Position={new UDim2(-0.045, -7, 0, -50)}
						Size={new UDim2(0.3, 0, 2, 0)}
						ZIndex={-1}
					>
						<uigradient
							Transparency={
								new NumberSequence([
									new NumberSequenceKeypoint(0, 0.3, 0),
									new NumberSequenceKeypoint(1, 1, 0),
								])
							}
						/>
					</frame>
					<uipadding
						PaddingBottom={new UDim(0.04, 0)}
						PaddingLeft={new UDim(0.045, 0)}
						PaddingRight={new UDim(0.045, 0)}
						PaddingTop={new UDim(0, 50)}
					/>
				</PageFrame>
			</>
		);
	}
}
