const axios = require('axios');
const config = require('./config');

/**
 * 创建生图任务
 * @param {string} prompt - 生图提示词
 * @returns {Promise<Object>} - 返回任务信息
 */
async function createImageTask(prompt) {
  try {
    const response = await axios.post(
      `${config.kieai.baseUrl}/api/v1/jobs/createTask`,
      {
        model: 'google/nano-banana',
        input: {
          prompt: prompt,
          output_format: 'png',
          image_size: '1:1'
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${config.kieai.apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (response.data.code === 200) {
      return {
        success: true,
        taskId: response.data.data.taskId
      };
    } else {
      throw new Error(response.data.message || '创建任务失败');
    }
  } catch (error) {
    console.error('KIEAI 创建任务失败:', error.response?.data || error.message);
    throw new Error('创建生图任务失败: ' + (error.response?.data?.message || error.message));
  }
}

/**
 * 查询任务状态
 * @param {string} taskId - 任务ID
 * @returns {Promise<Object>} - 返回任务状态和结果
 */
async function getTaskStatus(taskId) {
  try {
    const response = await axios.get(
      `${config.kieai.baseUrl}/api/v1/jobs/recordInfo`,
      {
        params: { taskId },
        headers: {
          'Authorization': `Bearer ${config.kieai.apiKey}`
        }
      }
    );

    // 解析 resultJson 获取图片URL
    const data = response.data.data;
    let imageUrl = null;
    if (data?.resultJson) {
      try {
        const resultData = JSON.parse(data.resultJson);
        imageUrl = resultData.resultUrls?.[0] || null;
      } catch (e) {
        // resultJson 解析失败
      }
    }

    return {
      code: response.data.code,
      data: {
        taskId: data?.taskId,
        status: data?.state, // success, pending, failed 等
        imageUrl: imageUrl,
        failMsg: data?.failMsg,
        createTime: data?.createTime,
        completeTime: data?.completeTime
      }
    };
  } catch (error) {
    console.error('查询任务状态失败:', error.response?.data || error.message);
    throw new Error('查询任务状态失败: ' + (error.response?.data?.message || error.message));
  }
}

/**
 * 轮询等待任务完成
 * @param {string} taskId - 任务ID
 * @param {number} maxRetries - 最大重试次数
 * @param {number} interval - 轮询间隔(ms)
 * @returns {Promise<Object>} - 返回最终结果
 */
async function waitForTaskComplete(taskId, maxRetries = 60, interval = 3000) {
  for (let i = 0; i < maxRetries; i++) {
    const result = await getTaskStatus(taskId);

    if (result.data?.status === 'success') {
      return {
        success: true,
        imageUrl: result.data.imageUrl,
        data: result.data
      };
    }

    if (result.data?.status === 'failed' || result.data?.status === 'error') {
      throw new Error('生图任务失败: ' + (result.data?.failMsg || '未知错误'));
    }

    // 等待后继续轮询
    await new Promise(resolve => setTimeout(resolve, interval));
  }

  throw new Error('生图任务超时');
}

/**
 * 批量创建生图任务
 * @param {string[]} prompts - 提示词数组
 * @returns {Promise<Object[]>} - 返回任务ID数组
 */
async function createBatchTasks(prompts) {
  const tasks = await Promise.all(
    prompts.map(async (prompt, index) => {
      try {
        const result = await createImageTask(prompt);
        return {
          index,
          prompt,
          taskId: result.taskId,
          success: true
        };
      } catch (error) {
        return {
          index,
          prompt,
          success: false,
          error: error.message
        };
      }
    })
  );

  return tasks;
}

module.exports = {
  createImageTask,
  getTaskStatus,
  waitForTaskComplete,
  createBatchTasks
};
