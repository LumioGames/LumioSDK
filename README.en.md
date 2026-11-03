<div align="center">

# Lumio SDK

**Connect your H5 game to the [Lumio](https://lumiogames.cn/) platform: sign-in, player profiles, cloud saves, leaderboards, achievements and chat.**

**[Developer Center](https://lumiogames.cn/studio/)** &nbsp;·&nbsp; **[QQ group 972220164](https://qm.qq.com/q/PGkXh4tCyQ)** &nbsp;·&nbsp; **[Blank template lumio-game-starter](https://github.com/LumioGames/lumio-game-starter)** &nbsp;·&nbsp; [简体中文](README.md) &nbsp;·&nbsp; English

[![npm](https://img.shields.io/npm/v/@lumiogames/sdk?style=flat-square&color=6659DB&labelColor=171C34)](https://www.npmjs.com/package/@lumiogames/sdk)
[![node](https://img.shields.io/badge/node-24.18%2B-5DE2C6?style=flat-square&labelColor=171C34)](https://nodejs.org/)
[![types](https://img.shields.io/badge/types-included-9AA6FF?style=flat-square&labelColor=171C34)](#install)
[![license](https://img.shields.io/badge/license-TBD-AEB5D6?style=flat-square&labelColor=171C34)](#license)

</div>

---

## What this is

`@lumiogames/sdk` is the SDK for third-party games on the Lumio platform. Your game runs inside the platform's play page and talks to the platform through the SDK. The platform handles sign-in; your game only gets a player ID for your game and the profile data the player agrees to share. Saves, leaderboards and achievements are stored by the platform.

The SDK is published on npm with TypeScript declarations and a local simulator, and does not depend on platform or engine source. This repository holds the guide, runnable examples, the changelog and the issue tracker. The SDK source is not here.

## Available features

The first release opens the features in the first table to third-party games.

| Available | API | `lumio.json` capability |
| :-- | :-- | :-- |
| Sign-in state | `lumio.session` (`signedIn`, `capabilities`) | `identity.basic` |
| Player profile (player must agree) | `players.requestProfile()`, `players.get()` | `identity.profile` |
| Cloud saves | `save.read()`, `save.write()` | `save` |
| Game data | `data.read()`, `data.write()` | `data` |
| Leaderboards | `leaderboard.submit()`, `leaderboard.query()` | `leaderboard` |
| Achievements | `achievements.list()`, `achievements.unlock()` | `achievement` |
| Game-wide chat and room chat | `chat.send()`, `chat.history()`, `chat.onMessage()` | `chat.game` |

| Not available yet | Notes |
| :-- | :-- |
| Friends | Platform apps only; third-party calls return `platform.not_granted` |
| Direct messages | Same; declaring `chat.direct` in `lumio.json` does not grant it |
| Multiplayer | Room chat needs the player to actually be in a room; it cannot create multiplayer rooms |

The package contains other methods too. Having a method does not mean having permission; the tables above are what is available. Guests (players who are not signed in) cannot write cloud saves, leaderboards or social data.

## Install

```sh
npm i --save-exact @lumiogames/sdk@2.10.1
```

The package needs Node 24.18 or later (below 25). Build your game into static files with a bundler (Vite, esbuild, webpack and so on) before uploading; players' browsers never read `node_modules`.

| Entry | Use |
| :-- | :-- |
| `@lumiogames/sdk` | Production connection: `connectLumioFromLaunch()` |
| `@lumiogames/sdk/simulator` | Local simulator: `createLumioSimulator()` |
| `@lumiogames/sdk/adapters` | Small adapters for Cocos, Phaser, Godot and Unity |

## 30-second start: local simulator

The simulator needs no platform sign-in and no network. Use it to get save and leaderboard logic working first.

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

The code is in [examples/simulator-save-leaderboard/index.mjs](examples/simulator-save-leaderboard/index.mjs). The core of it:

```js
import { createLumioSimulator } from '@lumiogames/sdk/simulator';

const lumio = await createLumioSimulator({ gameKey: 'g-abcdefghij', versionId: 'local' });
try {
  const saved = await lumio.save.read('progress');
  if (!saved.ok) throw new Error(saved.failure.code);
  const written = await lumio.save.write('progress', { level: 2 }, {
    expectedRevision: saved.value?.revision ?? null,
  });
  if (!written.ok) throw new Error(written.failure.code);
  if ('conflict' in written.value) throw new Error('Save conflict');

  const submitted = await lumio.leaderboard.submit('stats.bestScore', 100);
  if (!submitted.ok) throw new Error(submitted.failure.code);
  const top = await lumio.leaderboard.query('stats.bestScore', { kind: 'top', limit: 10 });
  if (!top.ok) throw new Error(top.failure.code);
} finally {
  lumio.dispose();
}
```

About the simulator:

- Every result carries `simulated: true`. Data lives in memory only and is gone after a page reload or a new simulator.
- The simulator does not fully enforce the platform's declaration, permission, quota and rate checks. Upload a real game package to verify before release.
- Do not turn on the `firstParty` option when building a third-party game.

## Connecting to the platform

When your game runs in the platform's play page, connect with `connectLumioFromLaunch()`. It reads the current game and version from the launch URL, so you do not hard-code a version ID before uploading.

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

- If the connection fails, show the error. Do not fall back to the simulator.
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

## `lumio.json` and uploading

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

To skip project setup, start from the [blank template lumio-game-starter](https://github.com/LumioGames/lumio-game-starter).

## Common errors

| What you see | Meaning | What to do |
| :-- | :-- | :-- |
| `failure.code` is `platform.not_granted` | No permission: the player has not agreed, is a guest, or the feature is not open to third parties | Ask the player to sign in or agree; do not call features that are not available yet |
| `failure.code` is `platform.not_wired` | The feature is not connected in this environment | Show a clear message; do not fake success |
| `save.write` returns `ok: true` with `value.conflict` | The cloud save is newer than the one you read | Keep current progress, read again, let the player choose |
| Upload fails with `package.bootstrap_missing` | The entry HTML does not reference `lumio-bootstrap.js` | Add the reference back as shown above |

## Versions and updates

- The SDK is published only on npm. A published version never changes; fixes and new features come as new versions.
- Install an exact version (`--save-exact`) and upgrade when you choose; `npm outdated` shows whether a newer one exists.
- Each version's changes are in [CHANGELOG.md](CHANGELOG.md), and this repository tags each version with the same name (for example `v2.10.1`).

## Feedback

- Bugs and integration questions: open an [issue](https://github.com/LumioGames/LumioSDK/issues/new/choose) in this repository.
- Chat: [QQ group 972220164](https://qm.qq.com/q/PGkXh4tCyQ).
- Full documentation: "Docs and Lumio SDK" on the [Developer Center](https://lumiogames.cn/studio/) home page.

## License

The license is not decided yet. Until it is, do not redistribute the contents of this repository. See [LICENSE](LICENSE).
