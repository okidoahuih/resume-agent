import Foundation
import UserNotifications

struct CSVExporter {
    func csv(jobs: [JobRecord]) -> String {
        var rows = ["职位,公司,城市,薪资,匹配分,状态,导入时间"]
        rows += jobs.map { [ $0.title, $0.company, $0.city, $0.salary, String($0.score), $0.stage.rawValue, ISO8601DateFormatter().string(from: $0.importedAt) ].map { "\"\($0.replacingOccurrences(of: "\"", with: "\"\""))\"" }.joined(separator: ",") }
        return rows.joined(separator: "\n")
    }
}

enum ReminderScheduler {
    static func requestPermission() async -> Bool { (try? await UNUserNotificationCenter.current().requestAuthorization(options: [.alert, .sound, .badge])) ?? false }
    static func scheduleDailyRecommendation(hour: Int = 10) { var date = DateComponents(); date.hour = hour; let trigger = UNCalendarNotificationTrigger(dateMatching: date, repeats: true); let content = UNMutableNotificationContent(); content.title = "今日推荐职位"; content.body = "打开求职助手查看高匹配岗位"; UNUserNotificationCenter.current().add(UNNotificationRequest(identifier: "daily-recommendations", content: content, trigger: trigger)) }
}
