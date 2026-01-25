const { createClient } = require('@supabase/supabase-js');

/**
 * 共享的任务存储 - 使用 Supabase
 * 在 Vercel 无服务器环境中,Supabase 可以跨实例共享数据
 */

// 创建 Supabase 客户端
let supabase;

function getSupabaseClient() {
  if (!supabase) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    console.log('[TaskStore] 检查环境变量:');
    console.log('[TaskStore] SUPABASE_URL:', supabaseUrl ? `已配置 (${supabaseUrl.substring(0, 30)}...)` : '未配置');
    console.log('[TaskStore] SUPABASE_KEY:', supabaseKey ? `已配置 (${supabaseKey.substring(0, 20)}...)` : '未配置');
    console.log('[TaskStore] 所有环境变量键:', Object.keys(process.env).filter(k => k.includes('SUPABASE')));

    if (!supabaseUrl || !supabaseKey) {
      console.error('[TaskStore] 错误: 未配置 Supabase 环境变量');
      return null;
    }

    console.log('[TaskStore] 初始化 Supabase 连接');
    supabase = createClient(supabaseUrl, supabaseKey);
    console.log('[TaskStore] Supabase 客户端已创建');
  }

  return supabase;
}

// 内存后备存储(用于开发环境或 Supabase 不可用时)
const memoryStore = new Map();

/**
 * 存储任务
 * @param {string} batchId - 批次ID
 * @param {Object} data - 任务数据
 */
async function setTask(batchId, data) {
  console.log(`[TaskStore] 存储任务 ${batchId}`);

  const client = getSupabaseClient();

  try {
    if (client) {
      // 使用 Supabase 存储
      const { error } = await client
        .from('ai_tasks')
        .upsert({
          batch_id: batchId,
          data: data,
          created_at: new Date().toISOString(),
          expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24小时后过期
        });

      if (error) {
        console.error('[TaskStore] Supabase 存储失败:', error.message);
        throw error;
      }

      console.log(`[TaskStore] 任务已存储到 Supabase: ${batchId}`);
    } else {
      // 回退到内存存储
      memoryStore.set(batchId, data);
      console.log(`[TaskStore] 任务已存储到内存: ${batchId}`);
    }
  } catch (error) {
    console.error('[TaskStore] 存储任务失败:', error.message);
    // 如果 Supabase 失败,回退到内存
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

  const client = getSupabaseClient();

  try {
    if (client) {
      // 从 Supabase 获取
      const { data, error } = await client
        .from('ai_tasks')
        .select('data')
        .eq('batch_id', batchId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // 未找到记录
          console.log(`[TaskStore] Supabase 中未找到任务: ${batchId}`);
          return undefined;
        }
        console.error('[TaskStore] Supabase 查询失败:', error.message);
        throw error;
      }

      if (data) {
        console.log(`[TaskStore] 从 Supabase 找到任务: ${batchId}`);
        return data.data;
      } else {
        console.log(`[TaskStore] Supabase 中未找到任务: ${batchId}`);
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
    // 如果 Supabase 失败,尝试从内存获取
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

  const client = getSupabaseClient();

  try {
    if (client) {
      const { error } = await client
        .from('ai_tasks')
        .delete()
        .eq('batch_id', batchId);

      if (error) {
        console.error('[TaskStore] Supabase 删除失败:', error.message);
        throw error;
      }

      console.log(`[TaskStore] 已从 Supabase 删除任务: ${batchId}`);
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

  const client = getSupabaseClient();

  try {
    if (client) {
      const { error } = await client
        .from('ai_tasks')
        .delete()
        .neq('batch_id', ''); // 删除所有记录

      if (error) {
        console.error('[TaskStore] Supabase 清空失败:', error.message);
        throw error;
      }

      console.log(`[TaskStore] 已清空所有 Supabase 任务`);
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
