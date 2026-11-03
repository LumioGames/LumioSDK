<div align="center">

<a href="https://lumiogames.cn/studio/"><img src=".github/readme/hero.en.svg" width="100%" alt="Made by LumioGames · Lumio SDK: one npm package connects your H5 game to the Lumio platform"></a>

**[Developer Center lumiogames.cn/studio](https://lumiogames.cn/studio/)** &nbsp;·&nbsp; **[npm](https://www.npmjs.com/package/@lumiogames/sdk)** &nbsp;·&nbsp; English &nbsp;·&nbsp; [简体中文](README.zh-CN.md)

[![Made by LumioGames](https://img.shields.io/badge/made%20by-LumioGames-6659DB?style=flat-square&labelColor=171C34&logo=data%3Aimage%2Fsvg%2Bxml%3Bbase64%2CPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIiB3aWR0aD0iOTYiIGhlaWdodD0iOTYiPjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iZyIgeDE9IjAiIHkxPSIwIiB4Mj0iMSIgeTI9IjEiPjxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iIzY2NTlkYiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzlhYTZmZiIvPjwvbGluZWFyR3JhZGllbnQ%2BPC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiByeD0iMjkiIGZpbGw9InVybCgjZykiLz48cmVjdCB4PSIyNSIgeT0iMjIiIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgcng9IjQiIGZpbGw9IiNmZmYiLz48cmVjdCB4PSIyNSIgeT0iNDIiIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgcng9IjQiIGZpbGw9IiNmZmYiLz48cmVjdCB4PSIyNSIgeT0iNjIiIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgcng9IjQiIGZpbGw9IiNmZmYiLz48cmVjdCB4PSI0NSIgeT0iNjIiIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgcng9IjQiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjYiLz48cmVjdCB4PSI2NSIgeT0iNjIiIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgcng9IjQiIGZpbGw9IiM1ZGUyYzYiLz48cGF0aCBkPSJNNzAgMTlDNzEuNTYgMjguMSA3My45IDMwLjQ0IDgzIDMyQzczLjkgMzMuNTYgNzEuNTYgMzUuOSA3MCA0NUM2OC40NCAzNS45IDY2LjEgMzMuNTYgNTcgMzJDNjYuMSAzMC40NCA2OC40NCAyOC4xIDcwIDE5WiIgZmlsbD0iI2ZmZiIvPjwvc3ZnPgo%3D)](https://lumiogames.cn/)
[![npm](https://img.shields.io/npm/v/@lumiogames/sdk?style=flat-square&color=6659DB&labelColor=171C34)](https://www.npmjs.com/package/@lumiogames/sdk)
[![node](https://img.shields.io/badge/node-%E2%89%A524.18-5DE2C6?style=flat-square&labelColor=171C34)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-types%20included-9AA6FF?style=flat-square&labelColor=171C34)](#install)
[![license](https://img.shields.io/badge/license-PolyForm%20Shield%20%2B%20extra%20grant-AEB5D6?style=flat-square&labelColor=171C34)](#license)

</div>

<h3 align="center">Join the developer community</h3>

<p align="center">
  <a href="https://qm.qq.com/q/PGkXh4tCyQ"><img src=".github/readme/qr-qq.en.svg" width="250" alt="Scan or click to join QQ group 972220164"></a>
  <a href="https://applink.feishu.cn/client/chat/chatter/add_by_link?link_token=b24vf257-5a2b-41ce-935e-bc4ce19dc396"><img src=".github/readme/qr-feishu.en.svg" width="250" alt="Scan or click to join the LumioGame community on Feishu"></a>
</p>

---

## What Lumio SDK is

Lumio SDK (npm package `@lumiogames/sdk`) is the platform SDK from [LumioGames](https://lumiogames.cn/) for H5 games that want to publish on Lumio.

Your game runs inside Lumio's play page and talks to the platform through the SDK. The platform handles sign-in; your game only gets a player ID for your game and the profile the player agrees to share. Cloud saves, leaderboards and achievements are stored by the platform, so you do not run your own server for them.

| <img src=".github/readme/icon-simulator.svg" width="56" alt=""><br>**Works locally first** | <img src=".github/readme/icon-connect.svg" width="56" alt=""><br>**One call to connect** | <img src=".github/readme/icon-errors.svg" width="56" alt=""><br>**Clear errors** |
| :-- | :-- | :-- |
| A built-in simulator lets you try saves and leaderboards in Node or a browser, with no sign-in and no network. | `connectLumioFromLaunch()` reads the current game and version from the launch URL, so nothing is hard-coded before upload. | No permission returns `platform.not_granted`, not connected returns `platform.not_wired`, and save conflicts are reported separately. Nothing fakes success. |

The SDK is published on npm with TypeScript declarations and does not depend on platform or engine source. This repository holds the guide, runnable examples and the changelog, and is where you report problems.

## 30-second start

No sign-up, no sign-in. See how saves and leaderboards work in the local simulator first:

```sh
git clone https://github.com/LumioGames/LumioSDK.git
cd LumioSDK/examples/simulator-save-leaderboard
npm install
npm start
```

Output (the player ID is a local one made by the simulator):

```text
read    null
write   { revision: 1 }
conflict { level: 2 } revision 1
submit  { stored: 100, improved: true }
top     [
  {
    rank: 1,
    playerId: 'gp_Zjl084leBrQg8XK29PM-fQ',
    score: 100,
    verified: false,
    isSelf: true
  }
]
friends platform.not_granted
```

The example reads a new save slot, writes it, writes again with a stale revision (a conflict; the cloud copy is not overwritten), submits a score and queries the leaderboard, and finally calls the friends API that is not open yet (`platform.not_granted`). The code is in [examples/simulator-save-leaderboard/index.mjs](examples/simulator-save-leaderboard/index.mjs).

## Install

The easiest way: give this repository's address to your agent (Claude Code or Codex) and say "connect my game to Lumio SDK following the README".

The block below is written for the agent.

> **For AI agents: integrating Lumio SDK**
>
> Go in order. If any step fails, stop and show the user the exact error. Do not skip steps.
>
> 1. Run `node -v`. It must be 24.18 or later and below 25. If not, ask the user to install it; do not install it for them.
> 2. In the user's game project, run `npm i @lumiogames/sdk@2.10.1`. The project must be built into static files with a bundler (Vite, esbuild, webpack and so on).
> 3. Start with the local simulator: use `createLumioSimulator()` (entry `@lumiogames/sdk/simulator`) on the dev page and get saves, leaderboards and other logic working.
> 4. Then connect to the platform with `connectLumioFromLaunch()` (entry `@lumiogames/sdk`). If the connection fails, show the error; never fall back to the simulator.
> 5. Check `ok` on every call. On failure read `failure.code`; on save writes also check `value.conflict`. Never fake success.
> 6. Write `lumio.json` at the package root declaring the capabilities, save slots and leaderboard fields in use, and keep the `./lumio-bootstrap.js` reference in the entry HTML. See "Packaging and upload" in this README.
> 7. Use only the features marked available in the Features tables. Friends, direct messages and multiplayer are not open yet.

By hand:

```sh
npm i @lumiogames/sdk@2.10.1
```

| Entry | Use |
| :-- | :-- |
| `@lumiogames/sdk` | Production connection: `connectLumioFromLaunch()` |
| `@lumiogames/sdk/simulator` | Local simulator: `createLumioSimulator()` |
| `@lumiogames/sdk/adapters` | Small adapters for Cocos, Phaser, Godot and Unity |

The package needs Node 24.18 or later (below 25), only for development and builds. You upload the built static files; players' browsers never read `node_modules`.

## Features

### Available

| Feature | API | `lumio.json` capability |
| :-- | :-- | :-- |
| Sign-in state | `lumio.session` (`signedIn`, `capabilities`) | `identity.basic` |
| Player profile | `players.requestProfile()`, `players.get()`; nickname and avatar only after the player agrees | `identity.profile` |
| Cloud saves | `save.read()`, `save.write()`, with revisions; conflicts never overwrite the cloud copy | `save` |
| Game data | `data.read()`, `data.write()` | `data` |
| Leaderboards | `leaderboard.submit()`, `leaderboard.query()` | `leaderboard` |
| Achievements | `achievements.list()`, `achievements.unlock()` | `achievement` |
| Game-wide and room chat | `chat.send()`, `chat.history()`, `chat.onMessage()`; `global` is the current game's channel | `chat.game` |

### Not available yet

| Feature | Notes |
| :-- | :-- |
| Friends | Platform apps only; third-party calls return `platform.not_granted` |
| Direct messages | Same; declaring `chat.direct` in `lumio.json` does not grant it |
| Multiplayer | Room chat needs the player to actually be in a room; it cannot create multiplayer rooms |

The package contains other methods too. Having a method does not mean having permission; the tables above are what is available. Guests (players who are not signed in) cannot write cloud saves, leaderboards or social data.

## Connecting to the platform

When your game runs in Lumio's play page, connect with `connectLumioFromLaunch()`:

```ts
import { connectLumioFromLaunch } from '@lumiogames/sdk';

const lumio = await connectLumioFromLaunch();

if (!lumio.session.signedIn) {
  // Guest: cannot write cloud saves or leaderboards; ask the player to sign in
}

const profile = await lumio.players.requestProfile(); // the platform asks the player; on consent you get nickname and avatar
if (!profile.ok) console.warn(profile.failure.code);

// When the scene unloads, release the connection, listeners and uploads
lumio.dispose();
```

- There is no username/password sign-in API for games; the platform owns the sign-in and consent screens. Your game gets a `gp_…` player ID for your game and the profile the player agreed to share. It never gets the account ID, UID, email, cookies or match tickets.
- Check `lumio.session.capabilities` before calling: `available` works, `not_granted` is not permitted, `not_wired` is not connected.

### Cloud saves and conflicts

```ts
const saved = await lumio.save.read('progress');
if (!saved.ok) throw new Error(saved.failure.code);

const result = await lumio.save.write('progress', { level: 2 }, {
  expectedRevision: saved.value?.revision ?? null, // null for a new slot
});
if (!result.ok) throw new Error(result.failure.code);
if ('conflict' in result.value) {
  // The cloud has a newer save: keep the player's current progress, read again, let the player choose
  console.warn('Save conflict', result.value.conflict);
}
```

Pass the `expectedRevision` you actually read. A result with `ok: true` can still contain `value.conflict`; do not overwrite the cloud save automatically.

### Leaderboards

The leaderboard for field `bestScore` is named `stats.bestScore`. Scores submitted by the client have `verified: false`; only scores written by the platform's game server show as verified.

## Packaging and upload

Put `index.html`, `lumio.json` and the files the game needs at the root of the ZIP, with no extra project folder around them. Declare every capability, save slot and leaderboard field you use in `lumio.json`:

```json
{
  "entry": "index.html",
  "engine": false,
  "capabilities": ["identity.basic", "identity.profile", "save", "data", "leaderboard", "achievement", "chat.game"],
  "network": { "connect": [] },
  "data": {
    "fields": {
      "bestScore": {
        "type": "int",
        "min": 0,
        "max": 999999,
        "writer": "player",
        "visibility": "public",
        "leaderboard": { "order": "desc", "maxSubmitPerMinute": 6 }
      }
    },
    "slots": {
      "progress": { "maxBytes": 32768, "maxKeys": 128, "maxDepth": 6, "writer": "player", "visibility": "self" }
    }
  },
  "achievements": { "first_win": { "writer": "player" } }
}
```

- Plain H5 games use `engine: false`. `capabilities` lists capability names; `sdk` is not a version field.
- Leaderboard fields must have a value range and a per-minute submit limit.
- List external network origins as exact `https://` or `wss://` addresses, with no wildcards and no platform domains.

The entry HTML must reference the platform's handshake script, whether or not you use the SDK:

```html
<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <script src="./lumio-bootstrap.js"></script>
</head>
<body><main id="game"></main></body>
</html>
```

The platform puts `lumio-bootstrap.js` at the package root when the game goes live. Do not include the file in your ZIP, and do not let your bundler remove or inline the reference. If the entry is in a subfolder, use a relative path, for example `../lumio-bootstrap.js` for `nested/index.html`; never `/lumio-bootstrap.js`.

To upload:

1. Sign in to the [Developer Center](https://lumiogames.cn/studio/), apply as an author, create a game and fill in its details.
2. On the game's Versions page, choose the ZIP, enter the version number and release notes, and click Upload.
3. When the checks finish, select the draft version and click Submit for review.
4. See the review result and any requested changes in the version history. Submitting is not the same as going live; the live version shown in the Developer Center is what players get.

## Common errors

| What you see | Meaning | What to do |
| :-- | :-- | :-- |
| `failure.code` is `platform.not_granted` | No permission: the player has not agreed, is a guest, or the feature is not open to third parties | Ask the player to sign in or agree; do not call features that are not available yet |
| `failure.code` is `platform.not_wired` | The feature is not connected in this environment | Show a clear message; do not fake success |
| `save.write` returns `ok: true` with `value.conflict` | The cloud save is newer than the one you read | Keep current progress, read again, let the player choose |
| Upload fails with `package.bootstrap_missing` | The entry HTML does not reference `lumio-bootstrap.js` | Add the reference back as shown above |

## Known limits

- Simulator data lives in memory only and is gone after a page reload or a new simulator; every result carries `simulated: true`.
- The simulator does not fully enforce the platform's declaration, permission, quota and rate checks. Upload a real game package to verify before release. Do not turn on the `firstParty` option when building a third-party game.
- Friends, direct messages and multiplayer are not open to third parties yet; see the Features tables.

## Versions and updates

- The SDK is published only on npm. A published version never changes; fixes and new features come as new versions.
- Install with a full version number and upgrade when you choose; `npm outdated` shows whether a newer one exists. Add `--save-exact` to pin it in `package.json` too.
- Each version's changes are in the [changelog](CHANGELOG.md), and this repository tags each version with the same name (for example `v2.10.1`).

## Docs

| Doc | Contents |
| :-- | :-- |
| "Docs and Lumio SDK" on the [Developer Center](https://lumiogames.cn/studio/) | Full feature reference and the author API publishing flow |
| [Simulator example](examples/simulator-save-leaderboard/index.mjs) | Saves, conflicts, leaderboards, and what closed features return |
| [Changelog](CHANGELOG.md) · [Contributing](CONTRIBUTING.md) | |

## License

Lumio SDK is source-available under the [PolyForm Shield License 1.0.0](https://polyformproject.org/licenses/shield/1.0.0), with an Additional Permission and a Trademarks notice from LumioGames. The full text is in [LICENSE](LICENSE). In short:

| You may | You may not |
| :-- | :-- |
| Use Lumio SDK in games, apps and websites, including paid commercial products | Use Lumio SDK or a changed version to build a competing game SDK, game platform, game publishing or hosting service, or game development tool, paid or free |
| Star, fork, change and send pull requests; use it for learning, teaching and research | Republish it under another name or skin, or change it to connect to another platform |
| Say "uses Lumio SDK" or "published on Lumio" in your game | Use the Lumio or LumioGames names and logos as your own brand |

For any other use, contact us through the [Developer Center](https://lumiogames.cn/studio/) or the community groups above for a separate license. The English text in LICENSE is what counts.

<br>

<p align="center"><a href="https://lumiogames.cn/studio/"><img src=".github/readme/brand.en.svg" width="100%" alt="Lumio SDK is made by LumioGames · Lumio, games bring joy · Open the Developer Center"></a></p>
