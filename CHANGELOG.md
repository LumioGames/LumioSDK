# 更新记录 / Changelog

SDK 通过 npm 发布：`@lumiogames/sdk`。发布后的版本不再改动。
Published on npm as `@lumiogames/sdk`. Published versions never change.

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
