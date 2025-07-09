# Luso Bot

[![GitBook](https://img.shields.io/static/v1?message=Documented%20on%20GitBook&logo=gitbook&logoColor=ffffff&label=%20&labelColor=5c5c5c&color=3F89A1)](https://www.gitbook.com/preview?utm_source=gitbook_readme_badge&utm_medium=organic&utm_campaign=preview_documentation&utm_content=link)

I used the [Screeps Typescript Starter](https://github.com/screepers/screeps-typescript-starter/tree/master) as a start point.

Gitbook documentation available [here](https://luso.gitbook.io/screeps-luso-bot).

## Setup

### `screeps.json`

Copy `screeps.sample.json` to `screeps.json` and fill in `token` fields for the main, sim, and arena screeps worlds. Fill in the `email` and `password` section of the `pserver` environment if running on a private server.

More environments can be created by adding to the `screeps.json` file. E.g. supporting a second branch instead of manually editing the `branch` field.

### Installing packages

I think if you're in this repo you can just run `npm install`. This is more for future me if I have to re-setup everything. But haven't tested yet.

## Usage

### Pushing to Screeps server

Run `npm run push-<env>`. Where `<env>` is one of the environments defined in `screeps.json`. e.g. `npm run push-main` to push to the main MMO server.

## Screeps Typescript Starter Changes

Full disclosure I am not JS or TS competent. I am just moving forward. I got some errors when trying to run some `npm` commands so I went through the motions of fixing them but I don't know if I should have. Anyways this is what I've done.

### eslint-config-prettier Conflict

I had a conflict saying something like:

```
Cannot read config file... "prettier/@typescript-eslint" has been merged into "prettier"
```

This was due to me using a newer version of `eslint-config-prettier` which resulted in `prettier/@typescript-eslint` not being needed anymore.

Fixed by removing `prettier/@typescript-eslint` from the `extends` array in the `.eslintrc.js` file.

### TypeScript Version Warning

After fixing the above, I got a warning saying:

```
=============


WARNING: You are currently running a version of TypeScript which is not officially supported by @typescript-eslint/typescript-estree.


You may find that it works just fine, or you may not.


SUPPORTED TYPESCRIPT VERSIONS: >=3.3.1 <4.5.0


YOUR TYPESCRIPT VERSION: 4.9.5


Please only submit bug reports when using the officially supported version.


=============
```

Apparently this means my linting packages, `@typescript-eslint/parser` and `@typescript-eslint/eslint-plugin` are older than the TypeScript version (`4.9.5`).

Fixed by upgrading the ESLint packages with:

```
npm install eslint@latest @typescript-eslint/parser@latest @typescript-eslint/eslint-plugin@latest --save-dev
```

### Node.js Engine Warning (`EBADENGINE`)

Apparently I'm using Node.js version 24 where this project expects v10 or v12. To fix this I updated the `package.json` file to set `"node": ">=18.0.0"` in the `engines` section.

### ESLint v9 Configuration File Error

Apparently ESLint v9 uses a new configuration style. I had to rename `.eslintrc.js` to `eslint.config.js`.

This also resulted in another issue because the config format also changed. So the config needs to be updated. Honestly I used Gemini to convert the old style to the new style. It may have errors that I'm unaware of.

This also resulted in needing to install a few more packages:

```
npm install globals typescript-eslint eslint-plugin-import eslint-config-prettier --save-dev
```

### Linting errors

Before making any changes I ran `npm run lint` and found some errors:

```
npm run lint

> screeps-typescript-starter@3.0.0 lint
> eslint "src/**/*.ts"


.../screeps/luso_bot/src/main.ts
  25:3  error  ES2015 module syntax is preferred over namespaces  @typescript-eslint/no-namespace

.../screeps/luso_bot/src/utils/ErrorMapper.ts
   8:9   warning  Unexpected dangling '_' in '_consumer'                                                no-underscore-dangle
   9:7   warning  Unexpected dangling '_' in '_consumer'                                                no-underscore-dangle
   9:46  error    Unsafe argument of type `any` assigned to a parameter of type `RawSourceMap`          @typescript-eslint/no-unsafe-argument
   9:46  error    A `require()` style import is forbidden                                               @typescript-eslint/no-require-imports
  12:12  warning  Unexpected dangling '_' in '_consumer'                                                no-underscore-dangle
  33:5   warning  Unused eslint-disable directive (no problems were reported from 'no-useless-escape')

✖ 7 problems (3 errors, 4 warnings)
  0 errors and 1 warning potentially fixable with the `--fix` option.
```

The first one is about the module syntax in `main.ts`. It's refering to this:

```
declare global {
  /*
    Example types, expand on these or remove them and add your own.
    Note: Values, properties defined here do no fully *exist* by this type definiton alone.
          You must also give them an implemention if you would like to use them. (ex. actually setting a `role` property in a Creeps memory)

    Types added in this `global` block are in an ambient, global context. This is needed because `main.ts` is a module file (uses import or export).
    Interfaces matching on name from @types/screeps will be merged. This is how you can extend the 'built-in' interfaces from @types/screeps.
  */
  // Memory extension samples
  interface Memory {
    uuid: number;
    log: any;
  }

  interface CreepMemory {
    role: string;
    room: string;
    working: boolean;
  }

  // Syntax for adding properties to `global` (ex "global.log")
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface Global {
      log: any;
    }
  }
}
```

Apparently this is normal and can be ignored so I added the `// eslint-disable-next-line @typescript-eslint/no-namespace` line above the error.

For the dangling `_` errors I adjusted the `eslint.config.js` file. In the rules section change `"no-underscore-dangle": "warn",` -> `"no-underscore-dangle": ["warn", { "allowAfterThis": true, "enforceInClassFields": false }],`.

For the `any` assigned to a parameter of type `RawSourceMap` error I imported `RawSourceMap` and used `as RawSourceMap`:

```
import { RawSourceMap, SourceMapConsumer } from "source-map";

export class ErrorMapper {
  // Cache consumer
  private static _consumer?: SourceMapConsumer;

  public static get consumer(): SourceMapConsumer {
    if (this._consumer == null) {
      this._consumer = new SourceMapConsumer(require("main.js.map") as RawSourceMap);
```

I had originally written the import like this: `import {SourceMapConsumer, RawSourceMap} from "source-map";` but ESLint got mad and warned me it wasn't sorted alphabetically... It's so picky. But I fixed it with `npm lint -- --fix` (I don't want to manually fix this kind of thing...).

Finally, the last issue. It seems to be "`require()` style import is forbidden". In this case we are requiring a file that doesn't actually exist until runtime so we will ignore this issue.

```
// apparently `require()` is old school but also `main.js.map` doesn't exist until runtime
// so we will ignore this error...
// eslint-disable-next-line @typescript-eslint/no-require-imports
this._consumer = new SourceMapConsumer(require("main.js.map") as RawSourceMap);
```

## Resources

- [Screeps Typescript Starter Docs](https://screepers.gitbook.io/screeps-typescript-starter)
- [Screeps Typescript Starter Repo](https://github.com/screepers/screeps-typescript-starter/tree/master)
- [Screeps Docs](https://docs.screeps.com/index.html)
- [Screeps API](https://docs.screeps.com/api/#Game.map.findRoute)
- [Harabi Screeps](https://sy-harabi.github.io/)
- [Screeps docs](https://docs.screeps.com/index.html)
- [Screeps API](https://docs.screeps.com/api/)
- [Screeps Third Party Tools](https://docs.screeps.com/third-party.html)
- [Screeps AutoComplete (haven't tried this - let me know if it works)](https://github.com/Garethp/ScreepsAutocomplete)
- [Emoji Finder](https://emojifinder.com/construction)
- [Gitbook Documentation](https://gitbook.com/docs)
