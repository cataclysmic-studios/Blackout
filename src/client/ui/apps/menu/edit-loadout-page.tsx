import Roact from "@rbxts/roact";
import BackButton from "client/ui/components/back-button";
import Button from "client/ui/components/button";
import ButtonContainer from "client/ui/components/button-container";
import { PageFrame } from "client/ui/components/page-frame";
import { MenuPage } from "shared/enums";
import { useMenuApp } from "../contexts/menu-app";

export default function EditLoadoutPage() {
	const { app, currentPage } = useMenuApp();
  return (
    <PageFrame Title={MenuPage.EditLoadout} Visible={currentPage === MenuPage.EditLoadout}>
      <ButtonContainer>
        <Button Text="Primary" OnClick={() => app.setPage(MenuPage.Gunsmith)} />
        <Button Text="Secondary" OnClick={() => app.setPage(MenuPage.Gunsmith)} />
        <Button Text="Grenade" OnClick={(b) => b} />
        <Button Text="Equipment" OnClick={(b) => b} />
      </ButtonContainer>
      <BackButton />
    </PageFrame>
  );
}