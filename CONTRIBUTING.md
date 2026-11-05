# 参与贡献

## 仓库里有什么

- `README.md`、`README.en.md`：使用说明（中文、英文）。两份内容要一致，改一份同时改另一份。
- `examples/`：可直接运行的示例，依赖 npm 上已发布的 `@lumiogames/sdk`。
- `CHANGELOG.md`：每个 SDK 版本的变化。
- `scripts/readme-art/`：生成 README 用的图片，输出到 `.github/readme/`。图片不手改，改脚本后运行 `node scripts/readme-art/build.mjs`。

SDK 源码不在这个仓库。SDK 本身的问题请提 Issue，修复会随新版本发到 npm。

## 文档和示例

1. 用 Node 24.18 或更高、低于 27 的版本（Node 24 或 Node 26）。
2. 改了示例，在示例目录里运行 `npm install` 和 `npm start`，确认输出和 README 里贴的一致。
3. 一个改动一个 PR。PR 里写做了什么、跑了哪些命令和关键输出；没跑的写「未执行」。
4. 文档只写已经上线的能力，不写计划中的功能。

## SDK 发新版本时

每个版本在这里只需要一次提交：

1. `CHANGELOG.md` 加一节新版本。
2. 两份 README 里的安装命令换成新版本号。
3. 在 `examples/simulator-save-leaderboard` 里运行 `npm i --save-exact @lumiogames/sdk@<新版本>`，再运行 `npm start`；输出有变化就同步到 README。
4. 提交后打同名 tag（如 `v2.11.1`）并推送。
