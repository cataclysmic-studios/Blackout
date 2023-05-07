import { Dependency } from "@flamework/core";
import Roact from "@rbxts/roact";
import { SceneController } from "client/controllers/scene";
import Button from "client/ui/components/button";
import ButtonContainer from "client/ui/components/button-container";
import { PageFrame } from "client/ui/components/page-frame";
import { AppScene, MenuPage } from "shared/enums";
import { useMenuApp } from "../contexts/menu-app";

export default function MainPage() {
	const { app, currentPage } = useMenuApp();
	
  return (
    <PageFrame Title={MenuPage.Main} Visible={currentPage === MenuPage.Main}>
      <ButtonContainer>
        <Button Text="Play" OnClick={() => Dependency<SceneController>().swapScene(AppScene.Game)} />
        <Button Text="Loadout" OnClick={() => app.setPage(MenuPage.Loadout)} />
        <Button Text="Operators" OnClick={() => app.setPage(MenuPage.Operators)} />
        <Button Text="Settings" OnClick={() => app.setPage(MenuPage.Settings)} />
      </ButtonContainer>
      <imagelabel
        BackgroundTransparency={1}
        Image="http://www.roblox.com/asset/?id=11531960984"
        Position={new UDim2(-0.025, 0, 0.225, 0)}
        Size={new UDim2(0.3, 0, 0.15, 0)}
        AutomaticSize={Enum.AutomaticSize.Y}
      />
    </PageFrame>
  );
}