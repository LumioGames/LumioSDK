<div align="center">

# Lumio SDK

**把 H5 游戏接入 [Lumio](https://lumiogames.cn/) 平台：登录、玩家资料、云存档、排行榜、成就、聊天。**

**[开发者中心](https://lumiogames.cn/studio/)** &nbsp;·&nbsp; **[QQ 群 972220164](https://qm.qq.com/q/PGkXh4tCyQ)** &nbsp;·&nbsp; **[空白模板 lumio-game-starter](https://github.com/LumioGames/lumio-game-starter)** &nbsp;·&nbsp; 简体中文 &nbsp;·&nbsp; [English](README.en.md)

[![npm](https://img.shields.io/npm/v/@lumiogames/sdk?style=flat-square&color=6659DB&labelColor=171C34)](https://www.npmjs.com/package/@lumiogames/sdk)
[![node](https://img.shields.io/badge/node-24.18%2B-5DE2C6?style=flat-square&labelColor=171C34)](https://nodejs.org/)
[![types](https://img.shields.io/badge/types-included-9AA6FF?style=flat-square&labelColor=171C34)](#安装)
[![license](https://img.shields.io/badge/license-待定-AEB5D6?style=flat-square&labelColor=171C34)](#许可)

</div>

---

## 这是什么

`@lumiogames/sdk` 是 Lumio 平台给第三方游戏用的 SDK。游戏跑在平台的游玩页里，SDK 通过它和平台通信：玩家登录由平台负责，游戏只拿到本游戏的玩家号和玩家同意给的资料；存档、排行榜、成就等数据存在平台上。

SDK 通过 npm 发布，自带 TypeScript 类型声明和本地模拟器，不依赖平台或引擎源码。本仓库放的是使用说明、可运行的示例、更新记录和问题反馈入口；SDK 源码不在这里。

## 开放能力

首版对第三方游戏开放下表左侧的能力。

| 开放 | 接口 | `lumio.json` 声明 |
| :-- | :-- | :-- |
| 登录状态 | `lumio.session`（`signedIn`、`capabilities`） | `identity.basic` |
| 玩家资料（需玩家授权） | `players.requestProfile()`、`players.get()` | `identity.profile` |
| 云存档 | `save.read()`、`save.write()` | `save` |
| 游戏数据 | `data.read()`、`data.write()` | `data` |
| 排行榜 | `leaderboard.submit()`、`leaderboard.query()` | `leaderboard` |
| 成就 | `achievements.list()`、`achievements.unlock()` | `achievement` |
| 当前游戏公屏、房间聊天 | `chat.send()`、`chat.history()`、`chat.onMessage()` | `chat.game` |

| 暂不开放 | 说明 |
| :-- | :-- |
| 好友 | 只给平台自己的应用用，第三方调用返回 `platform.not_granted` |
| 私信 | 同上；在 `lumio.json` 里声明 `chat.direct` 也不会获得权限 |
| 联机 | 房间聊天要求玩家真的在房间里，不能用来创建联机房间 |

发行包里还有其他方法，有方法不代表有权限，以上表为准。游客（未登录玩家）不能写云存档、排行榜和社交数据。

## 安装

```sh
npm i --save-exact @lumiogames/sdk@2.10.1
```

包要求 Node 24.18 或更高（低于 25）。游戏用打包工具（Vite、esbuild、webpack 等）构建成静态文件再上传，玩家浏览器不会读取 `node_modules`。

| 入口 | 用途 |
| :-- | :-- |
| `@lumiogames/sdk` | 正式平台连接：`connectLumioFromLaunch()` |
| `@lumiogames/sdk/simulator` | 本地模拟器：`createLumioSimulator()` |
| `@lumiogames/sdk/adapters` | Cocos、Phaser、Godot、Unity 的轻量适配 |

## 30 秒上手：本地模拟器

模拟器不需要登录平台，也不联网，适合先把存档和排行榜逻辑写通。

```sh
git clone https://github.com/LumioGames/LumioSDK.git
cd LumioSDK/examples/simulator-save-leaderboard
npm install
npm start
```

输出（玩家号每次随机）：

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

代码见 [examples/simulator-save-leaderboard/index.mjs](examples/simulator-save-leaderboard/index.mjs)，核心几行：

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

模拟器的注意事项：

- 所有结果都带 `simulated: true`，数据只在内存里，刷新页面或重建模拟器就清空。
- 模拟器不会完整执行线上的声明、权限、配额和频率检查，上线前要上传真实游戏包验证。
- 开发第三方游戏时不要打开 `firstParty` 选项。

## 接入正式平台

游戏在平台游玩页里运行时，用 `connectLumioFromLaunch()` 连接。它从启动地址读取当前游戏和版本，上传前不需要写死版本号。

```ts
import { connectLumioFromLaunch } from '@lumiogames/sdk';

const lumio = await connectLumioFromLaunch();

if (!lumio.session.signedIn) {
  // 游客：不能写云存档和排行榜，提示玩家登录
}

const profile = await lumio.players.requestProfile(); // 平台弹出授权，玩家同意后返回昵称和头像
if (!profile.ok) console.warn(profile.failure.code);

// 场景卸载时释放连接、订阅和上传
lumio.dispose();
```

- 连接失败时要显示错误，不要自动换成模拟器。
- 游戏没有账号密码登录接口，登录和授权界面由平台负责。游戏只拿到本游戏的 `gp_…` 玩家号和玩家同意给的资料，拿不到账号、UID、邮箱、Cookie 或入局票据。
- 调用前可以看 `lumio.session.capabilities`：`available` 可用，`not_granted` 未授权，`not_wired` 未接通。

### 云存档和冲突

```ts
const saved = await lumio.save.read('progress');
if (!saved.ok) throw new Error(saved.failure.code);

const result = await lumio.save.write('progress', { level: 2 }, {
  expectedRevision: saved.value?.revision ?? null, // 新槽用 null
});
if (!result.ok) throw new Error(result.failure.code);
if ('conflict' in result.value) {
  // 云端已有更新的存档：保留玩家当前进度，重新读取，让玩家选择用哪份
  console.warn('Save conflict', result.value.conflict);
}
```

写存档要带上实际读到的 `expectedRevision`。`ok: true` 时也可能返回 `value.conflict`，这时不要自动覆盖云端。

### 排行榜

字段 `bestScore` 对应的排行榜名称是 `stats.bestScore`。客户端提交的分数 `verified` 为 `false`，只有平台服务端写入的成绩才显示「已验证」。

## `lumio.json` 和打包上传

ZIP 根目录放 `index.html`、`lumio.json` 和运行需要的文件，不要再套一层项目文件夹。用到的能力、存档槽、上榜字段都要在 `lumio.json` 里声明：

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

- 普通 H5 游戏写 `engine: false`。`capabilities` 填能力名称；`sdk` 不是版本号字段。
- 上榜字段必须写数值范围和每分钟提交次数。
- 外部网络请求只列精确的 `https://` 或 `wss://` 地址，不写通配符或平台域名。

入口 HTML 必须引用平台握手脚本，接不接 SDK 都要：

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

`lumio-bootstrap.js` 由平台在上线时放进包根目录，ZIP 里不要放这个文件，构建时也不要让打包工具删掉或合并这行引用。入口在子目录时按层级写相对路径，例如 `nested/index.html` 写 `../lumio-bootstrap.js`；不要写成 `/lumio-bootstrap.js`。

上传步骤：

1. 登录[开发者中心](https://lumiogames.cn/studio/)，完成作者申请，创建作品并填写资料。
2. 在作品的「版本」页选择 ZIP，填写版本号和更新说明，点「上传版本」。
3. 检查完成后选中草稿版本，点「提交审核」。
4. 在版本记录里看审核结果和整改提示。提交成功不等于上线，以开发者中心显示的线上版本为准。

不想从零搭工程，可以直接用[空白模板 lumio-game-starter](https://github.com/LumioGames/lumio-game-starter)。

## 常见错误

| 情况 | 含义 | 怎么办 |
| :-- | :-- | :-- |
| `failure.code` 为 `platform.not_granted` | 没有权限：玩家没授权、游客，或这个能力不对第三方开放 | 提示玩家登录或授权；暂不开放的能力不要调用 |
| `failure.code` 为 `platform.not_wired` | 当前环境没有接通这个能力 | 显示明确提示，不要伪造成功 |
| `save.write` 返回 `ok: true` 但有 `value.conflict` | 云端存档比你读到的新 | 保留当前进度，重新读取，让玩家选择 |
| 上传时报 `package.bootstrap_missing` | 入口 HTML 没有引用 `lumio-bootstrap.js` | 按上面的写法加回引用 |

## 版本和更新

- SDK 只通过 npm 发布。每个版本发布后内容不再改动，修复和新功能都会出新版本。
- 安装时写完整版本号（`--save-exact`），升级由你决定：`npm outdated` 能看到有没有新版本。
- 每个版本的变化写在 [CHANGELOG.md](CHANGELOG.md)，本仓库会为每个版本打一个同名 tag（如 `v2.10.1`）。

## 反馈

- Bug 和接入问题：在本仓库提 [Issue](https://github.com/LumioGames/LumioSDK/issues/new/choose)。
- 交流：[QQ 群 972220164](https://qm.qq.com/q/PGkXh4tCyQ)。
- 完整文档：[开发者中心](https://lumiogames.cn/studio/)首页「文档与 Lumio SDK」。

## 许可

许可协议待定，确定前请勿再分发本仓库内容。见 [LICENSE](LICENSE)。
