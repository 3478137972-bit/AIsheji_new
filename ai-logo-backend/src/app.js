const express = require('express');
const cors = require('cors');
const config = require('./config');
const { generateLogoPrompts, generateIllustrationPrompts } = require('./deepseek');
const { createBatchTasks, getTaskStatus, waitForTaskComplete } = require('./kieai');
const {
  uploadImageToKIEAI,
  createBatchIllustrationTasks,
  getIllustrationTaskStatus
} = require('./kieai-illustration');

const app = express();

// 中间件
app.use(cors());
app.use(express.json());

// 存储任务状态（生产环境应使用 Redis 等）
const taskStore = new Map();

/**
 * 生成 Logo API
 * POST /api/generate-logo
 * Body: { logoName, industry, style, slogan }
 */
app.post('/api/generate-logo', async (req, res) => {
  try {
    const { logoName, industry, style, slogan } = req.body;

    // 参数验证
    if (!logoName) {
      return res.status(400).json({ success: false, error: 'Logo名称不能为空' });
    }

    console.log('收到生成请求:', { logoName, industry, style, slogan });

    // 步骤1: 调用 DeepSeek 生成提示词
    console.log('正在调用 DeepSeek 生成提示词...');
    const promptResult = await generateLogoPrompts({ logoName, industry, style, slogan });

    if (!promptResult.prompts || promptResult.prompts.length === 0) {
      return res.status(500).json({
        success: false,
        error: '未能解析出有效的提示词',
        rawContent: promptResult.rawContent
      });
    }

    console.log(`成功生成 ${promptResult.prompts.length} 个提示词`);

    // 步骤2: 批量创建生图任务
    console.log('正在创建生图任务...');
    const tasks = await createBatchTasks(promptResult.prompts);

    // 生成一个总任务ID
    const batchId = `batch_${Date.now()}`;
    taskStore.set(batchId, {
      status: 'processing',
      tasks: tasks,
      prompts: promptResult.prompts,
      rawContent: promptResult.rawContent,
      createdAt: new Date().toISOString()
    });

    // 返回任务ID，前端可以用这个ID轮询状态
    res.json({
      success: true,
      batchId: batchId,
      message: '任务已创建，请使用 batchId 查询进度',
      promptCount: promptResult.prompts.length,
      tasks: tasks.map(t => ({
        index: t.index,
        taskId: t.taskId,
        success: t.success,
        error: t.error
      }))
    });

  } catch (error) {
    console.error('生成Logo失败:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * 查询批次任务状态
 * GET /api/task-status/:batchId
 */
app.get('/api/task-status/:batchId', async (req, res) => {
  try {
    const { batchId } = req.params;
    const batchData = taskStore.get(batchId);

    if (!batchData) {
      return res.status(404).json({ success: false, error: '任务不存在' });
    }

    // 查询每个任务的状态
    const results = await Promise.all(
      batchData.tasks.map(async (task) => {
        if (!task.success || !task.taskId) {
          return { ...task, status: 'failed' };
        }

        try {
          // 判断是 Logo 任务还是插画任务（通过 taskId 或 batchId 判断）
          const isIllustration = batchData.imageUrls !== undefined; // 插画任务会有 imageUrls 字段

          let status;
          if (isIllustration) {
            // 使用插画任务查询接口
            status = await getIllustrationTaskStatus(task.taskId);
          } else {
            // 使用 Logo 任务查询接口
            status = await getTaskStatus(task.taskId);
          }

          return {
            index: task.index,
            taskId: task.taskId,
            status: status.data?.status || 'unknown',
            imageUrl: status.data?.imageUrl || status.data?.output?.image_url || status.data?.output?.url,
            data: status.data
          };
        } catch (error) {
          return {
            index: task.index,
            taskId: task.taskId,
            status: 'error',
            error: error.message
          };
        }
      })
    );

    // 判断是否全部完成
    const allCompleted = results.every(r =>
      r.status === 'completed' || r.status === 'success' || r.status === 'failed' || r.status === 'error'
    );

    res.json({
      success: true,
      batchId: batchId,
      status: allCompleted ? 'completed' : 'processing',
      results: results
    });

  } catch (error) {
    console.error('查询任务状态失败:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * 同步生成 Logo（等待全部完成）
 * POST /api/generate-logo-sync
 * Body: { logoName, industry, style, slogan }
 */
app.post('/api/generate-logo-sync', async (req, res) => {
  try {
    const { logoName, industry, style, slogan } = req.body;

    if (!logoName) {
      return res.status(400).json({ success: false, error: 'Logo名称不能为空' });
    }

    console.log('收到同步生成请求:', { logoName, industry, style, slogan });

    // 步骤1: 生成提示词
    console.log('正在调用 DeepSeek 生成提示词...');
    const promptResult = await generateLogoPrompts({ logoName, industry, style, slogan });

    if (!promptResult.prompts || promptResult.prompts.length === 0) {
      return res.status(500).json({
        success: false,
        error: '未能解析出有效的提示词',
        rawContent: promptResult.rawContent
      });
    }

    console.log(`成功生成 ${promptResult.prompts.length} 个提示词`);

    // 步骤2: 创建生图任务
    console.log('正在创建生图任务...');
    const tasks = await createBatchTasks(promptResult.prompts);

    // 步骤3: 等待所有任务完成
    console.log('等待生图任务完成...');
    const results = await Promise.all(
      tasks.map(async (task) => {
        if (!task.success || !task.taskId) {
          return { ...task, status: 'failed' };
        }

        try {
          const result = await waitForTaskComplete(task.taskId);
          return {
            index: task.index,
            prompt: task.prompt,
            imageUrl: result.imageUrl,
            status: 'completed'
          };
        } catch (error) {
          return {
            index: task.index,
            prompt: task.prompt,
            status: 'failed',
            error: error.message
          };
        }
      })
    );

    res.json({
      success: true,
      logoName: logoName,
      results: results
    });

  } catch (error) {
    console.error('同步生成Logo失败:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * 生成插画 API
 * POST /api/generate-illustration
 * Body: { description, style, aspectRatio, referenceImages }
 */
app.post('/api/generate-illustration', async (req, res) => {
  try {
    const { description, style, aspectRatio, referenceImages = [] } = req.body;

    // 参数验证
    if (!description) {
      return res.status(400).json({ success: false, error: '画面描述不能为空' });
    }

    console.log('收到插画生成请求:', { description, style, aspectRatio, referenceImageCount: referenceImages.length });

    // 步骤1: 如果有参考图，先上传到 KIEAI
    let imageUrls = [];
    if (referenceImages && referenceImages.length > 0) {
      console.log(`正在上传 ${referenceImages.length} 张参考图...`);
      for (let i = 0; i < referenceImages.length; i++) {
        try {
          const imageUrl = await uploadImageToKIEAI(referenceImages[i], `ref_${Date.now()}_${i}.jpg`);
          imageUrls.push(imageUrl);
          console.log(`参考图 ${i + 1} 上传成功:`, imageUrl);
        } catch (error) {
          console.error(`参考图 ${i + 1} 上传失败:`, error.message);
        }
      }
    }

    // 步骤2: 调用 DeepSeek 生成提示词
    console.log('正在调用 DeepSeek 生成插画提示词...');
    const promptResult = await generateIllustrationPrompts({ description, style, aspectRatio });

    if (!promptResult.prompts || promptResult.prompts.length === 0) {
      return res.status(500).json({
        success: false,
        error: '未能解析出有效的提示词',
        rawContent: promptResult.rawContent
      });
    }

    console.log(`成功生成 ${promptResult.prompts.length} 个提示词`);

    // 步骤3: 批量创建生图任务
    console.log('正在创建 KIEAI 生图任务...');
    const tasks = await createBatchIllustrationTasks(promptResult.prompts, imageUrls, aspectRatio);

    // 生成一个总任务ID
    const batchId = `batch_${Date.now()}`;
    taskStore.set(batchId, {
      status: 'processing',
      tasks: tasks,
      prompts: promptResult.prompts,
      imageUrls: imageUrls,
      rawContent: promptResult.rawContent,
      createdAt: new Date().toISOString()
    });

    // 返回任务ID，前端可以用这个ID轮询状态
    res.json({
      success: true,
      batchId: batchId,
      message: '任务已创建，请使用 batchId 查询进度',
      promptCount: promptResult.prompts.length,
      tasks: tasks.map(t => ({
        index: t.index,
        taskId: t.taskId,
        success: t.success,
        error: t.error
      }))
    });

  } catch (error) {
    console.error('生成插画失败:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * 健康检查
 * GET /api/health
 */
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// 启动服务器
app.listen(config.port, () => {
  console.log(`AI Logo 后端服务已启动: http://localhost:${config.port}`);
  console.log('可用接口:');
  console.log('  POST /api/generate-logo           - 异步生成Logo（返回任务ID）');
  console.log('  POST /api/generate-illustration   - 异步生成插画（返回任务ID）');
  console.log('  GET  /api/task-status/:id         - 查询任务状态');
  console.log('  POST /api/generate-logo-sync      - 同步生成Logo（等待完成）');
  console.log('  GET  /api/health                  - 健康检查');
});
