import { PageFrame } from "client/ui/components/page-frame";
import { PageProps } from "./menu-app";
import Roact from "@rbxts/roact";
import Button from "client/ui/components/button";
import ButtonContainer from "client/ui/components/button-container";
import BackButton from "client/ui/components/back-button";

export default function SettingsPage(props: PageProps) {
  const title: PageName = "Settings";
  return (
    <PageFrame Title={title} Visible={props.CurrentPage === title}>
      <ButtonContainer>
        <Button Text="Graphics" LayoutOrder={0} OnClick={(b) => b} />
        <Button Text="Audio" LayoutOrder={1} OnClick={(b) => b} />
        <Button Text="Controls" LayoutOrder={2} OnClick={(b) => b} />
      </ButtonContainer>
      <BackButton App={props.App} />
    </PageFrame>
  );
}