import Roact from "@rbxts/roact";
import Rodux from "@rbxts/rodux";
import connect from "./connect";
import StoreProvider from "./StoreProvider";

declare namespace RoactRodux {
  export { connect, StoreProvider };
}

declare namespace RoactRodux {
  interface StatefulComponent<P> extends Roact.RenderablePropsClass<P> {}

  interface FunctionalComponent<P> {
    (props: P): Roact.Element | undefined;
  }

  type ComponentType<P = {}> = StatefulComponent<P> | FunctionalComponent<P>;

  type Shared<InjectedProps, DecorationTargetProps> = {
    [P in Extract<
      keyof InjectedProps,
      keyof DecorationTargetProps
    >]?: InjectedProps[P] extends DecorationTargetProps[P]
      ? DecorationTargetProps[P]
      : never;
  };

  type Matching<InjectedProps, DecorationTargetProps> = {
    [P in keyof DecorationTargetProps]: P extends keyof InjectedProps
      ? InjectedProps[P] extends DecorationTargetProps[P]
        ? DecorationTargetProps[P]
        : InjectedProps[P]
      : DecorationTargetProps[P];
  };

  type ConnectedComponentClass<C extends ComponentType<any>, P> =
    C & {
      new (props: P): Roact.Component<P>;
    };

  // Infers prop type from component C
  type GetProps<C> = C extends ComponentType<infer P> ? P : never;
  // Infer default props from component C
  type GetDefaultProps<C> = C extends { defaultProps: infer TDefaults }
    ? TDefaults
    : never;

  interface DispatchProp<A extends Rodux.Action = Rodux.AnyAction> {
    dispatch: Rodux.Dispatch<A>;
  }

  type MapStateToProps<TStateProps, TOwnProps, State> = (
    state: State,
    props: TOwnProps
  ) => TStateProps;

  type ConnectedComponent<C extends ComponentType<any>, TInjectedProps> =
    C extends { defaultProps: any }
      ? ConnectedComponentClass<
          C,
          Omit<
            GetProps<C> & GetDefaultProps<C>,
            keyof Shared<TInjectedProps, GetProps<C>>
          > &
            Partial<GetDefaultProps<C>>
        >
      : ConnectedComponentClass<
          C,
          Omit<GetProps<C>, keyof Shared<TInjectedProps, GetProps<C>>> // & TNeedsProps
        >;

  export type EnhancerWithProps<TInjectedProps, TNeedsProps> = <
    C extends ComponentType<Matching<TInjectedProps, GetProps<C>>>
  >(
    component: C
  ) => ConnectedComponent<C, TInjectedProps>;

  export type Enhancer<TInjectedProps> = EnhancerWithProps<TInjectedProps, {}>;

  export type MapDispatchToPropsFunction<TDispatchProps, TOwnProps> = (
    dispatch: Rodux.Dispatch<Rodux.Action>,
    ownProps: TOwnProps
  ) => TDispatchProps;

  export type MapStateToPropsFactory<TStateProps, TOwnProps, State> = (
    initialState: State,
    ownProps: TOwnProps
  ) => MapStateToProps<TStateProps, TOwnProps, State>;

  export type MapDispatcherToPropsFactory<TDispatchProps, TOwnProps> = (
    dispatch: Rodux.Dispatch<Rodux.Action>
  ) => MapDispatchToPropsFunction<TDispatchProps, TOwnProps>;

  export type MapStateToPropsParam<TStateProps, TOwnProps, State> =
    | MapStateToPropsFactory<TStateProps, TOwnProps, State>
    | MapStateToProps<TStateProps, TOwnProps, State>
    | undefined;

  export type MapDispatchToPropsFactory<TDispatchProps, TOwnProps> = (
    dispatch: Rodux.Dispatch<Rodux.Action>,
    ownProps: TOwnProps
  ) => MapDispatchToPropsFunction<TDispatchProps, TOwnProps>;

  export type MapDispatchToPropsNonObject<TDispatchProps, TOwnProps> =
    | MapDispatchToPropsFactory<TDispatchProps, TOwnProps>
    | MapDispatchToPropsFunction<TDispatchProps, TOwnProps>;

  export type InferThunkActionCreatorType<
    TActionCreator extends (...args: any[]) => any
  > = TActionCreator extends (
    ...args: infer TParams
  ) => (...args: any[]) => infer TReturn
    ? (...args: TParams) => TReturn
    : TActionCreator;

  export type HandleThunkActionCreator<TActionCreator> =
    TActionCreator extends (...args: any[]) => any
      ? InferThunkActionCreatorType<TActionCreator>
      : TActionCreator;

  export type ResolveThunks<TDispatchProps> = TDispatchProps extends {
    [key: string]: any;
  }
    ? {
        [C in keyof TDispatchProps]: HandleThunkActionCreator<
          TDispatchProps[C]
        >;
      }
    : TDispatchProps;
}

export = RoactRodux;
