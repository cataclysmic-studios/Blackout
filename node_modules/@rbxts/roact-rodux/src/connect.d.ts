import RoactRodux from "./index";
declare function connect(): RoactRodux.Enhancer<RoactRodux.DispatchProp>;
declare function connect<
    TStateProps = {},
    no_dispatch = {},
    TOwnProps = {},
    State = {}
>(
    this: void,
    mapStateToProps: RoactRodux.MapStateToProps<TStateProps, TOwnProps, State>,
): RoactRodux.EnhancerWithProps<TStateProps & RoactRodux.DispatchProp, TOwnProps>;
declare function connect<no_state = {}, TDispatchProps = {}, TOwnProps = {}>(
    this: void,
    mapStateToProps: undefined,
    mapDispatchToProps: RoactRodux.MapDispatchToPropsNonObject<
        TDispatchProps,
        TOwnProps
    >,
): RoactRodux.EnhancerWithProps<TDispatchProps, TOwnProps>;
declare function connect<
    TStateProps = {},
    TDispatchProps = {},
    TOwnProps = {},
    State = {}
>(
    this: void,
    mapStateToProps: RoactRodux.MapStateToPropsParam<TStateProps, TOwnProps, State>,
    mapDispatchToProps: RoactRodux.MapDispatchToPropsNonObject<
        TDispatchProps,
        TOwnProps
    >,
): RoactRodux.EnhancerWithProps<TStateProps & TDispatchProps, TOwnProps>;
export = connect;