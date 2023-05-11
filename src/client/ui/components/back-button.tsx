import { MenuApp } from "../apps/menu/menu-app";
import Roact from "@rbxts/roact";
import Button from "./button";
import { MenuPage } from "shared/enums";

interface BackButtonProps {
	App: MenuApp;
}

export default function BackButton(props: BackButtonProps) {
	return <Button 
		Text="Back"
		Position={UDim2.fromScale(0.006, 0.85)}
		Rotation={-2}
		OnClick={() => props.App.setPage(MenuPage.Main)} 
	/>;
}