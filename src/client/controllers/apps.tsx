import { Controller, Modding, OnInit } from "@flamework/core";
import { Constructor } from "@flamework/core/out/types";
import { withHookDetection } from "@rbxts/roact-hooked";
import { ClientStore, StoreActions } from "client/rodux/rodux";
import { StaticUI } from "client/static-ui";
import { AppScene } from "shared/enums";
import { SceneController } from "./scene";
import RoactRodux, { StoreProvider } from "@rbxts/roact-rodux";
import Rodux from "@rbxts/rodux";
import Roact, { createRef } from "@rbxts/roact";

type StoreDispatch = Rodux.Dispatch<StoreActions>;

interface AppConfig {
	name: string;
	requiredScene?: AppScene;
	ignoreGuiInset?: boolean;
	mapStateToProps?: (state: ClientStore) => unknown;
	mapDispatchToProps?: (dispatch: StoreDispatch) => unknown;
}

export const App = Modding.createMetaDecorator<[AppConfig]>("Class");

const noop = () => {};

withHookDetection(Roact);

@Controller({ loadOrder: 0 })
export class AppController implements OnInit {
	private readonly apps = new Map<Constructor<Roact.Component>, AppConfig>;
	private readonly appHandles = new Map<Constructor<Roact.Component>, Roact.Tree>;
	public readonly appRefs = new Map<Constructor<Roact.Component>, Roact.Ref<ScreenGui>>;

	public constructor(
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

	/**
	 * Returns whether or not the given app is mounted
	 * @param appName
	 * @returns True if the app is mounted
	 */
	public isShowing(appName: string): boolean {
		let showing = false;
		this.apps.forEach((config, app) => {
			if (showing) return;
			showing = (config.name === appName) && this.appHandles.has(app);
		});
		return showing
	}

	private onSceneChanged(newScene: AppScene, oldScene?: AppScene) {
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

	/**
	 * Mounts an app
	 * @param app
	 */
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

		const ref = createRef<ScreenGui>();
		const handle = Roact.mount(
			<screengui
				Key={config.name}
				Ref={ref}
				ScreenInsets={config.ignoreGuiInset ? Enum.ScreenInsets.DeviceSafeInsets : Enum.ScreenInsets.CoreUISafeInsets}
				ResetOnSpawn={false}
				ZIndexBehavior={Enum.ZIndexBehavior.Sibling}
			>
				{content}
			</screengui>,
			StaticUI.container,
			config.name
		);

		this.appHandles.set(app, handle);
		this.appRefs.set(app, ref);
	}

	/**
	 * Unmounts an app
	 * @param app
	 */
	private hideApp(app: Constructor<Roact.Component>) {
		const handle = this.appHandles.get(app);
		if (handle) {
			Roact.unmount(handle);
			this.appHandles.delete(app);
			this.appRefs.delete(app);
		}
	}
}
