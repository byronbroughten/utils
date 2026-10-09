import type { Merge } from "./merge.js";

export type UnionObj<Union extends string, P extends string, R> = {
  [K in Union]: Merge<Record<P, K>, R>;
}[Union];
