# 流式问答

## 知识库问答（Stream）

知识库问答对话，`text/event-stream` 流式返回回答内容。

> **注意**：如果请求参数 `model` 设置为 `deepseek-lite` 或 `deepseek-pro`，流式返回数据中 `result.response` 会包含 `<think></think>` 和 `<response></response>` 标签。

### 请求示例

```shell
curl --location --request POST 'https://openapi.youdao.com/q_anything/api/chat_stream' \
--header 'Authorization: {{apikey}}' \
--header 'Content-Type: application/json' \
--data-raw '{
    "question": "你是谁",
    "kbIds": ["KB248e8e079642491383596f63c2ab069a_240430"],
    "prompt": "",
    "history": [{ "question": "你好", "response": "嗯，你好。" }],
    "model": "QAnything 4o mini",
    "maxToken": "1024",
    "hybridSearch": "false",
    "networking": "true",
    "sourceNeeded": "true"
}'
```

### 参数说明

| 参数         | 类型   | 必填 | 说明             |
| ------------ | ------ | ---- | ---------------- |
| question     | string | 是   | 用户问题         |
| kbIds        | array  | 是   | 知识库 ID 数组   |
| prompt       | string | 否   | 自定义提示词     |
| history      | array  | 否   | 历史对话记录     |
| model        | string | 是   | 模型名称         |
| maxToken     | string | 是   | 最大 Token 数    |
| hybridSearch | string | 是   | 是否启用混合搜索 |
| networking   | string | 是   | 是否启用网络搜索 |
| sourceNeeded | string | 是   | 是否需要来源     |

### 响应示例

（响应示例内容）

## Agents 问答（Stream）

Agents 问答对话，`text/event-stream` 流式返回回答内容。

> **注意**：如果对应 Agent 的 `model` 参数设置为 `deepseek-lite` 或 `deepseek-pro`（可以通过"查询 Agent 详情"接口查询 Agent 信息），流式返回数据中 `result.response` 会包含 `<think></think>` 和 `<response></response>` 标签。

### 请求示例

```shell
curl --location --request POST 'https://openapi.youdao.com/q_anything/api/bot/chat_stream' \
--header 'Authorization: {{apikey}}' \
--header 'Content-Type: application/json' \
--data-raw '{
    "uuid": "C1BDCFC4F33747E7",
    "question": "你是谁",
    "sourceNeeded": "true",
    "history": [{ "question": "你好", "response": "嗯，你好。" }]
}'
```

### 参数说明

| 参数         | 类型   | 必填 | 说明         |
| ------------ | ------ | ---- | ------------ |
| uuid         | string | 是   | Agent UUID   |
| question     | string | 是   | 用户问题     |
| sourceNeeded | string | 是   | 是否需要来源 |
| history      | array  | 否   | 历史对话记录 |

### 响应示例

（响应示例内容）