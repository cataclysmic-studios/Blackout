import Roact, { Children, createContext, PropsWithChildren } from "@rbxts/roact";
import { useContext, useMemo } from "@rbxts/roact-hooked";
import { MenuPage } from "shared/enums";
import { MenuApp } from "../menu/menu-app";


function useProviderValue(app: MenuApp, currentPage: MenuPage) {
	return useMemo(() => ({app, currentPage}), [currentPage])
}

type Context = { app: MenuApp, currentPage: MenuPage };
const menuAppContext = createContext<Context | undefined>(undefined);

export const MenuAppProvider = (props: PropsWithChildren<{ app: MenuApp, currentPage: MenuPage }>) => {
	const value = useProviderValue(props.app, props.currentPage)

	return (
		<menuAppContext.Provider value={value}>
			{props[Children]}
		</menuAppContext.Provider>
	);
};
export function useMenuApp() {
	const context = useContext(menuAppContext);
	if (context === undefined) {
		error(
			"You are trying to use useMenuApp() outside of a <MenuAppProvider />!! Put it in one!"
		);
	}
	return context;
}