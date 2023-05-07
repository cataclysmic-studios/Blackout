import { Dependency } from "@flamework/core";
import Roact from "@rbxts/roact";
import { ReplicatedStorage as Replicated, SoundService as Sound } from "@rbxts/services";
import { App } from "client/controllers/apps";
import { MenuController } from "client/controllers/menu";
import { AppScene, MenuPage } from "shared/enums";
import { default as EditLoadoutPage, default as LoadoutSelectionPage } from "./edit-loadout-page";
import MainPage from "./main-page";
import OperatorsPage from "./operators-page";
import SettingsPage from "./settings-page";

interface MenuState {
	CurrentPage: MenuPage;
}

export interface PageProps {
  App: MenuApp;
  CurrentPage: MenuPage;
}

@App({
	name: "Menu",
	requiredScene: AppScene.Menu,
	ignoreGuiInset: true
})
export class MenuApp extends Roact.Component<{}, MenuState> {
	private menuCameras = Replicated.WaitForChild("MenuCameras") as Folder;
	
	public setPage(pageName: MenuPage): void {
		this.setState({
			CurrentPage: pageName,
		});

		// const baseCF = Replicated.MenuCameras[pageName].Value;
		const baseCFrameValue = this.menuCameras.FindFirstChild(pageName) as CFrameValue | undefined;
		if (baseCFrameValue === undefined) return;
		const baseCF = baseCFrameValue.Value;

		const menu = Dependency<MenuController>();
		menu.setBaseCFrame(baseCF);
	}

	protected didMount(): void {
		this.setPage(MenuPage.Main);
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
				<OperatorsPage App={this} CurrentPage={this.state.CurrentPage} />
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
