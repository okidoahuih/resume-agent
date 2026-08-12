const initialJobs=[
  {id:1,company:'星河科技',role:'高级产品经理',city:'上海 · 混合办公',salary:'25–40K · 14薪',tags:['B轮','SaaS','5年以上'],match:96,color:'#6758e8',mark:'星'},
  {id:2,company:'澄明网络',role:'产品负责人',city:'远程 · 北京 / 上海',salary:'30–45K',tags:['AI应用','团队管理','全职'],match:91,color:'#ee7c57',mark:'澄'},
  {id:3,company:'青柠出行',role:'增长产品经理',city:'杭州 · 可远程',salary:'20–32K · 15薪',tags:['用户增长','出行','3年以上'],match:87,color:'#25a36a',mark:'柠'}
];
const state={jobs:JSON.parse(localStorage.getItem('agentJobs')||'null')||initialJobs,sent:Number(localStorage.getItem('agentSent')||8)};
const $=s=>document.querySelector(s);
function renderJobs(){
  $('#jobList').innerHTML=state.jobs.map(j=>`<article class="job"><div class="job-top"><div class="company-logo" style="background:${j.color}">${j.mark}</div><div><h3>${j.role}</h3><div class="company">${j.company} · ${j.city}</div></div><span class="match">${j.match}% 匹配</span></div><div class="tags">${j.tags.map(t=>`<span class="tag">${t}</span>`).join('')}</div><div class="job-bottom"><span class="salary">${j.salary}</span><button class="apply-button ${j.sent?'sent':''}" data-id="${j.id}">${j.sent?'已投递':'确认投递'}</button></div></article>`).join('');
  $('#pendingCount').textContent=state.jobs.filter(j=>!j.sent).length; $('#sentCount').textContent=state.sent;
  document.querySelectorAll('.apply-button').forEach(b=>b.addEventListener('click',()=>apply(Number(b.dataset.id))));
}
function save(){localStorage.setItem('agentJobs',JSON.stringify(state.jobs));localStorage.setItem('agentSent',state.sent)}
function toast(msg){const t=$('#toast');t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2200)}
function apply(id){const job=state.jobs.find(j=>j.id===id);if(!job||job.sent)return;job.sent=true;state.sent++;save();renderJobs();toast(`已加入投递队列：${job.company}`)}
$('#scanButton').addEventListener('click',()=>{const p=$('#scanProgress'),bar=$('#progressBar'),txt=$('#progressText'),btn=$('#scanButton');p.hidden=false;btn.disabled=true;let n=0;const timer=setInterval(()=>{n+=10;bar.style.width=n+'%';txt.textContent=n+'%';if(n>=100){clearInterval(timer);btn.disabled=false;state.jobs=initialJobs.map((j,i)=>({...j,id:Date.now()+i}));save();renderJobs();toast('扫描完成，发现 3 个高匹配岗位');setTimeout(()=>p.hidden=true,500)}},100)});
$('#refreshButton').addEventListener('click',()=>{toast('已是最新岗位');renderJobs()});
document.querySelectorAll('.tab').forEach(tab=>tab.addEventListener('click',()=>{document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));document.querySelectorAll('.panel').forEach(p=>p.classList.remove('active'));tab.classList.add('active');$('#'+tab.dataset.tab+'Panel').classList.add('active')}));
$('#fileButton').addEventListener('click',()=>$('#resumeFile').click());$('#resumeFile').addEventListener('change',e=>{if(e.target.files[0])$('#fileName').textContent=e.target.files[0].name});
$('#profileForm').addEventListener('submit',e=>{e.preventDefault();const data=Object.fromEntries(new FormData(e.target));localStorage.setItem('agentProfile',JSON.stringify(data));toast('资料已保存在本机')});
const profile=JSON.parse(localStorage.getItem('agentProfile')||'null');if(profile)Object.entries(profile).forEach(([k,v])=>{const el=document.querySelector(`[name="${k}"]`);if(el)el.value=v});
renderJobs();

// Local AI bridge: each user supplies their own key; it is never written to localStorage.
(() => {
  const panel = document.createElement('section'); panel.className = 'panel ai-panel'; panel.id = 'aiPanel';
  panel.innerHTML = `<div class="section-heading"><div><h2>AI 职位分析</h2><p>使用你自己的 API Key；本机服务器只临时转发</p></div></div><div class="profile-form"><label>本地服务器地址<input id="aiServer" value="${localStorage.getItem('agentServer') || location.origin}" placeholder="http://192.168.1.23:8000"></label><label>你的 OpenAI API Key<input id="aiKey" type="password" autocomplete="off" placeholder="sk-...（只保存在当前会话）"></label><label>职位描述<textarea id="aiJob" rows="5" placeholder="粘贴 BOSS 职位描述或分享文本"></textarea></label><label>简历摘要<textarea id="aiResume" rows="5" placeholder="粘贴简历摘要（不要放身份证、手机号等无关敏感信息）"></textarea></label><button class="primary-button full" id="aiAnalyze">开始 AI 分析</button></div><pre id="aiResult" class="ai-result" hidden></pre>`;
  document.querySelector('main.shell').insertBefore(panel, document.querySelector('footer'));
  const tabs = document.querySelector('.tabs'); const tab = document.createElement('button'); tab.className = 'tab'; tab.dataset.tab = 'ai'; tab.textContent = 'AI 分析'; tabs.appendChild(tab);
  tab.addEventListener('click', () => { document.querySelectorAll('.tab').forEach(t => t.classList.remove('active')); document.querySelectorAll('.panel').forEach(p => p.classList.remove('active')); tab.classList.add('active'); panel.classList.add('active'); });
  document.querySelector('#aiAnalyze').addEventListener('click', async () => {
    const key = document.querySelector('#aiKey').value.trim(); const server = document.querySelector('#aiServer').value.trim().replace(/\/$/, ''); const job = document.querySelector('#aiJob').value.trim(); const resume = document.querySelector('#aiResume').value.trim(); const out = document.querySelector('#aiResult');
    if (!key || !job) return toast('请填写 API Key 和职位描述'); localStorage.setItem('agentServer', server); out.hidden = false; out.textContent = '分析中…';
    try { const response = await fetch(`${server}/api/analyze`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ apiKey: key, job, resume }) }); const data = await response.json(); if (!response.ok) throw new Error(data.error || '分析失败'); out.textContent = data.result; toast('AI 分析完成'); } catch (error) { out.textContent = `分析失败：${error.message}\n\n电脑端请确认 npm start 正在运行，手机端请填写电脑局域网地址。`; }
  });
})();
