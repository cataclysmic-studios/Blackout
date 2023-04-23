import Roact from "@rbxts/roact";
import Rodux from "@rbxts/rodux";

declare interface StoreProviderProps {
	store: Rodux.Store<unknown>;
}

declare class StoreProvider extends Roact.Component<StoreProviderProps> {
    constructor(props: StoreProviderProps);
    public render(): Roact.Element;
}

export = StoreProvider;