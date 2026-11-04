// 生成 README 用的图片，输出到 .github/readme/（中英文各一套）。图片都由这个脚本生成，不手改。
// 用法：node scripts/readme-art/build.mjs
//
// 样式与 LumioGames/LGUI 的 scripts/readme-art 一致。src/ 里是两个群的二维码（来自 LumioGames/.github 的 profile/assets）。
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../..');
const src = path.join(here, 'src');
const out = path.join(root, '.github/readme');
fs.mkdirSync(out, {recursive: true});

// Lumio brand colors (LumioPlatformNext apps/shared/styles/tokens.css): primary #6659db, mint #5de2c6, amber #ffb86b, rose #ff7ea6, stage #171c34.
const C = {
  ink: '#12152B', ink2: '#1D2148', panel: '#171C34', slot: '#232A52',
  text: '#F6F7FD', muted: '#AEB5D6', dim: '#7480A8',
  teal: '#5DE2C6', amber: '#FFB86B', coral: '#FF7EA6', violet: '#9AA6FF', blue: '#8C98FF',
  primary: '#6659DB', primary2: '#9AA6FF',
};
const SANS = `-apple-system,BlinkMacSystemFont,'Segoe UI','PingFang SC','Microsoft YaHei','Noto Sans CJK SC',system-ui,sans-serif`;
const MONO = `'SF Mono',Menlo,Consolas,'Liberation Mono',monospace`;
// Official mark (apps/shared/public/lumio/brand/lumio-mark.svg), drawn at x,y with size s.
function lumioMark(x, y, s, id) {
  const k = s / 100;
  return `<g transform="translate(${x} ${y}) scale(${k})">
  <defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#6659db"/><stop offset="1" stop-color="#9aa6ff"/></linearGradient></defs>
  <rect width="100" height="100" rx="29" fill="url(#${id})"/><rect x="25" y="22" width="16" height="16" rx="4" fill="#fff"/><rect x="25" y="42" width="16" height="16" rx="4" fill="#fff"/><rect x="25" y="62" width="16" height="16" rx="4" fill="#fff"/><rect x="45" y="62" width="16" height="16" rx="4" fill="#fff" fill-opacity=".6"/><rect x="65" y="62" width="16" height="16" rx="4" fill="#5de2c6"/><path d="M70 19C71.56 28.1 73.9 30.44 83 32C73.9 33.56 71.56 35.9 70 45C68.44 35.9 66.1 33.56 57 32C66.1 30.44 68.44 28.1 70 19Z" fill="#fff"/></g>`;
}
// "Lumio / GAMES" lockup as on the site header.
function lockup(x, y, s, id) {
  return `${lumioMark(x, y, s, id)}
  <text x="${x + s * 1.27}" y="${y + s * .56}" font-family="${SANS}" font-size="${s * .52}" font-weight="800" fill="${C.text}">Lumio</text>
  <text x="${x + s * 1.29}" y="${y + s * .86}" font-family="${SANS}" font-size="${s * .23}" font-weight="700" letter-spacing="${s * .23 * .25}" fill="${C.text}">GAMES</text>`;
}
const write = (name, svg) => fs.writeFileSync(path.join(out, name), svg.trim() + '\n');

function sparkle(x, y, s, color, op = 1) {
  return `<path d="M${x} ${y - s}C${x + s * .12} ${y - s * .12} ${x + s * .12} ${y - s * .12} ${x + s} ${y}C${x + s * .12} ${y + s * .12} ${x + s * .12} ${y + s * .12} ${x} ${y + s}C${x - s * .12} ${y + s * .12} ${x - s * .12} ${y + s * .12} ${x - s} ${y}C${x - s * .12} ${y - s * .12} ${x - s * .12} ${y - s * .12} ${x} ${y - s}Z" fill="${color}" opacity="${op}"/>`;
}
function chip(x, y, w, label, dashed = false) {
  return `<rect x="${x}" y="${y}" width="${w}" height="34" rx="10" fill="#fff" fill-opacity="${dashed ? 0 : .06}" stroke="${dashed ? C.teal : '#fff'}" stroke-opacity="${dashed ? .8 : .14}" ${dashed ? 'stroke-dasharray="5 4"' : ''}/>` +
    `<text x="${x + w / 2}" y="${y + 22.5}" text-anchor="middle" font-family="${SANS}" font-size="15" font-weight="600" fill="${dashed ? C.teal : '#D5DAEE'}">${label}</text>`;
}

// ---------- hero ----------
// Right side: a code window (install + calls) with a leaderboard card and a save toast on top.
function leaderboardCard(t) {
  const rows = [[1, 'gp_7Qe…', 1280, C.amber], [2, t.you, 1000, C.teal], [3, 'gp_Zjl…', 860, C.violet]];
  return `<g filter="url(#shadow)">
    <rect x="0" y="0" width="250" height="196" rx="16" fill="${C.panel}" stroke="#fff" stroke-opacity=".16" stroke-width="1.5"/>
    <text x="20" y="34" font-family="${SANS}" font-size="16" font-weight="800" fill="${C.text}">${t.board}</text>
    <text x="230" y="34" text-anchor="end" font-family="${MONO}" font-size="11" fill="${C.dim}">stats.bestScore</text>
    ${rows.map(([rank, name, score, color], i) => {
      const y = 54 + i * 44;
      const self = name === t.you;
      return `<rect x="14" y="${y}" width="222" height="36" rx="10" fill="${self ? C.teal : '#fff'}" fill-opacity="${self ? .14 : .05}" ${self ? `stroke="${C.teal}" stroke-opacity=".6"` : ''}/>
    <circle cx="36" cy="${y + 18}" r="11" fill="${color}"/>
    <text x="36" y="${y + 23}" text-anchor="middle" font-family="${SANS}" font-size="13" font-weight="800" fill="${C.ink}">${rank}</text>
    <text x="58" y="${y + 23}" font-family="${self ? SANS : MONO}" font-size="14" font-weight="${self ? 800 : 500}" fill="${self ? C.teal : C.muted}">${name}</text>
    <text x="222" y="${y + 23}" text-anchor="end" font-family="${MONO}" font-size="14" font-weight="700" fill="${C.text}">${score}</text>`;
    }).join('')}
  </g>`;
}
function saveToast(t) {
  return `<g filter="url(#shadow)">
    <rect x="0" y="0" width="236" height="58" rx="14" fill="#0A0F1E" fill-opacity=".94" stroke="${C.teal}" stroke-opacity=".5"/>
    <circle cx="29" cy="29" r="13" fill="${C.teal}"/>
    <path d="M23 29.5L27.5 34L35.5 25" fill="none" stroke="${C.ink}" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>
    <text x="52" y="25" font-family="${SANS}" font-size="15" font-weight="800" fill="${C.text}">${t.saved}</text>
    <text x="52" y="44" font-family="${MONO}" font-size="12" fill="${C.dim}">progress · revision 2</text>
  </g>`;
}
function codeWindow(t) {
  const k = (s) => `<tspan fill="${C.violet}">${s}</tspan>`;
  const f = (s) => `<tspan fill="${C.teal}">${s}</tspan>`;
  const s = (v) => `<tspan fill="${C.amber}">${v}</tspan>`;
  return `<g filter="url(#shadow)">
    <rect x="0" y="0" width="600" height="262" rx="16" fill="#0A0F1E" fill-opacity=".94" stroke="#fff" stroke-opacity=".14"/>
    <circle cx="22" cy="20" r="4.5" fill="${C.coral}"/><circle cx="38" cy="20" r="4.5" fill="${C.amber}"/><circle cx="54" cy="20" r="4.5" fill="${C.teal}"/>
    <text x="580" y="25" text-anchor="end" font-family="${MONO}" font-size="12" fill="${C.dim}">game.ts</text>
    <path d="M0 38H600" stroke="#fff" stroke-opacity=".08"/>
    <text font-family="${MONO}" font-size="15" fill="${C.text}">
      <tspan x="24" y="70" fill="${C.dim}">$ npm i @lumiogames/sdk</tspan>
      <tspan x="24" y="108">${k('import')} { ${f('connectLumioFromLaunch')} } ${k('from')} ${s("'@lumiogames/sdk'")};</tspan>
      <tspan x="24" y="144">${k('const')} lumio = ${k('await')} ${f('connectLumioFromLaunch')}();</tspan>
      <tspan x="24" y="174">${k('await')} lumio.save.${f('write')}(${s("'progress'")}, { level: ${s('2')} }, …);</tspan>
      <tspan x="24" y="204">${k('await')} lumio.leaderboard.${f('submit')}(${s("'stats.bestScore'")}, ${s('1000')});</tspan>
      <tspan x="24" y="238" font-size="13" fill="${C.dim}">${t.code}</tspan>
    </text>
  </g>`;
}
function hero(t) {
  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 560" width="1280" height="560" role="img" aria-label="${t.aria}">
<defs>
  <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${C.ink}"/><stop offset="1" stop-color="${C.ink2}"/></linearGradient>
  <radialGradient id="gTeal" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="${C.primary}" stop-opacity=".55"/><stop offset="1" stop-color="${C.primary}" stop-opacity="0"/></radialGradient>
  <radialGradient id="gAmber" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="${C.amber}" stop-opacity=".20"/><stop offset="1" stop-color="${C.amber}" stop-opacity="0"/></radialGradient>
  <radialGradient id="gViolet" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="${C.teal}" stop-opacity=".14"/><stop offset="1" stop-color="${C.teal}" stop-opacity="0"/></radialGradient>
  <pattern id="dots" width="24" height="24" patternUnits="userSpaceOnUse"><circle cx="12" cy="12" r="1.1" fill="#8CA0FF" fill-opacity=".16"/></pattern>
  <clipPath id="round"><rect width="1280" height="560" rx="28"/></clipPath>
  <filter id="shadow" x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx="0" dy="18" stdDeviation="18" flood-color="#000" flood-opacity=".45"/></filter>
</defs>
<g clip-path="url(#round)">
  <rect width="1280" height="560" fill="url(#bg)"/>
  <rect width="1280" height="560" fill="url(#dots)"/>
  <circle cx="980" cy="150" r="380" fill="url(#gTeal)"/>
  <circle cx="1220" cy="560" r="320" fill="url(#gAmber)"/>
  <circle cx="120" cy="620" r="360" fill="url(#gViolet)"/>

  <!-- left: LumioGames presents -->
  ${lockup(64, 40, 60, 'heroMark')}
  <path d="M250 46V94" stroke="#fff" stroke-opacity=".25" stroke-width="1.5"/>
  <text font-family="${SANS}">
    <tspan x="270" y="66" font-size="19" font-weight="800" fill="${C.text}">${t.presents}</tspan>
    <tspan x="270" y="90" font-size="15" font-weight="500" fill="${C.muted}">${t.presents2}</tspan>
  </text>

  <text x="60" y="232" font-family="${SANS}" font-size="104" font-weight="800" letter-spacing="-2" fill="${C.text}">SDK<tspan fill="${C.teal}">.</tspan></text>

  <text font-family="${SANS}" font-size="${t.hSize ?? 40}" font-weight="800" fill="${C.text}">
    <tspan x="64" y="326">${t.h1}</tspan>
    <tspan x="64" y="380">${t.h2}</tspan>
  </text>
  <text font-family="${SANS}" font-size="19" fill="${C.muted}">
    <tspan x="64" y="428">${t.s1}</tspan>
    <tspan x="64" y="457">${t.s2}</tspan>
  </text>
  ${t.chips.map(([x, w, l, d]) => chip(x, 488, w, l, d)).join('')}

  <!-- right: code window, leaderboard card, save toast -->
  <g transform="translate(620 112)">${codeWindow(t)}</g>
  <g transform="translate(1004 334)">${leaderboardCard(t)}</g>
  <g transform="translate(596 420)">${saveToast(t)}</g>
  ${sparkle(1200, 92, 10, C.amber, .9)}${sparkle(1230, 124, 5, C.teal, .8)}${sparkle(610, 108, 6, C.teal, .7)}${sparkle(950, 510, 4, C.violet, .9)}
</g>
<rect x=".75" y=".75" width="1278.5" height="558.5" rx="27.5" fill="none" stroke="#fff" stroke-opacity=".08" stroke-width="1.5"/>
</svg>`;
}

// ---------- QR cards ----------
function qrPath(file) {
  const svg = fs.readFileSync(path.join(src, file), 'utf8');
  return svg.match(/<path d="(M30\.000 30\.000[^"]+)"/)[1];
}
function qrCard({title, sub, accent, qr, aria, btn}) {
  const L = 22; // corner bracket length
  const corners = [[30 - 8, 64 - 8, 1, 1], [250 + 8, 64 - 8, -1, 1], [30 - 8, 284 + 8, 1, -1], [250 + 8, 284 + 8, -1, -1]]
    .map(([x, y, dx, dy]) => `<path d="M${x} ${y + dy * L}V${y}H${x + dx * L}" fill="none" stroke="${accent}" stroke-width="3" stroke-linecap="round"/>`).join('');
  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="-12 0 304 412" width="304" height="412" role="img" aria-label="${aria}">
<defs><linearGradient id="b" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${btn.fill[0]}"/><stop offset="1" stop-color="${btn.fill[1]}"/></linearGradient></defs>
<rect x="1" y="1" width="278" height="410" rx="24" fill="${C.panel}" stroke="${accent}" stroke-opacity=".4" stroke-width="2"/>
<circle cx="34" cy="33" r="5" fill="${accent}"/>
<text x="48" y="39" font-family="${SANS}" font-size="18" font-weight="800" fill="${C.text}">${title}</text>
${corners}
<rect x="30" y="64" width="220" height="220" rx="12" fill="#fff"/>
<path transform="translate(10 44)" d="${qr}" fill="${C.ink}"/>
<text x="140" y="318" text-anchor="middle" font-family="${SANS}" font-size="15" font-weight="600" fill="${C.muted}">${sub}</text>
<rect x="22" y="340" width="236" height="50" rx="14" fill="url(#b)"/>
<rect x="23" y="341" width="234" height="24" rx="13" fill="#fff" opacity=".12"/>
<text x="${btn.cx ?? 130}" y="371.5" text-anchor="middle" font-family="${SANS}" font-size="18" font-weight="800" fill="${btn.ink}">${btn.label}</text>
<g transform="translate(${btn.arrowX ?? 192} 359)" fill="none" stroke="${btn.ink}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12L12 2M5 2H12V9"/></g>
</svg>`;
}

// ---------- LumioGames brand card ----------
function brandCard(t) {
  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 260" width="1280" height="260" role="img" aria-label="${t.aria}">
<defs>
  <linearGradient id="bbg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#5546C4"/><stop offset=".55" stop-color="#6659DB"/><stop offset="1" stop-color="#8A93F5"/></linearGradient>
  <radialGradient id="bglow" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#5DE2C6" stop-opacity=".35"/><stop offset="1" stop-color="#5DE2C6" stop-opacity="0"/></radialGradient>
  <pattern id="bdots" width="22" height="22" patternUnits="userSpaceOnUse"><circle cx="11" cy="11" r="1.1" fill="#fff" fill-opacity=".14"/></pattern>
  <clipPath id="bclip"><rect width="1280" height="260" rx="28"/></clipPath>
</defs>
<g clip-path="url(#bclip)">
  <rect width="1280" height="260" fill="url(#bbg)"/>
  <rect width="1280" height="260" fill="url(#bdots)"/>
  <circle cx="1180" cy="40" r="260" fill="url(#bglow)"/>
  ${[[90, 58, 22], [1000, 210, 14], [1230, 150, 9], [560, 40, 8]].map(([x, y, r]) => sparkle(x, y, r, '#fff', .5)).join('')}
  <rect x="64" y="56" width="148" height="148" rx="40" fill="#fff" fill-opacity=".14"/>
  ${lumioMark(78, 70, 120, 'brandMark')}
  <text x="252" y="128" font-family="${SANS}" font-size="64" font-weight="800" fill="#fff">Lumio</text>
  <text x="256" y="168" font-family="${SANS}" font-size="22" font-weight="800" letter-spacing="9" fill="#fff">GAMES</text>
  <path d="M488 70V190" stroke="#fff" stroke-opacity=".3" stroke-width="2"/>
  <text font-family="${SANS}" fill="#fff">
    <tspan x="528" y="112" font-size="30" font-weight="800">${t.l1}</tspan>
    <tspan x="528" y="152" font-size="19" fill-opacity=".85">${t.l2}</tspan>
  </text>
  <g transform="translate(528 172)">
    <rect width="${t.ctaW}" height="44" rx="22" fill="#fff"/>
    <text x="22" y="29" font-family="${SANS}" font-size="17" font-weight="800" fill="#5546C4">${t.cta}</text>
    <g transform="translate(${t.ctaW - 34} 15)" fill="none" stroke="#5546C4" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12L12 2M5 2H12V9"/></g>
  </g>
</g>
</svg>`;
}

// ---------- feature icons ----------
function icon(inner, accent, aria) {
  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 72 72" width="72" height="72" role="img" aria-label="${aria}">
<rect width="72" height="72" rx="18" fill="${C.panel}"/>
<rect x="1" y="1" width="70" height="70" rx="17" fill="none" stroke="${accent}" stroke-opacity=".45" stroke-width="2"/>
${inner}
</svg>`;
}
// Simulator: a terminal window with a play triangle.
const iconSimulator = icon(`
<rect x="13" y="17" width="46" height="38" rx="6" fill="none" stroke="${C.teal}" stroke-width="2.6"/>
<path d="M13 27H59" stroke="${C.teal}" stroke-width="2.6"/>
<circle cx="19" cy="22" r="1.8" fill="${C.teal}"/><circle cx="25" cy="22" r="1.8" fill="${C.teal}"/>
<path d="M31 33V49L44 41Z" fill="${C.teal}"/>`, C.teal, 'simulator');
// Connect: a plug meeting a socket.
const iconConnect = icon(`
<path d="M14 36H26M46 36H58" stroke="${C.amber}" stroke-width="2.6" stroke-linecap="round"/>
<rect x="26" y="26" width="10" height="20" rx="3" fill="${C.amber}"/>
<path d="M36 30H41M36 42H41" stroke="${C.amber}" stroke-width="2.6" stroke-linecap="round"/>
<rect x="43" y="24" width="10" height="24" rx="3" fill="none" stroke="${C.amber}" stroke-width="2.4"/>`, C.amber, 'connect');
// Clear errors: a shield with a check.
const iconErrors = icon(`
<path d="M36 13L56 21V35C56 47 47 55 36 59C25 55 16 47 16 35V21Z" fill="none" stroke="${C.violet}" stroke-width="2.6" stroke-linejoin="round"/>
<path d="M27 36L33.5 42.5L46 30" fill="none" stroke="${C.violet}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`, C.violet, 'clear errors');

// ---------- 中英文两套 ----------
const QQ = {accent: C.violet, qr: qrPath('qr-qq.svg'), fill: [C.primary, '#8A93F5'], ink: '#fff'};
const FEISHU = {accent: C.amber, qr: qrPath('qr-feishu.svg'), fill: [C.amber, '#FFCF94'], ink: '#2A1D0E'};
const sets = {
  'zh-CN': {
    hero: {
      aria: 'LumioGames 出品 · Lumio SDK：一个 npm 包，把 H5 游戏接上 Lumio 平台 · lumiogames.cn',
      presents: 'LumioGames 出品', presents2: '给 H5 游戏用的平台 SDK · npm 安装',
      h1: '一个 npm 包，',
      h2: `把游戏接上 <tspan fill="${C.teal}">Lumio</tspan> 平台`,
      s1: '登录、云存档、排行榜、成就、聊天。',
      s2: '先用本地模拟器跑通，再上传到平台。',
      chips: [[64, 64, '登录'], [138, 82, '云存档'], [230, 82, '排行榜'], [322, 64, '成就'], [396, 120, '+ 本地模拟器', true]],
      code: '// 没权限返回 platform.not_granted，不假装成功',
      board: '排行榜', you: '你', saved: '存档已同步',
    },
    qq: {title: 'QQ 交流群', sub: '群号 972220164 · 什么都能聊', aria: '扫码或点击加入 QQ 交流群 972220164', label: '加入 QQ 群'},
    feishu: {title: 'LumioGame 开发者社区', sub: '飞书话题群 · 玩法、内容、发布', aria: '扫码或点击加入飞书话题群 LumioGame 开发者社区', label: '加入飞书群'},
    brand: {aria: 'LumioGames 出品 · Lumio，游戏创造快乐 · 开发者中心 lumiogames.cn/studio', l1: 'Lumio SDK 由 LumioGames 出品', l2: 'Lumio · 游戏创造快乐', cta: '打开开发者中心', ctaW: 214},
  },
  en: {
    hero: {
      aria: 'Made by LumioGames · Lumio SDK: one npm package connects your H5 game to the Lumio platform · lumiogames.cn',
      presents: 'Made by LumioGames', presents2: 'Platform SDK for H5 games · install from npm',
      hSize: 38,
      h1: 'One npm package connects',
      h2: `your game to <tspan fill="${C.teal}">Lumio</tspan>.`,
      s1: 'Sign-in, cloud saves, leaderboards, achievements, chat.',
      s2: 'Get it working in the local simulator, then upload.',
      chips: [[64, 80, 'Sign-in'], [154, 72, 'Saves'], [236, 128, 'Leaderboards'], [374, 136, '+ simulator', true]],
      code: '// not allowed? platform.not_granted',
      board: 'Leaderboard', you: 'You', saved: 'Save synced',
    },
    qq: {title: 'QQ group', sub: 'Group 972220164 · anything goes', aria: 'Scan or click to join QQ group 972220164', label: 'Join QQ group', cx: 124, arrowX: 214},
    feishu: {title: 'LumioGame community', sub: 'Feishu group · games &amp; publishing', aria: 'Scan or click to join the LumioGame community on Feishu', label: 'Join Feishu group', cx: 122, arrowX: 222},
    brand: {aria: 'Made by LumioGames · Lumio, games bring joy · Developer Center lumiogames.cn/studio', l1: 'Lumio SDK is made by LumioGames', l2: 'Lumio · Games bring joy', cta: 'Open the Developer Center', ctaW: 290},
  },
};
function studioCard(lang) {
  const zh = lang === 'zh-CN';
  const accent = C.teal;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-12 0 304 412" width="304" height="412" role="img" aria-label="${zh ? '前往 Lumio 官网与开发者中心 lumio.games/studio' : 'Open Lumio Studio lumio.games/studio'}">
<defs>
  <linearGradient id="sb" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#5DE2C6"/><stop offset="1" stop-color="#8CF0DA"/></linearGradient>
  <linearGradient id="scard" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#1E2552"/><stop offset="1" stop-color="#131836"/></linearGradient>
</defs>
<rect x="1" y="1" width="278" height="410" rx="24" fill="${C.panel}" stroke="${accent}" stroke-opacity=".55" stroke-width="2"/>
<circle cx="34" cy="33" r="5" fill="${accent}"/>
<text x="48" y="39" font-family="${SANS}" font-size="18" font-weight="800" fill="${C.text}">${zh ? 'Lumio 开发者中心' : 'Lumio Studio'}</text>

<rect x="30" y="64" width="220" height="220" rx="14" fill="url(#scard)" stroke="#fff" stroke-opacity=".12"/>
${lumioMark(50, 84, 52, 'scMark')}
<text x="114" y="108" font-family="${SANS}" font-size="24" font-weight="800" fill="#fff">Lumio</text>
<text x="115" y="128" font-family="${SANS}" font-size="11" font-weight="700" letter-spacing="3.5" fill="${C.teal}">STUDIO</text>

<rect x="46" y="150" width="188" height="32" rx="8" fill="#fff" fill-opacity=".06"/>
<circle cx="62" cy="166" r="4" fill="${C.teal}"/>
<text x="74" y="171" font-family="${SANS}" font-size="13" font-weight="600" fill="${C.text}">${zh ? '上传 ZIP 即可发布游戏' : 'Upload ZIP to publish'}</text>

<rect x="46" y="190" width="188" height="32" rx="8" fill="#fff" fill-opacity=".06"/>
<circle cx="62" cy="206" r="4" fill="${C.amber}"/>
<text x="74" y="211" font-family="${SANS}" font-size="13" font-weight="600" fill="${C.text}">${zh ? '云存档 · 排行榜 · 成就' : 'Cloud Save · Leaderboard'}</text>

<rect x="46" y="230" width="188" height="32" rx="8" fill="#fff" fill-opacity=".06"/>
<circle cx="62" cy="246" r="4" fill="${C.violet}"/>
<text x="74" y="251" font-family="${SANS}" font-size="13" font-weight="600" fill="${C.text}">${zh ? 'SDK 文档与作者 API 密钥' : 'SDK Docs &amp; Author API Keys'}</text>

<text x="140" y="318" text-anchor="middle" font-family="${MONO}" font-size="14.5" font-weight="700" fill="${C.teal}">lumio.games/studio</text>
<rect x="22" y="340" width="236" height="50" rx="14" fill="url(#sb)"/>
<rect x="23" y="341" width="234" height="24" rx="13" fill="#fff" opacity=".2"/>
<text x="122" y="371.5" text-anchor="middle" font-family="${SANS}" font-size="18" font-weight="800" fill="#0E1726">${zh ? '打开开发者中心' : 'Open Studio'}</text>
<g transform="translate(198 359)" fill="none" stroke="#0E1726" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12L12 2M5 2H12V9"/></g>
</svg>`;
}

for (const [lang, t] of Object.entries(sets)) {
  write(`hero.${lang}.svg`, hero(t.hero));
  write(`qr-qq.${lang}.svg`, qrCard({...t.qq, accent: QQ.accent, qr: QQ.qr, btn: {label: t.qq.label, fill: QQ.fill, ink: QQ.ink, cx: t.qq.cx, arrowX: t.qq.arrowX}}));
  write(`qr-feishu.${lang}.svg`, qrCard({...t.feishu, accent: FEISHU.accent, qr: FEISHU.qr, btn: {label: t.feishu.label, fill: FEISHU.fill, ink: FEISHU.ink, cx: t.feishu.cx, arrowX: t.feishu.arrowX}}));
  write(`studio-card.${lang}.svg`, studioCard(lang));
  write(`brand.${lang}.svg`, brandCard(t.brand));
}
write('icon-simulator.svg', iconSimulator);
write('icon-connect.svg', iconConnect);
write('icon-errors.svg', iconErrors);
console.log(fs.readdirSync(out).map(f => `${f} ${fs.statSync(path.join(out, f)).size}`).join('\n'));
