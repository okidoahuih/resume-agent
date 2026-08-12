import Foundation
import PDFKit
import Vision

struct ResumeParser {
    func parse(url: URL) async throws -> (text: String, skills: [String], highlights: [String]) {
        let ext = url.pathExtension.lowercased()
        let text: String
        if ext == "pdf", let document = PDFDocument(url: url) { text = document.string ?? "" }
        else if ext == "txt" { text = try String(contentsOf: url, encoding: .utf8) }
        else if ext == "docx" { text = try parseDOCX(url: url) }
        else { text = "" }
        return (text, extractSkills(from: text), extractHighlights(from: text))
    }
    private func parseDOCX(url: URL) throws -> String {
        let data = try Data(contentsOf: url)
        let archive = try ZipReader(data: data)
        return archive.text(for: "word/document.xml").replacingOccurrences(of: "<[^>]+>", with: " ", options: .regularExpression)
    }
    private func extractSkills(from text: String) -> [String] { let known = ["Swift", "SwiftUI", "Python", "Java", "JavaScript", "SQL", "产品设计", "用户增长", "数据分析", "项目管理", "AI", "机器学习"]; return known.filter { text.localizedCaseInsensitiveContains($0) } }
    private func extractHighlights(from text: String) -> [String] { text.split(whereSeparator: { $0 == "\n" || $0 == "。" }).map(String.init).filter { $0.count > 12 }.prefix(5).map { $0.trimmingCharacters(in: .whitespacesAndNewlines) } }
}

// 轻量 DOCX 读取占位实现；生产版建议引入 ZIPFoundation Swift Package。
private struct ZipReader { let data: Data; init(data: Data) throws { self.data = data }; func text(for _: String) -> String { String(data: data, encoding: .utf8) ?? "" } }
