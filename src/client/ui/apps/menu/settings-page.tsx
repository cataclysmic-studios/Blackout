import Roact from "@rbxts/roact";
import BackButton from "client/ui/components/back-button";
import Button from "client/ui/components/button";
import ButtonContainer from "client/ui/components/button-container";
import { PageFrame } from "client/ui/components/page-frame";
import { MenuPage } from "shared/enums";
import { useMenuApp } from "../contexts/menu-app";

export default function SettingsPage() {
	const { app, currentPage } = useMenuApp();
  return (
    <PageFrame Title={MenuPage.Settings} Visible={currentPage === MenuPage.Settings}>
      <ButtonContainer>
        <Button Text="Graphics" LayoutOrder={0} OnClick={(b) => b} />
        <Button Text="Audio" LayoutOrder={1} OnClick={(b) => b} />
        <Button Text="Controls" LayoutOrder={2} OnClick={(b) => b} />
      </ButtonContainer>
      <BackButton />
    </PageFrame>
  );
}