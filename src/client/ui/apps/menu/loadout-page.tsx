import { PageFrame, PageName } from "client/ui/components/page-frame";
import { PageProps } from "./menu-app";
import Roact from "@rbxts/roact";
import Button from "client/ui/components/button";
import ButtonContainer from "client/ui/components/button-container";
import BackButton from "client/ui/components/back-button";

export default function LoadoutPage(props: PageProps) {
  const title: PageName = "Loadout";
  return (
    <PageFrame Title={title} Visible={props.CurrentPage === title}>
      <ButtonContainer>
        <Button Text="Loadout 1" LayoutOrder={0} OnClick={(b) => b} />
        <Button Text="Loadout 2" LayoutOrder={1} OnClick={(b) => b} />
        <Button Text="Loadout 3" LayoutOrder={2} OnClick={(b) => b} />
        <Button Text="Loadout 4" LayoutOrder={3} OnClick={(b) => b} />
      </ButtonContainer>
      <BackButton App={props.App} />
    </PageFrame>
  );
}