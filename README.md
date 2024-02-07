Inspired by our very own Stiig's excel sheet for formatting time on work items, this repo became. 🚀

The excel sheet was awesome, but you know what it was missing? That's right, validation features and dark theme! TypeScript and Tailwind swooped in and made it all levels of epic. ✨

Enter **Timelog Helper!** 🌟 This bad boy takes Stiig's foundation, adds some some magic to it, bringing the funk with features that make your timelog-work way smoother. 👩‍💻👨‍💻

## Features:

- 🌒 **Dark Mode**: Because bright screens are so last season!
- 🔄 **Total Time Calculation**: Bam! Effortless work item time summation.
- 🚀 **Time Registrations Cache**: Say goodbye to suddenly closing the browser, and forgetting your registrations.
- 📋 **Easy Copy-Paste**: Just a click away from copying registrations like a pro.
- 🚨 **Validation Galore**: No more overlap or funky formats – this baby keeps you on the straight and narrow.

Ready to level up your time-tracking game? Dive into the **Timelog Helper**

## Usage:

Write you registrations in the following format:
`start(hhmm)-end(hhmm): ID - description`

### Example:

```
0900-1000: A - description // 2 hours
1000-1100: B - description2 // 1 hour
1100-1115: A // Time from here (0,25h) will be added to the first "A", giving a total of 2,25 hours
```

# installation

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin) to make the TypeScript language service aware of `.vue` types.

If the standalone TypeScript plugin doesn't feel fast enough to you, Volar has also implemented a [Take Over Mode](https://github.com/johnsoncodehk/volar/discussions/471#discussioncomment-1361669) that is more performant. You can enable it by the following steps:

1. Disable the built-in TypeScript Extension
   1. Run `Extensions: Show Built-in Extensions` from VSCode's command palette
   2. Find `TypeScript and JavaScript Language Features`, right click and select `Disable (Workspace)`
2. Reload the VSCode window by running `Developer: Reload Window` from the command palette.

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
