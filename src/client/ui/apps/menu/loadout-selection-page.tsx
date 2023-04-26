import { PageFrame } from "client/ui/components/page-frame";
import { PageProps } from "./menu-app";
import Roact from "@rbxts/roact";
import Button from "client/ui/components/button";
import ButtonContainer from "client/ui/components/button-container";
import BackButton from "client/ui/components/back-button";

export default function LoadoutSelectionPage(props: PageProps) {
  const title: PageName = "Loadout";
  const createBtns = (amount: number): Roact.Element[] => {
    const res: Roact.Element[] = [];
    for (let i = 0; i < amount; i++)
      res.push(<Button
        Text={"Loadout " + (i + 1)}
        LayoutOrder={i}
        OnClick={() => props.App.setPage("EditLoadout")}
      />);

    return res;
  }

  return (
    <PageFrame Title={title} Visible={props.CurrentPage === title}>
      <ButtonContainer>
        {...createBtns(5)}
      </ButtonContainer>
      <BackButton App={props.App} />
    </PageFrame>
  );
}