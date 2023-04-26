import { Dependency } from "@flamework/core";
import { SceneController } from "client/controllers/scene";
import { PageFrame } from "client/ui/components/page-frame";
import { PageProps } from "./menu-app";
import { AppScene } from "shared/enums";
import Roact from "@rbxts/roact";
import Button from "client/ui/components/button";
import ButtonContainer from "client/ui/components/button-container";

export default function MainPage(props: PageProps) {
  const title: PageName = "Main";
  return (
    <PageFrame Title={title} Visible={props.CurrentPage === title}>
      <ButtonContainer>
        <Button Text="Play" OnClick={() => Dependency<SceneController>().swapScene(AppScene.Game)} />
        <Button Text="Loadout" OnClick={() => props.App.setPage("Loadout")} />
        <Button Text="Settings" OnClick={() => props.App.setPage("Settings")} />
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