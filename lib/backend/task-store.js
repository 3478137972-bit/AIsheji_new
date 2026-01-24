/**
 * 共享的任务存储
 * 注意:在无服务器环境中,这个Map只能在同一个实例/请求中共享
 * 对于跨请求的持久化,应该使用数据库或Redis
 */

// 创建一个全局的任务存储Map
const taskStore = new Map();

/**
 * 存储任务
 * @param {string} batchId - 批次ID
 * @param {Object} data - 任务数据
 */
function setTask(batchId, data) {
  console.log(`[TaskStore] 存储任务 ${batchId}:`, JSON.stringify(data, null, 2));
  taskStore.set(batchId, data);
  console.log(`[TaskStore] 当前存储的任务数量: ${taskStore.size}`);
  console.log(`[TaskStore] 所有batchId:`, Array.from(taskStore.keys()));
}

/**
 * 获取任务
 * @param {string} batchId - 批次ID
 * @returns {Object|undefined} - 任务数据
 */
function getTask(batchId) {
  console.log(`[TaskStore] 查询任务 ${batchId}`);
  console.log(`[TaskStore] 当前存储的任务数量: ${taskStore.size}`);
  console.log(`[TaskStore] 所有batchId:`, Array.from(taskStore.keys()));
  const task = taskStore.get(batchId);
  if (task) {
    console.log(`[TaskStore] 找到任务:`, JSON.stringify(task, null, 2));
  } else {
    console.log(`[TaskStore] 未找到任务 ${batchId}`);
  }
  return task;
}

/**
 * 删除任务
 * @param {string} batchId - 批次ID
 * @returns {boolean} - 是否成功删除
 */
function deleteTask(batchId) {
  console.log(`[TaskStore] 删除任务 ${batchId}`);
  return taskStore.delete(batchId);
}

/**
 * 清空所有任务
 */
function clearTasks() {
  console.log(`[TaskStore] 清空所有任务`);
  taskStore.clear();
}

module.exports = {
  taskStore,
  setTask,
  getTask,
  deleteTask,
  clearTasks
};
