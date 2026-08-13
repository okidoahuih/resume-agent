const $ = (selector) => document.querySelector(selector);
const DEFAULT_URL = 'https://resume-agent-lemon.vercel.app';

async function currentTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab;
}

function encodePayload(payload) {
  const bytes = new TextEncoder().encode(JSON.stringify(payload));
  let binary = '';
  bytes.forEach((byte) => { binary += String.fromCharCode(byte); });
  return btoa(binary);
}

async function inspectCurrentPage() {
  const tab = await currentTab();
  if (!tab?.id || !/^https?:/.test(tab.url || '')) throw new Error('请先打开一个网页职位详情页');
  const [injection] = await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => ({
      title: document.title,
      url: location.href,
      text: (document.body?.innerText || '').replace(/\n{3,}/g, '\n\n').trim().slice(0, 2500)
    })
  });
  if (!injection?.result?.text) throw new Error('没有读取到页面文字，请打开职位详情页后重试');
  return injection.result;
}

async function init() {
  const { assistantUrl = DEFAULT_URL } = await chrome.storage.local.get('assistantUrl');
  $('#assistantUrl').value = assistantUrl;
  try {
    const tab = await currentTab();
    $('#pageInfo').textContent = tab?.title ? `当前页：${tab.title.slice(0, 42)}` : '请打开职位详情页';
  } catch { $('#pageInfo').textContent = '请打开职位详情页'; }
}

$('#importButton').addEventListener('click', async () => {
  const button = $('#importButton');
  const baseUrl = $('#assistantUrl').value.trim().replace(/\/$/, '');
  if (!/^https?:\/\//.test(baseUrl)) { $('#pageInfo').textContent = '请填写有效的求职助手网址'; return; }
  button.disabled = true;
  $('#pageInfo').textContent = '正在导入当前页面…';
  try {
    await chrome.storage.local.set({ assistantUrl: baseUrl });
    const payload = await inspectCurrentPage();
    await chrome.tabs.create({ url: `${baseUrl}/?import=${encodeURIComponent(encodePayload(payload))}` });
    $('#pageInfo').textContent = '已打开求职助手并自动分析';
  } catch (error) {
    $('#pageInfo').textContent = error.message || '导入失败，请重试';
  } finally { button.disabled = false; }
});

init();
