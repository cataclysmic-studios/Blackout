import { Dependency } from "@flamework/core";
import { SceneController } from "client/controllers/scene";
import { PageFrame } from "client/ui/components/page-frame";
import { PageProps } from "./menu-app";
import { AppScene, MenuPage } from "shared/enums";
import Roact from "@rbxts/roact";
import Button from "client/ui/components/button";
import ButtonContainer from "client/ui/components/button-container";

export default function MainPage(props: PageProps) {
  return (
    <PageFrame Title={MenuPage.Main} Visible={props.CurrentPage === MenuPage.Main}>
      <ButtonContainer>
        <Button Text="Play" OnClick={() => Dependency<SceneController>().swapScene(AppScene.Game)} />
        <Button Text="Loadout" OnClick={() => props.App.setPage(MenuPage.Loadout)} />
        <Button Text="Operators" OnClick={() => props.App.setPage(MenuPage.Operators)} />
        <Button Text="Settings" OnClick={() => props.App.setPage(MenuPage.Settings)} />
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