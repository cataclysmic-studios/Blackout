import { PageFrame } from "client/ui/components/page-frame";
import { PageProps } from "./menu-app";
import Roact from "@rbxts/roact";
import BackButton from "client/ui/components/back-button";

export default function OperatorsPage(props: PageProps) {
  const title: PageName = "Operators";
  return (
    <PageFrame Title={title} Visible={props.CurrentPage === title}>
      <BackButton App={props.App} />
    </PageFrame>
  );
}