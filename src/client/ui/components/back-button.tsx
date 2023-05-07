import Roact from "@rbxts/roact";
import { MenuPage } from "shared/enums";
import { useMenuApp } from "../apps/contexts/menu-app";
import Button from "./button";

export default function BackButton() {
	const { app } = useMenuApp();
	return <Button 
		Text="Back"
		Position={UDim2.fromScale(0.006, 0.85)}
		Rotation={-2}
		OnClick={() => app.setPage(MenuPage.Main)} 
	/>;
}