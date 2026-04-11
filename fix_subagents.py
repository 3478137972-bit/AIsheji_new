import json
import sys

with open('/root/.openclaw/openclaw.json', 'r') as f:
    data = json.load(f)

# Fix: Add subagents.allowAgents to manager agent
agents = data.get('agents', {}).get('list', [])
for agent in agents:
    if agent.get('id') == 'manager':
        if 'subagents' not in agent:
            agent['subagents'] = {}
        agent['subagents']['allowAgents'] = ['analyst', 'developer', 'designer', 'tester', 'writer']
        print(f"✓ Added subagents.allowAgents to manager agent")
    
    # Also add to chief_manager if it exists
    if agent.get('id') == 'chief_manager':
        if 'subagents' not in agent:
            agent['subagents'] = {}
        agent['subagents']['allowAgents'] = ['manager', 'analyst', 'developer', 'designer', 'tester', 'writer']
        print(f"✓ Added subagents.allowAgents to chief_manager agent")
    
    # Add to content_manager if it exists
    if agent.get('id') == 'content_manager':
        if 'subagents' not in agent:
            agent['subagents'] = {}
        agent['subagents']['allowAgents'] = ['recorder', 'content_creator', 'moments', 'video', 'image', 'video_copy']
        print(f"✓ Added subagents.allowAgents to content_manager agent")

# Write the fixed config
with open('/root/.openclaw/openclaw.json', 'w') as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

print("✓ Config file updated successfully")
