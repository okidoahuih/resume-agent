import UIKit

final class ShareViewController: UIViewController {
    override func viewDidAppear(_ animated: Bool) { super.viewDidAppear(animated); guard let extensionItem = extensionContext?.inputItems.first as? NSExtensionItem, let providers = extensionItem.attachments else { close(); return }; let provider = providers.first(where: { $0.hasItemConformingToTypeIdentifier("public.url") || $0.hasItemConformingToTypeIdentifier("public.text") }); provider?.loadItem(forTypeIdentifier: "public.url", options: nil) { [weak self] item, _ in let value = (item as? URL)?.absoluteString ?? (item as? String) ?? ""; UIPasteboard.general.string = value; self?.close() } }
    private func close() { extensionContext?.completeRequest(returningItems: nil) }
}
