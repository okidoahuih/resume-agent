import Foundation
import SwiftData

enum JobStage: String, Codable, CaseIterable { case todo = "待查看", interested = "感兴趣", contacting = "待沟通", contacted = "已沟通", applied = "已投递", replied = "已回复", interview = "面试", rejected = "已拒绝" }

@Model final class ResumeProfile {
    var id: UUID = UUID(); var name: String = "主简历"; var fileName: String = ""; var sourceText: String = ""; var skills: [String] = []; var highlights: [String] = []; var isPrimary: Bool = true; var updatedAt: Date = .now
    init(name: String = "主简历", fileName: String = "", sourceText: String = "", skills: [String] = [], highlights: [String] = [], isPrimary: Bool = true) { self.name = name; self.fileName = fileName; self.sourceText = sourceText; self.skills = skills; self.highlights = highlights; self.isPrimary = isPrimary }
}

@Model final class JobRecord {
    var id: UUID = UUID(); var title: String = ""; var company: String = ""; var city: String = ""; var salary: String = ""; var experience: String = ""; var industry: String = ""; var detail: String = ""; var sourceURL: String = ""; var score: Int = 0; var reasons: [String] = []; var missingSkills: [String] = []; var risks: [String] = []; var stageRaw: String = JobStage.todo.rawValue; var importedAt: Date = .now; var lastContactAt: Date?
    var stage: JobStage { get { JobStage(rawValue: stageRaw) ?? .todo } set { stageRaw = newValue.rawValue } }
    init(title: String = "", company: String = "", city: String = "", salary: String = "", detail: String = "", sourceURL: String = "") { self.title = title; self.company = company; self.city = city; self.salary = salary; self.detail = detail; self.sourceURL = sourceURL }
}

@Model final class ApplicationEvent { var id: UUID = UUID(); var jobID: UUID; var stageRaw: String; var createdAt: Date = .now; var note: String = ""; init(jobID: UUID, stage: JobStage, note: String = "") { self.jobID = jobID; self.stageRaw = stage.rawValue; self.note = note } }

@Model final class UserPreferences { var id: UUID = UUID(); var targetRole: String = ""; var cities: String = ""; var salaryRange: String = ""; var years: String = ""; var industries: String = ""; var exclusions: String = "外包,大小周,纯销售"; var dailyLimit: Int = 8; var minIntervalMinutes: Int = 3; var aiEnabled: Bool = false; var remindersEnabled: Bool = true; init() {} }
