import SwiftUI
import SwiftData

@main
struct BOSSJobAssistantApp: App {
    var body: some Scene {
        WindowGroup { ContentView() }
            .modelContainer(for: [ResumeProfile.self, JobRecord.self, ApplicationEvent.self, UserPreferences.self])
    }
}
