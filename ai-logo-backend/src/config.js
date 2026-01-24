require('dotenv').config();

module.exports = {
  deepseek: {
    apiKey: process.env.DEEPSEEK_API_KEY,
    baseUrl: process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com'
  },
  kieai: {
    apiKey: process.env.KIEAI_API_KEY,
    baseUrl: process.env.KIEAI_BASE_URL || 'https://api.kie.ai'
  },
  port: process.env.PORT || 3000
};
