import json
import sys

with open('/root/.openclaw/openclaw.json', 'r') as f:
    data = json.load(f)

agents = data.get('agents', {}).get('list', [])
print("=== Agents List ===")
for agent in agents:
    print(f"Agent: {agent.get('id')} - {agent.get('name')}")
    if 'subagents' in agent:
        print(f"  subagents: {json.dumps(agent['subagents'])}")
    else:
        print(f"  subagents: not configured")

print("\n=== Default Subagents Config ===")
defaults = data.get('agents', {}).get('defaults', {})
subagents = defaults.get('subagents', {})
print(f"Default subagents config: {json.dumps(subagents, indent=2)}")

print("\n=== Tools Config ===")
tools = data.get('tools', {})
print(f"Tools: {json.dumps(tools, indent=2)}")
