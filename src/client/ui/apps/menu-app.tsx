import { Dependency } from "@flamework/core";
import { SoundService as Sound} from "@rbxts/services";
import { AppScene } from "shared/enums";
import { App } from "client/controllers/apps";
import { SceneController } from "client/controllers/scene";
import Roact, { Children, PropsWithChildren } from "@rbxts/roact";
import Button from "client/ui/components/button";

type PageName = "Main" | "Loadout" | "Settings";
interface PageProps {
	Title: PageName;
	CurrentPage: PageName;
};

function PageFrame(props: PropsWithChildren<PageProps>) {
	return (
		<frame
			Key={props.Title}
			Visible={props.CurrentPage === props.Title}
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

function ButtonContainer(props: PropsWithChildren) {
	return (
    <frame
      Key="Buttons"
      BackgroundTransparency={1}
      Position={new UDim2(0, 0, 0.5, 0)}
      AnchorPoint={new Vector2(0, 0.5)}
      Rotation={-2}
      Size={new UDim2(0.15, 0, 0.75, 0)}
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

interface MenuState {
	CurrentPage: PageName;
}

@App({
	name: "Menu",
	requiredScene: AppScene.Menu,
	ignoreGuiInset: true
})
export class MenuApp extends Roact.Component<{}, MenuState> {
	private setPage(pageName: PageName): void {
		this.setState({
			CurrentPage: pageName,
		});
	}

	protected didMount(): void {
		this.setPage("Main");
	}

	protected willUnmount(): void {
    Sound.Music.Menu.Stop();
	}

	public render() {
		return (
			<>
				<PageFrame Title="Main" CurrentPage={this.state.CurrentPage}>
					<ButtonContainer>
						<Button Text="Play" OnClick={() => Dependency<SceneController>().setScene(AppScene.Game)} />
						<Button Text="Loadout" OnClick={() => this.setPage("Loadout")} />
						<Button Text="Settings" OnClick={() => this.setPage("Settings")} />
					</ButtonContainer>
					<imagelabel
						BackgroundTransparency={1}
						Image="http://www.roblox.com/asset/?id=11531960984"
						Position={new UDim2(-0.025, 0, 0.225, 0)}
						Size={new UDim2(0.3, 0, 0.15, 0)}
						AutomaticSize={Enum.AutomaticSize.Y}
					/>
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
				</PageFrame>
				<PageFrame Title="Loadout" CurrentPage={this.state.CurrentPage}>
					<ButtonContainer>
						<Button Text="Back" OnClick={() => this.setPage("Main")} />
					</ButtonContainer>
				</PageFrame>
				<PageFrame Title="Settings" CurrentPage={this.state.CurrentPage}>
					<ButtonContainer>
						<Button Text="Back" OnClick={() => this.setPage("Main")} />
					</ButtonContainer>
				</PageFrame>
			</>
		);
	}
}
