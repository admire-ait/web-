# Agent 管理

## 创建 Agent

### 请求示例

```shell
curl --location --request POST 'https://openapi.youdao.com/q_anything/api/bot/create' \
--header 'Authorization: {{apikey}}' \
--header 'Content-Type: application/json' \
--data-raw '{
    "kbIds":["KB248e8e079642491383596f63c2ab069a_240430"],
    "botName": "产品客服",
    "botDescription": "解答用户对产品的问题",
    "model": "QAnything 4o mini",
    "maxToken": "1024",
    "hybridSearch": "false",
    "networking": "true",
    "needSource": "true",
    "botPromptSetting":"你是一个XXX专家。",
    "welcomeMessage": "您好，我是您的专属机器人，请问有什么可以帮您呢？\n[介绍一下你的功能]\n[你能提供什么服务]"
}'
```

### 参数说明

| 参数             | 类型   | 必填 | 说明             |
| ---------------- | ------ | ---- | ---------------- |
| kbIds            | array  | 是   | 知识库 ID 数组   |
| botName          | string | 是   | Agent 名称       |
| botDescription   | string | 是   | Agent 描述       |
| model            | string | 是   | 模型名称         |
| maxToken         | string | 是   | 最大 Token 数    |
| hybridSearch     | string | 是   | 是否启用混合搜索 |
| networking       | string | 是   | 是否启用网络搜索 |
| needSource       | string | 是   | 是否需要来源     |
| botPromptSetting | string | 否   | Agent 提示设置   |
| welcomeMessage   | string | 否   | 欢迎消息         |

### 响应示例

（响应示例内容）

## 更新 Agent

> **注意**：更新 Agent 接口不支持绑定/解绑知识库。

### 请求示例

```shell
curl --location --request POST 'https://openapi.youdao.com/q_anything/api/bot/update' \
--header 'Authorization: {{apikey}}' \
--header 'Content-Type: application/json' \
--data-raw '{
    "uuid": "C1BDCFC4F33747E7",
    "botName": "产品客服2",
    "botDescription": "可以解答用户对产品的问题",
    "model": "QAnything 16k",
    "maxToken": "4096",
    "hybridSearch": "true",
    "networking": "true",
    "needSource": "true",
    "botPromptSetting":"你是一个XXX专家。",
    "welcomeMessage": "您好，我是您的专属机器人，请问有什么可以帮您呢？\n[介绍一下你的功能]\n[你能提供什么服务]"
}'
```

### 参数说明

| 参数             | 类型   | 必填 | 说明             |
| ---------------- | ------ | ---- | ---------------- |
| uuid             | string | 是   | Agent UUID       |
| botName          | string | 是   | Agent 名称       |
| botDescription   | string | 是   | Agent 描述       |
| model            | string | 是   | 模型名称         |
| maxToken         | string | 是   | 最大 Token 数    |
| hybridSearch     | string | 是   | 是否启用混合搜索 |
| networking       | string | 是   | 是否启用网络搜索 |
| needSource       | string | 是   | 是否需要来源     |
| botPromptSetting | string | 否   | Agent 提示设置   |
| welcomeMessage   | string | 否   | 欢迎消息         |

### 响应示例

（响应示例内容）

## 删除 Agent

### 请求示例

```shell
curl --location --request POST 'https://openapi.youdao.com/q_anything/api/bot/delete' \
--header 'Authorization: {{apikey}}' \
--header 'Content-Type: application/json' \
--data-raw '{
    "uuid": "C1BDCFC4F33747E7"
}'
```

### 参数说明

| 参数 | 类型   | 必填 | 说明       |
| ---- | ------ | ---- | ---------- |
| uuid | string | 是   | Agent UUID |

### 响应示例

（响应示例内容）

## 查询 Agents 列表

### 请求示例

```shell
curl --location --request GET 'https://openapi.youdao.com/q_anything/api/bot/list' \
--header 'Authorization: {{apikey}}'
```

### 响应示例

（响应示例内容）

## Agent 绑定知识库

> **注意**：单个 Agent 最多绑定 100 个知识库，如果当前请求中新增绑定的知识库 + 已经绑定的知识库 > 100，当前绑定操作会失败。

### 请求示例

```shell
curl --location --request POST 'https://openapi.youdao.com/q_anything/api/bot/bindKbs' \
--header 'Authorization: {{apikey}}' \
--header 'Content-Type: application/json' \
--data-raw '{
    "uuid": "489DA044XXXXXXXX",
    "kbIds": [
        "KB1283228f8f054299a639b5b22e91XXXX_240430",
        "KB031fcea9ca6c457783bf8030fb0cXXXX_240430",
        "KB5c87bb08eb44401ab3ccf8e9f424XXXX_240430"
    ]
}'
```

### 参数说明

| 参数  | 类型   | 必填 | 说明           |
| ----- | ------ | ---- | -------------- |
| uuid  | string | 是   | Agent UUID     |
| kbIds | array  | 是   | 知识库 ID 数组 |

### 响应示例

（响应示例内容）

## Agent 解绑知识库

### 请求示例

```shell
curl --location --request POST 'https://openapi.youdao.com/q_anything/api/bot/unbindKbs' \
--header 'Authorization: {{apikey}}' \
--header 'Content-Type: application/json' \
--data-raw '{
    "uuid": "489DA044XXXXXXXX",
    "kbIds": [
        "KB1283228f8f054299a639b5b22e91XXXX_240430",
        "KB031fcea9ca6c457783bf8030fb0cXXXX_240430",
        "KB5c87bb08eb44401ab3ccf8e9f424XXXX_240430"
    ]
}'
```

### 参数说明

| 参数  | 类型   | 必填 | 说明           |
| ----- | ------ | ---- | -------------- |
| uuid  | string | 是   | Agent UUID     |
| kbIds | array  | 是   | 知识库 ID 数组 |

### 响应示例

（响应示例内容）

## 查询 Agent 详情

> **注意**：问答秘钥和管理秘钥均可以查询。

### 请求示例

```shell
curl --location --request GET 'https://openapi.youdao.com/q_anything/api/bot/detail?uuid=80981E69F9A34C15' \
--header 'Authorization: {{apikey}}'
```

### 参数说明

| 参数 | 类型   | 必填 | 说明       |
| ---- | ------ | ---- | ---------- |
| uuid | string | 是   | Agent UUID |

### 响应示例

（响应示例内容）
