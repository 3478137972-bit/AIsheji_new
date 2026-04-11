import json

with open('/root/.openclaw/openclaw.json', 'r') as f:
    data = json.load(f)

# Model mapping: xiaomi -> bailian
model_mapping = {
    'xiaomi-coding/mimo-v2-pro': 'bailian/qwen3-coder-next',
    'xiaomi-coding/mimo-v2-omni': 'bailian/qwen3.5-plus',
    'xiaomi-mimo/MiMo-V2-Pro': 'bailian/qwen3.5-plus',
    'xiaomi-mimo/MiMo-V2-Omni': 'bailian/qwen3.5-plus',
    'xiaomi-mimo/MiMo-V2-TTS': 'bailian/kimi-k2.5'
}

agents = data.get('agents', {}).get('list', [])
changes = []

for agent in agents:
    agent_id = agent.get('id')
    old_model = agent.get('model')
    
    if old_model in model_mapping:
        new_model = model_mapping[old_model]
        agent['model'] = new_model
        changes.append(f"  {agent_id}: {old_model} -> {new_model}")

if changes:
    with open('/root/.openclaw/openclaw.json', 'w') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    
    print("✅ 已更新以下Agent的模型配置：")
    for change in changes:
        print(change)
else:
    print("✓ 所有Agent已使用百炼模型，无需修改")
