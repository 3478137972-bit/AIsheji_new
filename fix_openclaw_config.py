import json
import sys

# Read the config file
with open('/root/.openclaw/openclaw.json', 'r') as f:
    data = json.load(f)

# 1. Move agentToAgent from tools to top level
if 'tools' in data and 'agentToAgent' in data['tools']:
    data['agentToAgent'] = data['tools']['agentToAgent']
    # Keep tools but remove agentToAgent from it
    del data['tools']['agentToAgent']
    print("✓ Moved agentToAgent to top level")

# 2. Fix subagent model - use bailian/qwen3.5-plus instead of xiaomi-mimo/MiMo-V2-Omni
if 'agents' in data and 'defaults' in data['agents']:
    if 'subagents' not in data['agents']['defaults']:
        data['agents']['defaults']['subagents'] = {}
    data['agents']['defaults']['subagents']['defaultModel'] = 'bailian/qwen3.5-plus'
    print("✓ Set subagent default model to bailian/qwen3.5-plus")

# Write the fixed config
with open('/root/.openclaw/openclaw.json', 'w') as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

print("✓ Config file updated successfully")
