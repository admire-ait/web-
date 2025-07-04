# QAnything & Next.js 课程项目

## 1. 项目简介

本项目是一个基于 **Next.js 14** 构建的现代化、功能丰富的课程作业集成平台。它以 **App Router** 为核心，全面展示了服务器组件（Server Components）、客户端组件（Client Components）以及 API 路由的混合使用范例。

项目集成了两大核心功能：
- **QAnything 智能问答**: 采用 **API 自行开发** 模式，构建了功能完备的前端交互界面，直连 QAnything 服务实现与私有知识库的智能问-答，并支持 **流式响应（Streaming）**，提供了流畅的实时交互体验。
- **WakaTime 编码统计**: 通过后端 API 路由安全调用 WakaTime API，在应用的页脚部分全局、实时地展示个人周度编码活动总时长。

本项目旨在深入实践 Next.js 的核心特性与最佳实践，包括但不限于：组件化开发、TypeScript 强类型约束、Tailwind CSS 工具类优先样式方案、环境变量管理以及与外部服务的安全高效集成。

## 2. QAnything 集成

### 2.1. 路径选择

本项目坚定地选择了 **路径二（API自行开发）** 的方式来集成 QAnything 服务。

**选择原因**:
相比于直接嵌入 HTML 页面，自行开发 API 和前端界面提供了无与伦比的灵活性和可定制性。这种方式不仅是技术上的挑战，更是对产品体验的追求。它能够：
- **创造无缝的用户体验**: 构建与应用整体设计语言完全统一的用户界面，避免了 `iframe` 带来的样式冲突和交互割裂感。
- **实现高级交互功能**: 精准控制 API 请求与响应生命周期，从而实现如加载状态管理、精细化错误处理、消息流式输出等复杂交互逻辑。
- **深化技术理解**: 促使开发者深入理解 QAnything API 的工作机制、认证方式和数据结构，是更具深度和学习价值的实现路径。

### 2.2. 实现细节

#### 前端直连与服务层封装

与通过 Next.js 后端代理不同，本项目采取了在 **客户端直接调用 QAnything API** 的策略，并通过精心设计的服务层 (`src/services/chatService.ts`) 对 API 调用逻辑进行了封装。

- **`chatService.ts`**: 这是一个专门处理与 QAnything API 交互的 TypeScript 类。它封装了所有底层的 `fetch` 请求，包括设置请求头（如 `Authorization`）、构建请求体以及处理流式响应。这种封装使得上层组件的逻辑非常清晰，只需调用如 `chatService.chatWithKnowledgeBase(request)` 这样的高级方法即可，无需关心具体的 HTTP 请求细节。
- **API Key 管理**: 用户的 API Key 在客户端进行配置，并通过 `chatService` 的实例方法 `setApiKey` 进行设置。这使得应用可以支持多用户或动态更换知识库的场景。

#### 前端交互界面与流式响应

前端界面由多个专门的 React 组件构成，共同打造了功能完善的聊天机器人体验。
- **`chat-dashboard.tsx`**: 作为聊天功能的顶层容器，负责整体布局和状态管理。
- **`chat-interface.tsx`**: 核心交互组件，包含了消息输入框、聊天记录展示区以及发送逻辑。它通过异步生成器（`async function*`）优雅地处理了来自 `chatService` 的流式响应。当接收到数据流时，组件会实时地将新的文本块追加到当前消息后面，实现了打字机般的视觉效果，极大地提升了用户体验。
- **状态管理**: 使用 `useState` 和 `useRef` 等 React Hooks 来管理组件状态，如输入内容、消息列表、加载状态和错误信息。

![image-20250630232331348](/Users/night/Documents/Codes/SaltyFish/250530-qanything-all/250530-qanything-2/assets/image-20250630232331348.png)

![image-20250630232339225](/Users/night/Documents/Codes/SaltyFish/250530-qanything-all/250530-qanything-2/assets/image-20250630232339225.png)

![image-20250630232405967](/Users/night/Documents/Codes/SaltyFish/250530-qanything-all/250530-qanything-2/assets/image-20250630232405967.png)

## 3. WakaTime API 集成

### 3.1. 实现方法

为了在应用中安全、高效地全局展示 WakaTime 编码时长，我们采取了 **客户端-服务端分离** 的架构模式：

1.  **安全存储 API Key**: 将 WakaTime 个人 API Key 存储在项目根目录的 `.env.local` 文件中 (`WAKATIME_API_KEY=your_api_key`)。通过 Next.js 的环境变量机制，此密钥仅在服务端可用，杜绝了客户端泄露的风险。
2.  **创建后端 API Route**: 设立一个专门的 API Route (`src/app/api/wakatime/stats/[range]/route.ts`)。这个服务端路由负责接收前端请求，然后携带安全的 API Key 调用真实的 WakaTime API (`https://wakatime.com/api/v1/users/current/stats/...`)。它充当了一个可信的中间代理。
3.  **封装客户端请求**: 在 `src/lib/wakatime-client.ts` 中，我们封装了对上述 Next.js API Route 的请求逻辑。
4.  **创建展示组件**:
    - **`wakatime-stats.tsx`**: 这是一个 **服务器组件（Server Component）**，它在服务端渲染时直接调用 `wakatime-client` 获取数据。这利用了服务器组件的优势，将数据获取和渲染放在了服务器端，减少了客户端的负担。
    - **`wakatime-stats-client.tsx`**: (如果需要更复杂的客户端交互，可以采用此模式) 这是一个客户端组件，它在客户端通过 `useEffect` 和 `fetch` 调用我们的 API Route 来获取数据并展示。
5.  **全局集成**: 将 `WakaTimeStats` 组件集成到全局布局文件 `src/app/layout.tsx` 的页脚部分，确保了编码时长在应用的每一个页面都能一致地展示。

![image-20250630232443153](/Users/night/Documents/Codes/SaltyFish/250530-qanything-all/250530-qanything-2/assets/image-20250630232443153.png)

## 4. Next.js 项目结构与实践

项目采用 Next.js App Router 范式进行组织，结构清晰，职责分明。

```
src/
├── app/                  # App Router 核心目录
│   ├── api/              # 后端 API 路由 (例如 WakaTime 代理)
│   ├── chat/             # QAnything 问答页面 (路由: /chat)
│   ├── homework/         # 课程练习导航/展示页面 (路由: /homework)
│   ├── agents/           # (示例) Agent 管理页面
│   ├── layout.tsx        # 全局根布局，包含<html>和<body>
│   └── page.tsx          # 应用首页 (路由: /)
├── components/           # 可复用的 React 组件
│   ├── chat/             # 问答功能相关组件 (chat-interface, chat-dashboard)
│   ├── knowledge-base/   # 知识库管理相关组件
│   ├── agent/            # Agent 管理相关组件
│   ├── ui/               # 通用基础 UI 组件 (toast, etc.)
│   └── navigation.tsx    # 导航栏组件
├── lib/                  # 辅助函数、客户端 API 封装 (wakatime-client.ts)
├── services/             # 业务服务层 (chatService.ts)
└── types/                # 全局 TypeScript 类型定义 (agent.ts, knowledge-base.ts)
```
**核心实践**:
- **组件化**: 将 UI 拆分为小型、可复用的组件，提高了代码的可维护性和复用性。
- **TypeScript**: 全程使用 TypeScript，为项目提供了强类型支持，减少了运行时错误。
- **Tailwind CSS**: 采用工具类优先的 CSS 框架，实现了快速、一致的 UI 开发。

## 5. 旧作业整合方式

本学期的所有课程练习都被精心整合到了 `/homework` 路由之下。我们为每一个练习创建了独立的页面或组件，并通过一个导航页面进行索引，方便访问和演示。

例如，`public` 目录下存放了静态的 HTML 作业 (`第一次.html`, `第三次.html`)。在 `src/app/homework/page.tsx` 中，我们创建了一个链接列表，分别指向这些静态文件，从而将它们无缝集成到 Next.js 应用中。对于更复杂的、基于 React 的练习，则为其创建专门的子路由（如 `/homework/exercise-react`）。

这种整合方式不仅集中展示了学习成果，也体现了 Next.js 强大的静态资源处理和路由管理能力。

![image-20250630232422934](/Users/night/Documents/Codes/SaltyFish/250530-qanything-all/250530-qanything-2/assets/image-20250630232422934.png)

![image-20250630232429369](/Users/night/Documents/Codes/SaltyFish/250530-qanything-all/250530-qanything-2/assets/image-20250630232429369.png)

## 6. 项目运行指南

1.  **克隆仓库**
    ```bash
    git clone https://github.com/your-username/your-repo-name.git
    cd your-repo-name
    ```

2.  **安装依赖**
    项目使用 `npm` 作为包管理器。
    ```bash
    npm install
    ```

3.  **配置环境变量**
    在项目根目录创建 `.env.local` 文件，并填入必要的环境变量。这是项目正常运行的关键。
    ```env
    # WakaTime API Key (必需)
    # 从 https://wakatime.com/settings/api-key 获取
    WAKATIME_API_KEY="your_wakatime_api_key"
    
    # QAnything 服务的相关信息 (如果前端直连，这些可以在代码中配置，但推荐使用环境变量)
    # NEXT_PUBLIC_ 前缀使这些变量暴露给浏览器
    NEXT_PUBLIC_QANYTHING_API_KEY="your_qanything_api_key"
    NEXT_PUBLIC_QANYTHING_BASE_URL="http://your_qanything_service_url"
    ```

4.  **运行开发服务器**
    ```bash
    npm run dev
    ```
    应用将在 `http://localhost:3000` 上启动。在浏览器中打开此地址即可查看。

5.  **生产环境构建**
    ```bash
    npm run build
    npm start
    ```
