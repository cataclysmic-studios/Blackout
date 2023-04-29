import { Dependency } from "@flamework/core";
import { ReplicatedStorage as Replicated, SoundService as Sound } from "@rbxts/services";
import { AppScene } from "shared/enums";
import { App } from "client/controllers/apps";
import { MenuController } from "client/controllers/menu";
import Roact from "@rbxts/roact";
import MainPage from "./main-page";
import LoadoutSelectionPage from "./edit-loadout-page";
import SettingsPage from "./settings-page";
import EditLoadoutPage from "./edit-loadout-page";

interface MenuState {
	CurrentPage: PageName;
}

export interface PageProps {
  App: MenuApp;
  CurrentPage: PageName;
}

@App({
	name: "Menu",
	requiredScene: AppScene.Menu,
	ignoreGuiInset: true
})
export class MenuApp extends Roact.Component<{}, MenuState> {
	public setPage(pageName: PageName): void {
		this.setState({
			CurrentPage: pageName,
		});

		const menu = Dependency<MenuController>();
		const baseCF = Replicated.MenuCameras[pageName].Value;
		menu.setBaseCFrame(baseCF);
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
				<MainPage App={this} CurrentPage={this.state.CurrentPage} />
				<LoadoutSelectionPage App={this} CurrentPage={this.state.CurrentPage} />
				<EditLoadoutPage App={this} CurrentPage={this.state.CurrentPage} />
				<SettingsPage App={this} CurrentPage={this.state.CurrentPage} />
				<frame
					Key="Shadow"
					BackgroundColor3={Color3.fromRGB(50, 50, 50)}
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
			</>
		);
	}
}
