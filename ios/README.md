# iOS 工程落地说明

当前仓库包含可直接粘贴到 Xcode 的 SwiftUI/SwiftData MVP 源码。创建 Xcode 15+ iOS App（iOS 17+、SwiftUI、SwiftData），将 `BOSSJobAssistant` 目录加入主 target；创建 Share Extension（Action/Share Extension），将 `BOSSJobAssistantShare/ShareViewController.swift` 加入扩展 target。

在主 target 开启：App Groups（分享扩展与主 App 交换导入内容）、iCloud > CloudKit（可选）、Face ID Usage Description、Background Modes 不需要开启。分享扩展的 `Info.plist` 配置 `NSExtensionPointIdentifier=com.apple.share-services`，激活规则支持 URL 和纯文本。

需要在真实工程中补充 PDF/DOCX/Vision 导入 UI、CSV 导出、通知权限请求和 App Group 持久化；本 MVP 已提供模型、评分、文案、看板、Keychain/Face ID 接口和合规跳转边界。
