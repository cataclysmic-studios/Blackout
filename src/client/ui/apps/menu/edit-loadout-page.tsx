import { MenuPage } from "shared/enums";
import { PageFrame } from "client/ui/components/page-frame";
import { PageProps } from "./menu-app";
import Roact from "@rbxts/roact";
import Button from "client/ui/components/button";
import BackButton from "client/ui/components/back-button";
import ButtonContainer from "client/ui/components/button-container";

export default function EditLoadoutPage(props: PageProps) {
  return (
    <PageFrame Title={MenuPage.EditLoadout} Visible={props.CurrentPage === MenuPage.EditLoadout}>
      <ButtonContainer>
        <Button Text="Primary" OnClick={() => props.App.setPage(MenuPage.Gunsmith)} />
        <Button Text="Secondary" OnClick={() => props.App.setPage(MenuPage.Gunsmith)} />
        <Button Text="Grenade" OnClick={(b) => b} />
        <Button Text="Equipment" OnClick={(b) => b} />
      </ButtonContainer>
      <BackButton App={props.App} />
    </PageFrame>
  );
}