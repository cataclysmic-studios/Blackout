import { Controller, Modding, OnInit } from "@flamework/core";
import { Constructor } from "@flamework/core/out/types";
import { withHookDetection } from "@rbxts/roact-hooked";
import { ClientStore, StoreActions } from "client/rodux/rodux";
import { StaticUI } from "client/static-ui";
import { Scene } from "shared/enums";
import { SceneController } from "./scene";
import RoactRodux, { StoreProvider } from "@rbxts/roact-rodux";
import Rodux from "@rbxts/rodux";
import Roact from "@rbxts/roact";

type StoreDispatch = Rodux.Dispatch<StoreActions>;

interface AppConfig {
	name: string;
	requiredScene?: Scene;
	ignoreGuiInset?: boolean;
	mapStateToProps?: (state: ClientStore) => unknown;
	mapDispatchToProps?: (dispatch: StoreDispatch) => unknown;
}

export const App = Modding.createMetaDecorator<[AppConfig]>("Class");

const noop = () => {};

withHookDetection(Roact);

@Controller({ loadOrder: 0 })
export class AppController implements OnInit {
	private apps = new Map<Constructor<Roact.Component>, AppConfig>;
	private appHandles = new Map<Constructor<Roact.Component>, Roact.Tree>;

	constructor(
		private readonly scene: SceneController
	) { }

	public onInit(): void {
		this.scene.OnSceneChanged.Connect((n, p) => this.onSceneChanged(n, p));

		const constructors = Modding.getDecorators<typeof App>();
		for (const { object, arguments: args } of constructors) {
			const [config] = args;
			this.apps.set(object as Constructor<Roact.Component>, config);
		}
	}

	public isShowing(appName: string): boolean {
		let showing = false;
		this.apps.forEach((config, app) => {
			if (showing) return;
			showing = (config.name === appName) && this.appHandles.has(app);
		});
		return showing
	}

	private onSceneChanged(newScene: Scene, oldScene?: Scene) {
		for (const [app, config] of this.apps) {
			if (config.requiredScene === undefined) continue;

			const wasOpen = config.requiredScene === oldScene;
			const shouldBeOpen = config.requiredScene === newScene;
			if (wasOpen && !shouldBeOpen)
				this.hideApp(app);
			else if (!wasOpen && shouldBeOpen)
				this.showApp(app);
		}
	}

	private showApp(app: Constructor<Roact.Component>) {
		const config = this.apps.get(app)!;
		let component = app as unknown as Roact.FunctionComponent;
		if (config.mapStateToProps || config.mapDispatchToProps) {
			const mapStateToProps = config.mapStateToProps ?? noop;
			const mapDispatchToProps = config.mapDispatchToProps ?? noop;

			component = RoactRodux.connect(
				(state: ClientStore) => mapStateToProps(state),
				(dispatch: StoreDispatch) => mapDispatchToProps(dispatch)
			)(component);
		}

		const content = (
			<StoreProvider store={ClientStore}>
				{Roact.createElement(component)}
			</StoreProvider>
		);

		const handle = Roact.mount(
			<screengui
				Key={config.name}
				IgnoreGuiInset={config.ignoreGuiInset}
				ResetOnSpawn={false}
				ZIndexBehavior={Enum.ZIndexBehavior.Sibling}
			>
				{content}
			</screengui>,
			StaticUI.container,
			config.name
		);

		this.appHandles.set(app, handle);
	}

	private hideApp(app: Constructor<Roact.Component>) {
		const handle = this.appHandles.get(app);
		const config = this.apps.get(app)!;
		if (handle) {
			Roact.unmount(handle);
			this.appHandles.delete(app);
		}
	}
}
