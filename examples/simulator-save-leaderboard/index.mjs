// 本地模拟器：存档（含冲突）与排行榜。数据只在内存里，进程结束即清空。
import { createLumioSimulator } from '@lumiogames/sdk/simulator';

const lumio = await createLumioSimulator({ gameKey: 'g-abcdefghij', versionId: 'local' });
try {
  // 1. 读存档：新槽返回 null
  const first = await lumio.save.read('progress');
  if (!first.ok) throw new Error(first.failure.code);
  console.log('read   ', first.value);

  // 2. 写存档：带上刚读到的 revision，新槽为 null
  const written = await lumio.save.write('progress', { level: 2 }, {
    expectedRevision: first.value?.revision ?? null,
  });
  if (!written.ok) throw new Error(written.failure.code);
  if ('conflict' in written.value) throw new Error('Save conflict');
  console.log('write  ', written.value);

  // 3. 用过期的 revision 再写一次：ok 仍为 true，但返回 conflict，云端不会被覆盖
  const stale = await lumio.save.write('progress', { level: 1 }, { expectedRevision: null });
  if (!stale.ok) throw new Error(stale.failure.code);
  if ('conflict' in stale.value) {
    console.log('conflict', stale.value.conflict.value, 'revision', stale.value.conflict.revision);
  }

  // 4. 排行榜：名称为 stats.<字段名>，需在 lumio.json 声明
  const submitted = await lumio.leaderboard.submit('stats.bestScore', 100);
  if (!submitted.ok) throw new Error(submitted.failure.code);
  console.log('submit ', submitted.value);

  const top = await lumio.leaderboard.query('stats.bestScore', { kind: 'top', limit: 10 });
  if (!top.ok) throw new Error(top.failure.code);
  console.log('top    ', top.value.entries);

  // 5. 第三方未开放的能力返回明确错误，不会伪造成功
  const friends = await lumio.friends.list();
  console.log('friends', friends.ok ? friends.value : friends.failure.code);
} finally {
  lumio.dispose();
}
