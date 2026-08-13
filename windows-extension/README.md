# Windows 浏览器扩展

这个扩展适用于 Windows 上的 Chrome 或 Edge。它只在你主动点击“导入并自动分析当前页”时，读取当前网页的标题、链接和可见文本，并打开求职助手完成导入和评分。

它不会后台扫描页面、读取其他标签页、登录 BOSS、点击沟通/投递按钮或处理验证码。

## 安装（开发者模式）

1. 在 Chrome 打开 `chrome://extensions`，或在 Edge 打开 `edge://extensions`。
2. 开启右上角的“开发人员模式”。
3. 点击“加载已解压的扩展”。
4. 选择本目录：`windows-extension`。
5. 打开 BOSS 的一个职位详情页，点击浏览器工具栏中的“求职助手 - 导入当前职位”图标。
6. 点击“导入并自动分析当前页”。浏览器会打开 Vercel 版求职助手，职位将自动进入评分流程。

默认网址是 `https://resume-agent-lemon.vercel.app`。如果将来更换 Vercel 域名，可以在扩展弹窗中修改。
