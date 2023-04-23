import { NetworkInfo } from "../types";
import { Middleware, MiddlewareFactory, MiddlewareProcessor } from "./types";
export declare function createMiddlewareProcessor<I extends readonly unknown[], O>(middlewareFactories: MiddlewareFactory<I, O>[] | undefined, networkInfo: NetworkInfo, finalize: Middleware<I, O>): MiddlewareProcessor<I, O>;
