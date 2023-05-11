import { PageFrame } from "client/ui/components/page-frame";
import { PageProps } from "./menu-app";
import Roact from "@rbxts/roact";
import Button from "client/ui/components/button";
import ButtonContainer from "client/ui/components/button-container";
import BackButton from "client/ui/components/back-button";
import { MenuPage } from "shared/enums";

export default function LoadoutSelectionPage(props: PageProps) {
  const createButtons = (amount: number): Roact.Element[] => {
    const res: Roact.Element[] = [];
    for (let i = 0; i < amount; i++)
      res.push(<Button
        Text={"Loadout " + (i + 1)}
        LayoutOrder={i}
        OnClick={() => props.App.setPage(MenuPage.EditLoadout)}
      />);

    return res;
  }

  return (
    <PageFrame Title={MenuPage.Loadout} Visible={props.CurrentPage === MenuPage.Loadout}>
      <ButtonContainer>
        {...createButtons(5)}
      </ButtonContainer>
      <BackButton App={props.App} />
    </PageFrame>
  );
}