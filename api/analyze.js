export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Only POST is supported' });
  try {
    const { apiKey, job = '', resume = '', model = 'gpt-5-mini' } = req.body || {};
    if (!/^sk-[A-Za-z0-9_-]{20,}$/.test(String(apiKey || ''))) return res.status(400).json({ error: '请填写有效的 OpenAI API Key' });
    const prompt = `你是求职顾问。请分析以下职位与简历，返回严格 JSON：{"score":0,"reasons":[],"missingSkills":[],"risks":[],"professional":"","brief":"","positive":""}。score 为 0-100；不要编造职位信息。职位：${String(job).slice(0, 20000)}\n简历：${String(resume).slice(0, 20000)}`;
    const upstream = await fetch('https://api.openai.com/v1/responses', { method: 'POST', headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ model, input: prompt, store: false }) });
    const data = await upstream.json();
    if (!upstream.ok) return res.status(upstream.status).json({ error: data?.error?.message || 'OpenAI 请求失败' });
    const text = data.output_text || data.output?.flatMap(x => x.content || []).map(x => x.text || '').join('') || '';
    return res.status(200).json({ result: text });
  } catch (error) { return res.status(500).json({ error: '服务暂时不可用，请稍后重试' }); }
}
