# 更新记录 / Changelog

SDK 通过 npm 发布：`@lumiogames/sdk`。发布后的版本不再改动。
Published on npm as `@lumiogames/sdk`. Published versions never change.

## 2.11.2（2026-11-04）

- 支持 Node 26：包的 `engines.node` 从 `>=24.18.0 <25` 放宽为 `>=24.18.0 <27`。代码和 2.11.1 相同。Node 只在开发和构建时用到。

- Node 26 support: the package's `engines.node` is widened from `>=24.18.0 <25` to `>=24.18.0 <27`. The code is the same as 2.11.1. Node is only used for development and builds.

## 2.11.1（2026-11-03）

- 修复：iPhone Safari 和微信内置浏览器里，游戏连不上平台、返回 `platform.not_granted`。原因是这些浏览器给游戏页的 `document.referrer` 为空；现在 referrer 为空时改用浏览器提供的 `location.ancestorOrigins` 识别平台，仍要命中平台来源白名单，referrer 不为空时不受影响。
- 包含 2.11.0 的改动（2.11.0 没有发布到 npm）：
  - SDK 连上后自动显示加载页下载进度（按页面已下载字节和包大小计算），并把页面报错的类别上报给平台，不带报错文字和堆栈。游戏自己调用 `lumio.loading.progress()` 或 `ready()` 后自动计数停止。
  - 连接时传 `loading: 'manual'`（如 `connectLumioFromLaunch({ loading: 'manual' })`），加载页会一直显示到游戏调用 `lumio.loading.ready()`。
  - 入口 HTML 不再需要引用 `lumio-bootstrap.js`。

- Fix: on iPhone Safari and the WeChat in-app browser, games could not connect and got `platform.not_granted`, because these browsers give the game page an empty `document.referrer`. When the referrer is empty, the SDK now identifies the platform from the browser's `location.ancestorOrigins`; it must still match the platform origin allow-list, and a non-empty referrer is used as before.
- Includes the changes from 2.11.0 (2.11.0 was not published to npm):
  - Once connected, the SDK shows loading-screen download progress (bytes the page has downloaded against the package size) and reports the kind of page errors to the platform, without error text or stack traces. The automatic count stops once the game calls `lumio.loading.progress()` or `ready()`.
  - Connect with `loading: 'manual'` (for example `connectLumioFromLaunch({ loading: 'manual' })`) to keep the loading screen up until the game calls `lumio.loading.ready()`.
  - The entry HTML no longer needs to reference `lumio-bootstrap.js`.

## 2.10.1（2026-10-30）

首个对第三方游戏推荐的版本。

- 开放：登录状态、玩家资料（需玩家授权）、云存档、游戏数据、排行榜、成就、当前游戏公屏和房间聊天。
- 暂不开放：好友、私信、联机。包里保留这些方法，第三方调用返回 `platform.not_granted`。
- 正式平台用 `connectLumioFromLaunch()` 连接，不需要在上传前写死版本号；本地用 `@lumiogames/sdk/simulator` 的模拟器。
- 相对 2.10.0 的改动：`ai.chat` 的请求超时定为 70 秒，其他请求仍为 15 秒。

The first version recommended for third-party games.

- Available: sign-in state, player profile (with player consent), cloud saves, game data, leaderboards, achievements, game-wide chat and room chat.
- Not available yet: friends, direct messages, multiplayer. The methods stay in the package; third-party calls return `platform.not_granted`.
- Connect on the platform with `connectLumioFromLaunch()`, with no version ID hard-coded before upload; use the simulator from `@lumiogames/sdk/simulator` locally.
- Change from 2.10.0: `ai.chat` requests time out after 70 seconds; other requests still use 15 seconds.
