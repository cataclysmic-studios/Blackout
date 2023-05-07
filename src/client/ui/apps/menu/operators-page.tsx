import Roact from "@rbxts/roact";
import BackButton from "client/ui/components/back-button";
import Button from "client/ui/components/button";
import ButtonContainer from "client/ui/components/button-container";
import { PageFrame } from "client/ui/components/page-frame";
import { MenuPage } from "shared/enums";
import { useMenuApp } from "../contexts/menu-app";

export default function OperatorsPage() {
	const { app, currentPage } = useMenuApp();
  return (
    <PageFrame Title={MenuPage.Operators} Visible={currentPage === MenuPage.Operators}>
      <ButtonContainer>
        <Button Text="Operator One" LayoutOrder={0} OnClick={(b) => b} />
      </ButtonContainer>
      <BackButton />
    </PageFrame>
  );
}