import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const port = Number(process.env.PORT || 8000);
const host = process.env.HOST || '0.0.0.0';
const allowed = new Set(['/', '/index.html', '/styles.css', '/app.js']);

function send(res, status, body, type = 'application/json; charset=utf-8') {
  res.writeHead(status, { 'Content-Type': type, 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Content-Type', 'Access-Control-Allow-Methods': 'POST, OPTIONS, GET' });
  res.end(body);
}
async function body(req) { let raw = ''; for await (const chunk of req) raw += chunk; if (raw.length > 200_000) throw new Error('请求过大'); return JSON.parse(raw || '{}'); }
async function analyze(req, res) {
  const input = await body(req); const apiKey = String(input.apiKey || '');
  if (!/^sk-[A-Za-z0-9_-]{20,}$/.test(apiKey)) return send(res, 400, JSON.stringify({ error: '请填写有效的 OpenAI API Key' }));
  const job = String(input.job || '').slice(0, 20_000); const resume = String(input.resume || '').slice(0, 20_000);
  const prompt = `你是求职顾问。请分析以下职位与简历，返回严格 JSON：{"score":0,"reasons":[],"missingSkills":[],"risks":[],"professional":"","brief":"","positive":""}。score 为 0-100；不要编造职位信息。职位：${job}\n简历：${resume}`;
  const upstream = await fetch('https://api.openai.com/v1/responses', { method: 'POST', headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ model: input.model || 'gpt-5-mini', input: prompt, store: false }) });
  const data = await upstream.json(); if (!upstream.ok) return send(res, upstream.status, JSON.stringify({ error: data?.error?.message || 'OpenAI 请求失败' }));
  const text = data.output_text || data.output?.flatMap(x => x.content || []).map(x => x.text || '').join('') || '';
  send(res, 200, JSON.stringify({ result: text }));
}
const server = http.createServer(async (req, res) => {
  try {
    if (req.method === 'OPTIONS') return send(res, 204, '');
    if (req.method === 'POST' && req.url === '/api/analyze') return await analyze(req, res);
    const url = req.url === '/' ? '/index.html' : req.url;
    if (req.method !== 'GET' || !allowed.has(url)) return send(res, 404, JSON.stringify({ error: 'Not found' }));
    const file = await fs.readFile(path.join(root, url.slice(1))); const type = url.endsWith('.js') ? 'text/javascript; charset=utf-8' : url.endsWith('.css') ? 'text/css; charset=utf-8' : 'text/html; charset=utf-8'; send(res, 200, file, type);
  } catch (error) { send(res, 500, JSON.stringify({ error: error.message || '服务器错误' })); }
});
server.listen(port, host, () => console.log(`Resume Agent running at http://127.0.0.1:${port}`));
