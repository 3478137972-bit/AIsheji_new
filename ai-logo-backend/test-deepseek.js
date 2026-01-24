const axios = require('axios');

async function testDeepSeek() {
  const response = await axios.post(
    'https://api.deepseek.com/v1/chat/completions',
    {
      model: 'deepseek-chat',
      messages: [
        { role: 'system', content: '你是一位资深品牌logo设计大师。用户给出品牌名后，提供5个不同的logo设计方案的出图提示词。提示词格式：平面设计2DLOGO，纯白色背景，平面风格...' },
        { role: 'user', content: '品牌名：【测试科技】\n行业类型：科技互联网\nLogo风格：简约现代' }
      ],
      temperature: 0.8,
      max_tokens: 2000
    },
    {
      headers: {
        'Authorization': 'Bearer sk-64ea3021c81f497483eba4a2e7bb4870',
        'Content-Type': 'application/json'
      }
    }
  );

  console.log('DeepSeek 返回内容：\n');
  console.log(response.data.choices[0].message.content);
}

testDeepSeek().catch(console.error);
