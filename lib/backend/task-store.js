const Redis = require('ioredis');

/**
 * 共享的任务存储 - 使用 Redis
 * 在 Vercel 无服务器环境中,Redis 可以跨实例共享数据
 */

// 创建 Redis 客户端
let redis;

function getRedisClient() {
  if (!redis) {
    // 从环境变量获取 Redis URL
    const redisUrl = process.env.REDIS_URL || process.env.STORAGE_URL;

    console.log('[TaskStore] 检查环境变量:');
    console.log('[TaskStore] REDIS_URL:', process.env.REDIS_URL ? '已配置' : '未配置');
    console.log('[TaskStore] STORAGE_URL:', process.env.STORAGE_URL ? '已配置' : '未配置');
    console.log('[TaskStore] 所有环境变量:', Object.keys(process.env).filter(k => k.includes('REDIS') || k.includes('STORAGE')));

    if (!redisUrl) {
      console.warn('[TaskStore] 警告: 未配置 REDIS_URL,使用内存存储(仅适用于开发环境)');
      return null;
    }

    console.log('[TaskStore] 初始化 Redis 连接, URL:', redisUrl.substring(0, 20) + '...');
    redis = new Redis(redisUrl, {
      maxRetriesPerRequest: 3,
      enableReadyCheck: false,
      lazyConnect: true
    });

    redis.on('error', (err) => {
      console.error('[TaskStore] Redis 连接错误:', err.message);
    });

    redis.on('connect', () => {
      console.log('[TaskStore] Redis 已连接');
    });
  }

  return redis;
}

// 内存后备存储(用于开发环境或 Redis 不可用时)
const memoryStore = new Map();

/**
 * 存储任务
 * @param {string} batchId - 批次ID
 * @param {Object} data - 任务数据
 */
async function setTask(batchId, data) {
  console.log(`[TaskStore] 存储任务 ${batchId}`);

  const client = getRedisClient();

  try {
    if (client) {
      // 使用 Redis 存储,设置 24 小时过期时间
      await client.setex(
        `task:${batchId}`,
        24 * 60 * 60, // 24小时
        JSON.stringify(data)
      );
      console.log(`[TaskStore] 任务已存储到 Redis: ${batchId}`);
    } else {
      // 回退到内存存储
      memoryStore.set(batchId, data);
      console.log(`[TaskStore] 任务已存储到内存: ${batchId}`);
    }
  } catch (error) {
    console.error('[TaskStore] 存储任务失败:', error.message);
    // 如果 Redis 失败,回退到内存
    memoryStore.set(batchId, data);
    console.log(`[TaskStore] 已回退到内存存储: ${batchId}`);
  }
}

/**
 * 获取任务
 * @param {string} batchId - 批次ID
 * @returns {Object|undefined} - 任务数据
 */
async function getTask(batchId) {
  console.log(`[TaskStore] 查询任务 ${batchId}`);

  const client = getRedisClient();

  try {
    if (client) {
      // 从 Redis 获取
      const data = await client.get(`task:${batchId}`);
      if (data) {
        console.log(`[TaskStore] 从 Redis 找到任务: ${batchId}`);
        return JSON.parse(data);
      } else {
        console.log(`[TaskStore] Redis 中未找到任务: ${batchId}`);
        return undefined;
      }
    } else {
      // 从内存获取
      const task = memoryStore.get(batchId);
      if (task) {
        console.log(`[TaskStore] 从内存找到任务: ${batchId}`);
      } else {
        console.log(`[TaskStore] 内存中未找到任务: ${batchId}`);
      }
      return task;
    }
  } catch (error) {
    console.error('[TaskStore] 获取任务失败:', error.message);
    // 如果 Redis 失败,尝试从内存获取
    const task = memoryStore.get(batchId);
    if (task) {
      console.log(`[TaskStore] 已从内存回退获取: ${batchId}`);
    }
    return task;
  }
}

/**
 * 删除任务
 * @param {string} batchId - 批次ID
 * @returns {boolean} - 是否成功删除
 */
async function deleteTask(batchId) {
  console.log(`[TaskStore] 删除任务 ${batchId}`);

  const client = getRedisClient();

  try {
    if (client) {
      await client.del(`task:${batchId}`);
      console.log(`[TaskStore] 已从 Redis 删除任务: ${batchId}`);
      return true;
    } else {
      const result = memoryStore.delete(batchId);
      console.log(`[TaskStore] 已从内存删除任务: ${batchId}`);
      return result;
    }
  } catch (error) {
    console.error('[TaskStore] 删除任务失败:', error.message);
    return memoryStore.delete(batchId);
  }
}

/**
 * 清空所有任务
 */
async function clearTasks() {
  console.log(`[TaskStore] 清空所有任务`);

  const client = getRedisClient();

  try {
    if (client) {
      // 清空所有 task: 开头的键
      const keys = await client.keys('task:*');
      if (keys.length > 0) {
        await client.del(...keys);
        console.log(`[TaskStore] 已清空 ${keys.length} 个 Redis 任务`);
      }
    } else {
      memoryStore.clear();
      console.log(`[TaskStore] 已清空内存任务`);
    }
  } catch (error) {
    console.error('[TaskStore] 清空任务失败:', error.message);
    memoryStore.clear();
  }
}

module.exports = {
  setTask,
  getTask,
  deleteTask,
  clearTasks
};
