import { PageFrame } from "client/ui/components/page-frame";
import { PageProps } from "./menu-app";
import Roact from "@rbxts/roact";
import Button from "client/ui/components/button";
import ButtonContainer from "client/ui/components/button-container";
import BackButton from "client/ui/components/back-button";
import { MenuPage } from "shared/enums";

export default function OperatorsPage(props: PageProps) {
  return (
    <PageFrame Title={MenuPage.Operators} Visible={props.CurrentPage === MenuPage.Operators}>
      <ButtonContainer>
        <Button Text="Operator One" LayoutOrder={0} OnClick={(b) => b} />
      </ButtonContainer>
      <BackButton App={props.App} />
    </PageFrame>
  );
}