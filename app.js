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
