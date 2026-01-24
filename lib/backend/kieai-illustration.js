const axios = require('axios');
const FormData = require('form-data');
const config = require('./config');

/**
 * 上传图片到 KIEAI
 * @param {string} base64Image - Base64 格式的图片
 * @param {string} fileName - 文件名（不提供则自动生成）
 * @returns {Promise<string>} - 返回图片 URL
 */
async function uploadImageToKIEAI(base64Image, fileName = null) {
  try {
    // 将 base64 转换为 Buffer
    const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');

    // 创建 FormData
    const formData = new FormData();
    formData.append('file', buffer, {
      filename: fileName || `img_${Date.now()}.jpg`,
      contentType: 'image/jpeg'
    });
    formData.append('uploadPath', 'images/user-uploads');
    if (fileName) {
      formData.append('fileName', fileName);
    }

    // 上传到 KIEAI
    const response = await axios.post(
      'https://kieai.redpandaai.co/api/file-stream-upload',
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          'Authorization': `Bearer ${config.kieai.apiKey}`
        },
        maxBodyLength: Infinity,
        maxContentLength: Infinity
      }
    );

    if (response.data.success) {
      console.log('图片上传成功:', response.data.data.downloadUrl);
      return response.data.data.downloadUrl;
    } else {
      throw new Error('图片上传失败: ' + response.data.msg);
    }
  } catch (error) {
    console.error('上传图片到 KIEAI 失败:', error.response?.data || error.message);
    throw new Error('上传图片失败: ' + (error.response?.data?.msg || error.message));
  }
}

/**
 * 创建 KIEAI 插画生成任务
 * @param {Object} params - 任务参数
 * @param {string} params.prompt - 提示词
 * @param {string[]} params.imageUrls - 参考图 URL 数组（选填）
 * @param {string} params.aspectRatio - 宽高比
 * @returns {Promise<string>} - 返回任务 ID
 */
async function createIllustrationTask(params) {
  const { prompt, imageUrls = [], aspectRatio = '1:1' } = params;

  try {
    const taskData = {
      model: 'nano-banana-pro',
      input: {
        prompt: prompt,
        aspect_ratio: aspectRatio,
        resolution: '2K',  // 默认 2K 分辨率
        output_format: 'png'
      }
    };

    // 如果有参考图，添加到 input
    if (imageUrls && imageUrls.length > 0) {
      taskData.input.image_input = imageUrls;
    }

    console.log('创建 KIEAI 任务:', JSON.stringify(taskData, null, 2));

    const response = await axios.post(
      `${config.kieai.baseUrl}/api/v1/jobs/createTask`,
      taskData,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.kieai.apiKey}`
        }
      }
    );

    if (response.data.code === 200) {
      console.log('任务创建成功:', response.data.data.taskId);
      return response.data.data.taskId;
    } else {
      throw new Error('创建任务失败: ' + response.data.message);
    }
  } catch (error) {
    console.error('创建 KIEAI 任务失败:', error.response?.data || error.message);
    throw new Error('创建生图任务失败: ' + (error.response?.data?.message || error.message));
  }
}

/**
 * 查询 KIEAI 任务状态
 * @param {string} taskId - 任务 ID
 * @returns {Promise<Object>} - 返回任务状态和结果
 */
async function getIllustrationTaskStatus(taskId) {
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

    if (response.data.code === 200) {
      const data = response.data.data;

      let imageUrl = null;
      let status = 'processing';

      if (data.state === 'success' && data.resultJson) {
        try {
          const result = JSON.parse(data.resultJson);
          if (result.resultUrls && result.resultUrls.length > 0) {
            imageUrl = result.resultUrls[0];
            status = 'success';
          }
        } catch (e) {
          console.error('解析结果失败:', e);
        }
      } else if (data.state === 'failed') {
        status = 'failed';
      }

      return {
        success: true,
        data: {
          taskId: data.taskId,
          status: status,
          imageUrl: imageUrl,
          state: data.state,
          failMsg: data.failMsg
        }
      };
    } else {
      throw new Error('查询任务失败: ' + response.data.message);
    }
  } catch (error) {
    console.error('查询 KIEAI 任务状态失败:', error.response?.data || error.message);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * 批量创建插画任务
 * @param {string[]} prompts - 提示词数组
 * @param {string[]} imageUrls - 参考图 URL 数组（选填）
 * @param {string} aspectRatio - 宽高比
 * @returns {Promise<Array>} - 返回任务列表
 */
async function createBatchIllustrationTasks(prompts, imageUrls = [], aspectRatio = '1:1') {
  const tasks = [];

  for (let i = 0; i < prompts.length; i++) {
    try {
      const taskId = await createIllustrationTask({
        prompt: prompts[i],
        imageUrls: imageUrls,
        aspectRatio: aspectRatio
      });

      tasks.push({
        index: i,
        prompt: prompts[i],
        taskId: taskId,
        success: true
      });
    } catch (error) {
      console.error(`创建任务 ${i} 失败:`, error.message);
      tasks.push({
        index: i,
        prompt: prompts[i],
        success: false,
        error: error.message
      });
    }
  }

  return tasks;
}

module.exports = {
  uploadImageToKIEAI,
  createIllustrationTask,
  getIllustrationTaskStatus,
  createBatchIllustrationTasks
};
