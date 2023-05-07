import Roact from "@rbxts/roact";
import BackButton from "client/ui/components/back-button";
import Button from "client/ui/components/button";
import ButtonContainer from "client/ui/components/button-container";
import { PageFrame } from "client/ui/components/page-frame";
import { MenuPage } from "shared/enums";
import { useMenuApp } from "../contexts/menu-app";

export default function LoadoutSelectionPage() {
	const { app, currentPage } = useMenuApp();
  const createButtons = (amount: number): Roact.Element[] => {
    const res: Roact.Element[] = [];
    for (let i = 0; i < amount; i++)
      res.push(<Button
        Text={"Loadout " + (i + 1)}
        LayoutOrder={i}
        OnClick={() => app.setPage(MenuPage.EditLoadout)}
      />);

    return res;
  }

  return (
    <PageFrame Title={MenuPage.Loadout} Visible={currentPage === MenuPage.Loadout}>
      <ButtonContainer>
        {...createButtons(5)}
      </ButtonContainer>
      <BackButton />
    </PageFrame>
  );
}