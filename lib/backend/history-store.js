const { createClient } = require('@supabase/supabase-js');

/**
 * 操作历史记录存储 - 使用 Supabase
 * 在 Vercel 无服务器环境中,Supabase 可以跨实例共享数据
 */

// 创建 Supabase 客户端
let supabase;

function getSupabaseClient() {
  if (!supabase) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    console.log('[HistoryStore] 检查环境变量:');
    console.log('[HistoryStore] SUPABASE_URL:', supabaseUrl ? `已配置 (${supabaseUrl.substring(0, 30)}...)` : '未配置');
    console.log('[HistoryStore] SUPABASE_KEY:', supabaseKey ? `已配置 (${supabaseKey.substring(0, 20)}...)` : '未配置');

    if (!supabaseUrl || !supabaseKey) {
      console.error('[HistoryStore] 错误: 未配置 Supabase 环境变量');
      return null;
    }

    console.log('[HistoryStore] 初始化 Supabase 连接');
    supabase = createClient(supabaseUrl, supabaseKey);
    console.log('[HistoryStore] Supabase 客户端已创建');
  }

  return supabase;
}

// 内存后备存储(用于开发环境或 Supabase 不可用时)
const memoryStore = [];

/**
 * 记录操作历史
 * @param {Object} operation - 操作记录
 * @returns {Object} - 创建的记录
 */
async function recordHistory(operation) {
  console.log(`[HistoryStore] 记录操作: ${operation.tool_name} - ${operation.action}`);

  const client = getSupabaseClient();

  // 准备数据
  const record = {
    user_id: operation.user_id || null,
    operation_type: operation.operation_type,
    tool_name: operation.tool_name,
    tool_display_name: operation.tool_display_name,
    action: operation.action,
    status: operation.status,
    metadata: operation.metadata || {},
    thumbnail_url: operation.thumbnail_url || null,
    created_at: new Date().toISOString(),
    expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30天后过期
  };

  try {
    if (client) {
      // 使用 Supabase 存储
      const { data, error } = await client
        .from('operation_history')
        .insert(record)
        .select()
        .single();

      if (error) {
        console.error('[HistoryStore] Supabase 存储失败:', error.message);
        throw error;
      }

      console.log(`[HistoryStore] 操作已存储到 Supabase: ${data.id}`);
      return data;
    } else {
      // 回退到内存存储
      const memoryRecord = { ...record, id: `mem_${Date.now()}_${Math.random()}` };
      memoryStore.push(memoryRecord);
      console.log(`[HistoryStore] 操作已存储到内存: ${memoryRecord.id}`);
      return memoryRecord;
    }
  } catch (error) {
    console.error('[HistoryStore] 记录操作失败:', error.message);
    // 如果 Supabase 失败,回退到内存
    const memoryRecord = { ...record, id: `mem_${Date.now()}_${Math.random()}` };
    memoryStore.push(memoryRecord);
    console.log(`[HistoryStore] 已回退到内存存储: ${memoryRecord.id}`);
    return memoryRecord;
  }
}

/**
 * 获取操作历史列表
 * @param {Object} options - 查询选项
 * @param {number} options.limit - 限制数量
 * @param {number} options.offset - 偏移量
 * @param {string} options.tool_name - 工具名称筛选
 * @returns {Array} - 历史记录列表
 */
async function getHistory(options = {}) {
  const { limit = 20, offset = 0, tool_name, user_id } = options;
  console.log(`[HistoryStore] 查询历史记录 (limit: ${limit}, offset: ${offset}, tool: ${tool_name || 'all'}, user: ${user_id || 'all'})`);

  const client = getSupabaseClient();

  try {
    if (client) {
      // 从 Supabase 获取
      let query = client
        .from('operation_history')
        .select('*')
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (tool_name) {
        query = query.eq('tool_name', tool_name);
      }

      if (user_id) {
        query = query.eq('user_id', user_id);
      }

      const { data, error } = await query;

      if (error) {
        console.error('[HistoryStore] Supabase 查询失败:', error.message);
        throw error;
      }

      console.log(`[HistoryStore] 从 Supabase 找到 ${data.length} 条记录`);
      return data;
    } else {
      // 从内存获取
      let filtered = [...memoryStore];
      if (tool_name) {
        filtered = filtered.filter(item => item.tool_name === tool_name);
      }
      if (user_id) {
        filtered = filtered.filter(item => item.user_id === user_id);
      }
      filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      const result = filtered.slice(offset, offset + limit);
      console.log(`[HistoryStore] 从内存找到 ${result.length} 条记录`);
      return result;
    }
  } catch (error) {
    console.error('[HistoryStore] 获取历史记录失败:', error.message);
    // 如果 Supabase 失败,尝试从内存获取
    let filtered = [...memoryStore];
    if (tool_name) {
      filtered = filtered.filter(item => item.tool_name === tool_name);
    }
    if (user_id) {
      filtered = filtered.filter(item => item.user_id === user_id);
    }
    filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    const result = filtered.slice(offset, offset + limit);
    console.log(`[HistoryStore] 已从内存回退获取 ${result.length} 条记录`);
    return result;
  }
}

/**
 * 清空操作历史
 * @param {Object} options - 清空选项
 * @param {Date} options.olderThan - 清空早于此日期的记录
 * @returns {boolean} - 是否成功清空
 */
async function clearHistory(options = {}) {
  const { olderThan, user_id } = options;
  console.log(`[HistoryStore] 清空历史记录 (olderThan: ${olderThan || 'all'}, user: ${user_id || 'all'})`);

  const client = getSupabaseClient();

  try {
    if (client) {
      let query = client.from('operation_history').delete();

      if (user_id) {
        query = query.eq('user_id', user_id);
      }

      if (olderThan) {
        query = query.lt('created_at', olderThan.toISOString());
      } else if (!user_id) {
        // 只有在没有 user_id 过滤时才删除所有记录
        query = query.neq('id', ''); // 删除所有记录
      }

      const { error } = await query;

      if (error) {
        console.error('[HistoryStore] Supabase 清空失败:', error.message);
        throw error;
      }

      console.log(`[HistoryStore] 已清空 Supabase 历史记录`);
      return true;
    } else {
      if (olderThan || user_id) {
        const beforeLength = memoryStore.length;
        memoryStore.splice(0, memoryStore.length,
          ...memoryStore.filter(item => {
            let keep = true;
            if (olderThan) {
              keep = keep && new Date(item.created_at) >= olderThan;
            }
            if (user_id) {
              keep = keep && item.user_id !== user_id;
            }
            return keep;
          })
        );
        console.log(`[HistoryStore] 已清空内存中 ${beforeLength - memoryStore.length} 条记录`);
      } else {
        memoryStore.length = 0;
        console.log(`[HistoryStore] 已清空所有内存历史记录`);
      }
      return true;
    }
  } catch (error) {
    console.error('[HistoryStore] 清空历史记录失败:', error.message);
    if (olderThan || user_id) {
      const beforeLength = memoryStore.length;
      memoryStore.splice(0, memoryStore.length,
        ...memoryStore.filter(item => {
          let keep = true;
          if (olderThan) {
            keep = keep && new Date(item.created_at) >= olderThan;
          }
          if (user_id) {
            keep = keep && item.user_id !== user_id;
          }
          return keep;
        })
      );
      console.log(`[HistoryStore] 已从内存回退清空 ${beforeLength - memoryStore.length} 条记录`);
    } else {
      memoryStore.length = 0;
      console.log(`[HistoryStore] 已从内存回退清空所有记录`);
    }
    return true;
  }
}

module.exports = {
  recordHistory,
  getHistory,
  clearHistory
};
