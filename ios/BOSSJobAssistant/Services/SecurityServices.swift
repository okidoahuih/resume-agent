import Foundation
import LocalAuthentication
import Security
import UIKit

enum PrivacyGate { static func authenticate() async -> Bool { let context = LAContext(); do { return try await context.evaluatePolicy(.deviceOwnerAuthenticationWithBiometrics, localizedReason: "解锁你的简历与求职记录") } catch { return false } } }
enum SecretStore { static func save(_ value: String, key: String) { let data = Data(value.utf8); let query: [String: Any] = [kSecClass as String: kSecClassGenericPassword, kSecAttrAccount as String: key, kSecValueData as String: data]; SecItemDelete(query as CFDictionary); SecItemAdd(query as CFDictionary, nil) }; static func read(key: String) -> String? { let query: [String: Any] = [kSecClass as String: kSecClassGenericPassword, kSecAttrAccount as String: key, kSecReturnData as String: true]; var result: AnyObject?; guard SecItemCopyMatching(query as CFDictionary, &result) == errSecSuccess, let data = result as? Data else { return nil }; return String(data: data, encoding: .utf8) } }
