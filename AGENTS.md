# Writing a utility

Rules for `src/`, layered on the general style doc that ships with `@byronbroughten/config` (`docs/code-style.md` in that package; `config/docs/code-style.md` in the workspace).

- **A bundle takes a short abbreviation of its subject (`Str`, `Obj`, `Arr`, `Val`) or the name of the type it works on (`SerialDate`, `SerialDateTime`)**; a type's name tells a reader what the members take and return. A new bundle gets its own subpath in `package.json`'s `exports`.
- **A custom generic utility type lives in the bundle whose subject it transforms**, PascalCase, one transform per name: string template types in `Str.ts` (`RemoveFirstN`), object and union types in `Obj.ts` (`StrictOmit`) or a type-only file under `Obj/` (`MergeUnion`). Verify it with `IsExactly` / `assertType` / `assertNotType` from `src/testSupport/typeAssertions.ts`.
- **`for…in` is allowed here**: these are the structural utilities the general style doc reserves it for.
- **`as unknown as X` and `as any` are an escape hatch for generic structural-typing gymnastics in the structural bundles (`Obj`, `Obj/`, `Arr`)**. Lint rejects explicit `any`, so an `as any` also takes an `eslint-disable-next-line` that says why.
