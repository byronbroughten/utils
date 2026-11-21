import type { Merge } from "./merge.ts";

export type UnionObj<Union extends string, P extends string, R> = {
  [K in Union]: Merge<Record<P, K>, R>;
}[Union];
