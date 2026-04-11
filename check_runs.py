import json

with open('/root/.openclaw/subagents/runs.json', 'r') as f:
    data = json.load(f)

runs = []
for key, value in data.items():
    if isinstance(value, dict):
        runs.append(value)

runs.sort(key=lambda x: x.get('createdAt', 0), reverse=True)

print(f"=== 最近5次子Agent调用记录 ===\n")
for run in runs[:5]:
    print(f"RunId: {run.get('runId', 'N/A')}")
    print(f"Label: {run.get('label', 'N/A')}")
    print(f"Task: {run.get('task', 'N/A')[:100]}...")
    print(f"Model: {run.get('model', 'N/A')}")
    print(f"Status: {run.get('outcome', {}).get('status', 'N/A')}")
    if run.get('outcome', {}).get('error'):
        print(f"Error: {run.get('outcome', {}).get('error')}")
    print(f"Started: {run.get('startedAt', 'N/A')}")
    print(f"Ended: {run.get('endedAt', 'N/A')}")
    print(f"Requester: {run.get('requesterSessionKey', 'N/A')}")
    print(f"Child: {run.get('childSessionKey', 'N/A')}")
    print("---")
