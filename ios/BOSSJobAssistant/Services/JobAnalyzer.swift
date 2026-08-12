import Foundation

struct JobAnalysis { let score: Int; let reasons: [String]; let missingSkills: [String]; let risks: [String] }

struct JobAnalyzer {
    func analyze(job: JobRecord, resume: ResumeProfile?, preferences: UserPreferences) -> JobAnalysis {
        let text = (job.title + " " + job.detail).lowercased(); let skills = resume?.skills ?? []
        let skillHits = skills.filter { text.contains($0.lowercased()) }.count
        let skillScore = skills.isEmpty ? 20 : Int((Double(skillHits) / Double(max(skills.count, 1))) * 40)
        let roleScore = preferences.targetRole.isEmpty || job.title.localizedCaseInsensitiveContains(preferences.targetRole) ? 20 : 8
        let cityScore = preferences.cities.isEmpty || preferences.cities.split(separator: ",").contains(where: { job.city.contains($0) }) ? 15 : 5
        let industryScore = preferences.industries.isEmpty || job.industry.isEmpty ? 15 : (text.contains(preferences.industries.lowercased()) ? 15 : 7)
        let foundRisks = preferences.exclusions.split(separator: ",").map(String.init).filter { text.contains($0.lowercased()) }
        let riskPenalty = min(foundRisks.count * 5, 10); let score = max(0, min(100, skillScore + roleScore + cityScore + industryScore - riskPenalty))
        let missing = skills.filter { !text.contains($0.lowercased()) }.prefix(3)
        return JobAnalysis(score: score, reasons: ["技能命中 (skillHits)/(skills.count)", roleScore >= 15 ? "岗位方向匹配" : "岗位名称需确认", cityScore >= 10 ? "城市符合偏好" : "城市不在首选范围"], missingSkills: Array(missing), risks: foundRisks.isEmpty ? [] : foundRisks.map { "包含排除条件：\($0)" })
    }
    func opening(role: String, company: String, resume: ResumeProfile?, tone: OpeningTone) -> String { let skill = resume?.skills.prefix(2).joined(separator: "、") ?? "相关经验"; switch tone { case .professional: return "您好，我关注到贵司的\(role)岗位。我有\(skill)方面的实践经验，希望有机会结合岗位需求进一步交流。"; case .brief: return "您好，对贵司\(role)很感兴趣，我的\(skill)经验与岗位比较匹配，方便聊聊吗？"; case .positive: return "您好！看到\(company)的\(role)岗位很期待。我在\(skill)方向积累了不少项目经验，期待为团队创造价值。" } }
}
enum OpeningTone: String, CaseIterable { case professional = "专业版", brief = "简洁版", positive = "积极版" }
