# @byronbroughten/utils

Domain-free TypeScript utilities: nothing here knows about Sheets, Apps Script or any app built on them. `@byronbroughten/sheets-framework` and the real-estate app both depend on it.

## Install

The package isn't on npm yet. Depend on it from a sibling npm workspace:

```json
"dependencies": { "@byronbroughten/utils": "^0.1.0" }
```

Each subpath resolves to `dist/`, which `npm run build` compiles from `src/`. A consumer that sets the `source` condition (`customConditions: ["source"]` in its tsconfig, and the same condition in its bundler and test runner) reads `src/` directly and needs no build.

## The subpath imports

There is no root entry. Each module is its own subpath:

```ts
import { SerialDate } from "@byronbroughten/utils/serial-date";
import { lazy } from "@byronbroughten/utils/lazy";
```

| Subpath | Exports |
| --- | --- |
| `/arr` | `Arr`, array helpers |
| `/lazy` | `lazy`, which wraps a factory so it runs on the first call only |
| `/obj` | `Obj`, object helpers and object and union utility types |
| `/serial-date` | `SerialDate`, a whole-day Sheets serial date, and its companion date types |
| `/serial-date-time` | `SerialDateTime`, date-and-time helpers that speak JS `Date` and take a time zone |
| `/str` | `Str`, string helpers and string template types |
| `/val` | `Val`, value guards and validators |
