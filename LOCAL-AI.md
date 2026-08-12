# 本地 / Vercel AI 模式

## Vercel 部署（手机无需电脑）

将此仓库导入 Vercel，Framework Preset 选择 **Other**，Build Command 留空，Output Directory 留空，点击 Deploy。Vercel 会自动把 `api/analyze.js` 部署为云函数，网页里的“本地服务器地址”填写部署后的域名，例如 `https://resume-agent-xxx.vercel.app`。

每位用户仍需在网页中填写自己的 OpenAI API Key。Key 通过 HTTPS 临时发送给云函数，不写入 Vercel 环境变量、日志或文件。不要把 Key 放进 URL、GitHub 或代码。

## 启动

需要 Node.js 18+（内置 `fetch`）：

```powershell
npm start
```

默认监听 `0.0.0.0:8000`，同一 Wi‑Fi 下其他设备可访问电脑 IPv4 地址，例如 `http://192.168.1.23:8000`。

## 使用方式

网页里的“AI 分析”会让每位使用者输入自己的 OpenAI API Key。Key 只在浏览器当前会话内保存，随请求发送到本地服务器；服务器不写入文件、不打印、不缓存，收到后仅用于转发到 OpenAI Responses API。不要把 Key 放进代码、GitHub 或 URL。

## 暴露给别人前

局域网测试可以直接使用；公网使用必须加 HTTPS、访问密码/反向代理和限流。电脑关机或 Node 服务停止时，网页仍可使用规则模式，但 AI 分析不可用。
