import { PageFrame } from "client/ui/components/page-frame";
import { PageProps } from "./menu-app";
import Roact from "@rbxts/roact";
import Button from "client/ui/components/button";
import ButtonContainer from "client/ui/components/button-container";
import BackButton from "client/ui/components/back-button";
import { MenuPage } from "shared/enums";

export default function SettingsPage(props: PageProps) {
  return (
    <PageFrame Title={MenuPage.Settings} Visible={props.CurrentPage === MenuPage.Settings}>
      <ButtonContainer>
        <Button Text="Graphics" LayoutOrder={0} OnClick={(b) => b} />
        <Button Text="Audio" LayoutOrder={1} OnClick={(b) => b} />
        <Button Text="Controls" LayoutOrder={2} OnClick={(b) => b} />
      </ButtonContainer>
      <BackButton App={props.App} />
    </PageFrame>
  );
}