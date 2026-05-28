const S = { step:1, done:new Set() };
const nao = {};
const LEVELS = [[0,'Iniciante'],[20,'Planejador'],[40,'Estrategista'],[60,'Especialista'],[80,'Expert'],[100,'Mestre ✓']];
let planData = null;

function getLevel(p){ let l=LEVELS[0][1]; for(const [t,n] of LEVELS) if(p>=t) l=n; return l; }
function updateXP(){ const p=Math.round((S.done.size/5)*100); document.getElementById('xpFill').style.width=p+'%'; document.getElementById('xpPct').textContent=p+'%'; document.getElementById('levelLbl').textContent=getLevel(p); }

function onCanalChange(){
  const canal = (document.querySelector('input[name="canal"]:checked')||{}).value||'';
  const showMeta   = canal==='Meta Ads'||canal==='Ambos';
  const showGoogle = canal==='Google Ads'||canal==='Ambos';
  document.getElementById('grp_budgetMeta').style.display   = showMeta   ? 'block' : 'none';
  document.getElementById('grp_budgetGoogle').style.display = showGoogle ? 'block' : 'none';
}

function goStep(n){
  if(n>1&&!S.done.has(n-1)&&S.step!==n) return;
  document.querySelectorAll('.sp').forEach(p=>p.classList.remove('active'));
  document.getElementById('panel'+n).classList.add('active');
  for(let i=1;i<=5;i++){
    const b=document.getElementById('sBtn'+i);
    b.className='s-btn';
    if(S.done.has(i)){ b.classList.add('done'); b.onclick=()=>goStep(i); }
    else if(i===n){ b.classList.add('active'); b.onclick=()=>goStep(i); }
    else if(S.done.has(i-1)||i<n){ b.onclick=()=>goStep(i); }
    else{ b.classList.add('locked'); b.onclick=null; }
  }
  S.step=n; window.scrollTo({top:0,behavior:'smooth'});
}

function next(step){
  if(!validate(step)) return;
  S.done.add(step); updateXP();
  if(step<5) goStep(step+1);
}

function validate(step){
  const req={1:['nomeClinica','especialidade','procedimentoAlvo'],2:['pubMomento'],3:['barreiraO'],4:[],5:['proximoPasso']};
  let ok=true;
  (req[step]||[]).forEach(id=>{
    const el=document.getElementById(id),er=document.getElementById('err_'+id);
    if(!el||!el.value.trim()){ if(el) el.classList.add('has-err'); if(er) er.classList.add('show'); ok=false; }
    else{ el.classList.remove('has-err'); if(er) er.classList.remove('show'); }
  });
  if(step===4){
    const canal=(document.querySelector('input[name="canal"]:checked')||{}).value||'';
    const ce=document.getElementById('err_canal');
    if(!canal){ ce.classList.add('show'); ok=false; } else ce.classList.remove('show');
    const showMeta   = canal==='Meta Ads'||canal==='Ambos';
    const showGoogle = canal==='Google Ads'||canal==='Ambos';
    const check4 = ['oferta','metaPacientes','cplEstimado'];
    if(showMeta)   check4.push('budgetMeta');
    if(showGoogle) check4.push('budgetGoogle');
    check4.forEach(id=>{
      const el=document.getElementById(id),er=document.getElementById('err_'+id);
      if(!el||!el.value.trim()){ if(el) el.classList.add('has-err'); if(er) er.classList.add('show'); ok=false; }
      else{ el.classList.remove('has-err'); if(er) er.classList.remove('show'); }
    });
  }
  if(!ok){ const f=document.querySelector('#panel'+step+' .has-err'); if(f) f.scrollIntoView({behavior:'smooth',block:'center'}); }
  return ok;
}

document.querySelectorAll('input,textarea').forEach(el=>{
  el.addEventListener('input',()=>{ el.classList.remove('has-err'); const er=document.getElementById('err_'+el.id); if(er) er.classList.remove('show'); });
});

function toggleNao(inputId,btnId){
  const inp=document.getElementById(inputId),btn=document.getElementById(btnId);
  if(nao[inputId]){ nao[inputId]=false; btn.classList.remove('on'); inp.classList.remove('nao-off'); if(inp.dataset.prev!==undefined) inp.value=inp.dataset.prev; }
  else{ nao[inputId]=true; inp.dataset.prev=inp.value; inp.value=''; btn.classList.add('on'); inp.classList.add('nao-off'); }
}

function v(id){ const el=document.getElementById(id); return el?(el.value||'').trim():''; }
function num(id){ return parseFloat(v(id))||0; }
function fld(label,value,na){ return `<div class="pf"><div class="pf-lbl">${label}</div><div class="pf-val${na?' na':''}">${value||'—'}</div></div>`; }
function secTitle(num,label){ return `<div class="plan-sec-title"><span class="plan-sec-num">${num}</span>${label}</div>`; }
function cl(items){ return `<ul class="cl">${items.map(i=>`<li>${i}</li>`).join('')}</ul>`; }
function currency(n){ return 'R$ '+n.toLocaleString('pt-BR'); }
function slug(s){ return s.toLowerCase().replace(/\s+/g,'-').replace(/[^a-z0-9-]/g,''); }

function buildPlan(){
  if(!validate(5)) return;
  S.done.add(5); updateXP();

  const canal  = (document.querySelector('input[name="canal"]:checked')||{}).value||'';
  const genero = (document.querySelector('input[name="genero"]:checked')||{}).value||'Todos';
  const showMeta   = canal==='Meta Ads'||canal==='Ambos';
  const showGoogle = canal==='Google Ads'||canal==='Ambos';

  const bMeta   = num('budgetMeta');
  const bGoogle = num('budgetGoogle');
  const bTotal  = bMeta + bGoogle;
  const bMetaM  = bMeta * 30;
  const bGoogleM= bGoogle * 30;
  const bTotalM = bTotal * 30;
  const cpl     = num('cplEstimado');
  const meta    = num('metaPacientes');
  const leadsM  = cpl > 0 ? Math.round(bTotalM / cpl) : 0;
  const convNec = leadsM > 0 ? ((meta / leadsM) * 100).toFixed(1) : '—';
  const cpa     = meta > 0 ? (bTotalM / meta).toFixed(0) : '—';

  const d = {
    nome:    v('nomeClinica'),
    esp:     v('especialidade'),
    proc:    v('procedimentoAlvo'),
    ig:      nao['instagram']  ?'Não tenho':(v('instagram')||'Não informado'),
    lp:      nao['landingPage']?'Não tenho':(v('landingPage')||'Não informado'),
    gmb:     nao['gmb']        ?'Não tenho':(v('gmb')||'Não informado'),
    idade:   v('pubIdade')||'Não informado',
    genero,
    bairro:  v('pubBairro')||'Rio de Janeiro',
    momento: v('pubMomento'),
    porque:  v('pubPorque')||'Não informado',
    barO:    v('barreiraO'),
    barS:    v('barreiraSolucao')||'Não informado',
    canal, oferta: v('oferta'),
    prazo:   v('prazoLancamento')||'A definir',
    meta, cpl, leadsM, convNec, cpa,
    bMeta, bGoogle, bTotal, bMetaM, bGoogleM, bTotalM,
    passo:   v('proximoPasso'),
    date:    new Date().toLocaleDateString('pt-BR',{day:'2-digit',month:'long',year:'numeric'})
  };

  planData = d;
  document.getElementById('barName').textContent = d.nome;

  const pillsHtml = [
    showMeta   ?'<span class="plan-hero-pill">📘 Meta Ads</span>':'',
    showGoogle ?'<span class="plan-hero-pill">🔍 Google Ads</span>':'',
    '<span class="plan-hero-pill">📍 Google Meu Negócio</span>'
  ].filter(Boolean).join('');

  let kpiHtml = '';
  if(showMeta && showGoogle){
    kpiHtml = `
      <div class="kpi meta"><div class="kpi-v">${currency(d.bMeta)}</div><div class="kpi-l">Meta Ads / Dia</div></div>
      <div class="kpi google"><div class="kpi-v">${currency(d.bGoogle)}</div><div class="kpi-l">Google Ads / Dia</div></div>
      <div class="kpi total"><div class="kpi-v">${currency(d.bTotal)}</div><div class="kpi-l">Total / Dia</div></div>
      <div class="kpi total"><div class="kpi-v">${currency(d.bTotalM)}</div><div class="kpi-l">Total / Mês</div></div>`;
  } else if(showMeta){
    kpiHtml = `
      <div class="kpi meta"><div class="kpi-v">${currency(d.bMeta)}</div><div class="kpi-l">Meta Ads / Dia</div></div>
      <div class="kpi meta"><div class="kpi-v">${currency(d.bMetaM)}</div><div class="kpi-l">Meta Ads / Mês</div></div>`;
  } else {
    kpiHtml = `
      <div class="kpi google"><div class="kpi-v">${currency(d.bGoogle)}</div><div class="kpi-l">Google Ads / Dia</div></div>
      <div class="kpi google"><div class="kpi-v">${currency(d.bGoogleM)}</div><div class="kpi-l">Google Ads / Mês</div></div>`;
  }

  const projHtml = `
    <div class="proj-row">
      <div class="proj-title">Projeção de Resultados — 30 Dias</div>
      <div class="proj-grid">
        <div class="proj-item"><div class="proj-v highlight">${d.leadsM}</div><div class="proj-l">Leads Projetados / Mês</div></div>
        <div class="proj-item"><div class="proj-v">${d.meta}</div><div class="proj-l">Meta de Pacientes</div></div>
        <div class="proj-item"><div class="proj-v">${d.convNec}%</div><div class="proj-l">Taxa de Conversão Necessária</div></div>
        <div class="proj-item"><div class="proj-v">${currency(parseFloat(d.cpa)||0)}</div><div class="proj-l">CPA Alvo Estimado</div></div>
      </div>
    </div>`;

  const html = `
    <div class="plan-hero">
      <div class="plan-inner">
        <div class="plan-hero-flex">
          <div>
            <div class="plan-hero-tag">Plano de Ação Digital</div>
            <div class="plan-hero-title">${d.nome}</div>
            <div class="plan-hero-sub">${d.esp} · Captação de novos pacientes</div>
            <div class="plan-hero-pills">${pillsHtml}</div>
          </div>
          <div class="plan-hero-meta">
            <div class="plan-hero-date">${d.date}</div>
            <div class="plan-hero-agency">Elaborado por Vértice Rio</div>
          </div>
        </div>
      </div>
    </div>

    <div class="plan-body">

      <div class="plan-sec"><div class="plan-inner">
        ${secTitle('01','Perfil do Negócio')}
        <div class="pg3">${fld('Especialidade',d.esp)}${fld('Procedimento / Serviço Alvo',d.proc)}${fld('Canal Prioritário',d.canal)}</div>
        <div class="pg3" style="margin-top:10px;">${fld('Instagram',d.ig,d.ig==='Não tenho')}${fld('Landing Page',d.lp,d.lp==='Não tenho')}${fld('Google Meu Negócio',d.gmb,d.gmb==='Não tenho')}</div>
      </div></div>

      <div class="plan-sec"><div class="plan-inner">
        ${secTitle('02','Análise do Público-Alvo')}
        <div class="pg3" style="margin-bottom:12px;">${fld('Faixa Etária',d.idade)}${fld('Gênero',d.genero)}${fld('Região Alvo',d.bairro)}</div>
        <div class="pg2">${fld('Momento de Vida / Motivação de Contato',d.momento)}${fld('Por Que Precisa Desse Procedimento',d.porque)}</div>
      </div></div>

      <div class="plan-sec"><div class="plan-inner">
        ${secTitle('03','Barreiras de Conversão')}
        <div class="pg2">${fld('O Que Poderia Fazer Desistir da Consulta',d.barO)}${fld('Como Contornar Essas Barreiras',d.barS)}</div>
      </div></div>

      <div class="plan-sec"><div class="plan-inner">
        ${secTitle('04','Estratégia e Projeção')}
        <div class="kpi-row">${kpiHtml}</div>
        ${projHtml}
        <div class="pg3">${fld('Oferta Principal',d.oferta)}${fld('CPL Estimado',currency(d.cpl))}${fld('Prazo para 1ª Campanha',d.prazo)}</div>
      </div></div>

      ${showMeta ? `
      <div class="plan-sec"><div class="plan-inner">
        <div class="pplatform meta">📘 &nbsp;Meta Ads — Plano de Ação</div>
        <div class="pg2">
          <div>
            ${fld('Budget',`${currency(d.bMeta)}/dia · ${currency(d.bMetaM)}/mês`)}
            ${fld('Objetivo de Campanha','Geração de Leads (formulário ou mensagem)')}
            ${fld('Estrutura',`CBO · 1 conjunto de anúncios · 3 variações`)}
            ${fld('Segmentação',`${d.genero!=='Todos'?d.genero+' · ':''}${d.idade!=='Não informado'?d.idade+' · ':''}${d.bairro}`)}
            ${fld('Hook de Copy',`Baseado em: "${d.momento.substring(0,80)}${d.momento.length>80?'...':'"'}`)}
          </div>
          <div>
            <div class="pf"><div class="pf-lbl">Pré-requisitos Técnicos</div></div>
            ${cl([
              'Criar / auditar Business Portfolio e conta de anúncios',
              'Instalar Pixel Meta na landing page',
              'Configurar evento <strong>Lead</strong> e testar com Pixel Helper',
              'Vincular conta de Instagram à página',
              'Produzir 3 criativos: Reels + Feed estático + Stories',
              'Configurar UTMs por criativo para rastreamento',
              'Verificar domínio no Meta Business Manager',
              'Ativar campanha com budget de teste de 7 dias'
            ])}
          </div>
        </div>
      </div></div>` : ''}

      ${showGoogle ? `
      <div class="plan-sec"><div class="plan-inner">
        <div class="pplatform google">🔍 &nbsp;Google Ads — Plano de Ação</div>
        <div class="pg2">
          <div>
            ${fld('Budget',`${currency(d.bGoogle)}/dia · ${currency(d.bGoogleM)}/mês`)}
            ${fld('Tipo de Campanha','Search — captura intenção declarada')}
            ${fld('Keywords Prioritárias',[`"${d.proc} ${d.bairro}"`,`"${d.esp} ${d.bairro}"`,`"${d.proc} perto de mim"`,`"melhor ${d.esp} ${d.bairro}"`].join(' · '))}
            ${fld('Bid Strategy (fase inicial)','Maximize Conversions — sem tCPA inicial')}
            ${fld('Extensões Recomendadas','Ligação · Localização · Sitelinks · Callouts')}
          </div>
          <div>
            <div class="pf"><div class="pf-lbl">Checklist de Ativação</div></div>
            ${cl([
              'Criar conta Google Ads e vincular ao GA4',
              'Instalar tag de conversão na landing page',
              'Configurar GCLID capture e campos hidden no formulário',
              'Criar Responsive Search Ad (15 headlines · 4 descriptions)',
              'Adicionar extensões: ligação, localização, sitelinks, callouts',
              'Configurar lista de negativas: gratuito, curso, emprego',
              `Geo-targeting: ${d.bairro} (PRESENCE only)`,
              'Ativar com Maximize Conversions'
            ])}
          </div>
        </div>
      </div></div>` : ''}

      <div class="plan-sec"><div class="plan-inner">
        <div class="pplatform gmb">📍 &nbsp;Google Meu Negócio — Plano de Ação</div>
        <div class="pg2">
          <div>
            ${fld('Status Atual', d.gmb==='Não tenho'?'Perfil ainda não criado — criação é o primeiro passo':`Perfil existente: ${d.gmb} — otimização e posts regulares`)}
            <div class="pf"><div class="pf-lbl">Passos de Otimização</div></div>
            ${cl(d.gmb==='Não tenho'?[
              'Criar perfil em business.google.com',
              `Selecionar categoria: <strong>${d.esp}</strong>`,
              'Adicionar endereço, telefone e horário',
              'Upload de 10+ fotos (fachada, equipe, consultório)',
              `Descrição mencionando "${d.proc}" e "${d.oferta}"`,
              'Publicar primeiro Post com a oferta da campanha',
              'Solicitar avaliação dos próximos 5 pacientes'
            ]:[
              `Auditar completude: foto, descrição, horário, telefone`,
              `Atualizar categoria para <strong>${d.esp}</strong>`,
              `Adicionar "${d.proc}" como serviço`,
              'Publicar Post semanal com oferta ou conteúdo educativo',
              'Responder avaliações pendentes em até 24h',
              'Verificar vinculação ao Google Ads',
              'Solicitar avaliação ativa dos próximos pacientes'
            ])}
          </div>
          <div>
            ${fld('Por Que o GMB É Estratégico','Pacientes com intenção local buscam no Google antes de ligar. Um perfil otimizado gera visitas orgânicas sem custo de mídia — reforça qualquer campanha paga.')}
            ${fld('Frequência de Posts','1 post/semana com oferta ou conteúdo educativo. Responder avaliações em até 24h para sinal positivo ao algoritmo.')}
          </div>
        </div>
      </div></div>

    </div>

    <div class="plan-commit">
      <div class="plan-inner">
        <div class="plan-commit-tag">⏱ Compromisso — Próximos 10 Dias</div>
        <div class="plan-commit-lbl">Próximo passo concreto</div>
        <div class="plan-commit-text">${d.passo}</div>
      </div>
    </div>

    <div class="plan-criteria">
      <div class="plan-inner">
        <div class="plan-criteria-inner">
          <div class="plan-criteria-lbl">Critério de Escala — Dia 30</div>
          <div class="plan-criteria-text">Se o CPA real ficar abaixo de <strong style="color:#c9a46a;">${currency(parseFloat(d.cpa)||0)}</strong> e pelo menos <strong style="color:#c9a46a;">${Math.ceil(d.meta*0.5)} pacientes</strong> forem captados, escalar o budget em 20%. Se o CPA estiver acima, revisar criativo e segmentação antes de aumentar a verba.</div>
        </div>
      </div>
    </div>

    <div class="plan-footer">
      <div class="plan-footer-inner">
        <span><strong>Vértice Rio</strong> · Plano de Ação Digital · Confidencial</span>
        <span>${d.nome}</span>
      </div>
    </div>
  `;

  document.getElementById('planContent').innerHTML = html;
  document.getElementById('formWrap').style.display  = 'none';
  document.getElementById('resultsView').style.display = 'block';
  for(let i=1;i<=5;i++){ const b=document.getElementById('sBtn'+i); b.className='s-btn done'; b.onclick=()=>showFormAt(i); }
  window.scrollTo({top:0,behavior:'smooth'});
  launchConfetti();
}

function showFormAt(step){ document.getElementById('resultsView').style.display='none'; document.getElementById('formWrap').style.display='block'; goStep(step); window.scrollTo({top:0,behavior:'smooth'}); }
function printPlan(){ window.print(); }

async function sharePDF(){
  const btn = document.getElementById('waBtn');
  btn.disabled = true;
  btn.textContent = '⏳ Gerando PDF...';
  try {
    const content = document.getElementById('planContent');
    const fname = planData ? `plano-acao-${slug(planData.nome)}.pdf` : 'plano-acao.pdf';
    const pdf = await html2pdf().set({
      margin: 0,
      filename: fname,
      image: { type:'jpeg', quality:0.92 },
      html2canvas: { scale:2, useCORS:true, logging:false, backgroundColor:'#f0e9dc' },
      jsPDF: { unit:'px', format:'a4', orientation:'portrait', hotfixes:['px_scaling'] },
      pagebreak: { mode:['css','legacy'] }
    }).from(content).outputPdf('blob');

    const file = new File([pdf], fname, { type:'application/pdf' });

    if(navigator.canShare && navigator.canShare({files:[file]})){
      await navigator.share({ files:[file], title:'Plano de Ação Digital — '+(planData?.nome||''), text:'Segue seu plano elaborado por Vértice Rio.' });
      showToast('PDF compartilhado com sucesso!');
    } else {
      const url = URL.createObjectURL(pdf);
      const a = document.createElement('a'); a.href=url; a.download=fname; a.click();
      URL.revokeObjectURL(url);
      setTimeout(()=>{ window.open('https://api.whatsapp.com/send?text='+encodeURIComponent('Segue o Plano de Ação Digital — '+(planData?.nome||'')+'. Em anexo o PDF elaborado por Vértice Rio 📊')); }, 800);
      showToast('PDF baixado! Envie o arquivo pelo WhatsApp.');
    }
  } catch(err){
    if(err.name !== 'AbortError') showToast('Use o botão Imprimir para salvar o PDF.');
  } finally {
    btn.disabled = false;
    btn.textContent = '💬 Compartilhar no WhatsApp';
  }
}

function showToast(msg){
  const t = document.createElement('div');
  t.className = 'toast';
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(()=>{ t.style.opacity='0'; t.style.transition='opacity .3s'; setTimeout(()=>t.remove(),300); }, 3500);
}

function restart(){
  document.querySelectorAll('input[type="text"],input[type="number"],textarea').forEach(el=>{ el.value=''; el.classList.remove('has-err','nao-off'); });
  document.querySelectorAll('input[type="radio"]').forEach(el=>el.checked=false);
  ['instagram','landingPage','gmb'].forEach(k=>{ nao[k]=false; });
  ['naoIG','naoLP','naoGMB'].forEach(id=>{ const b=document.getElementById(id); if(b) b.classList.remove('on'); });
  document.getElementById('grp_budgetMeta').style.display='none';
  document.getElementById('grp_budgetGoogle').style.display='none';
  S.done.clear(); S.step=1; planData=null;
  document.getElementById('resultsView').style.display='none';
  document.getElementById('formWrap').style.display='block';
  document.querySelectorAll('.sp').forEach(p=>p.classList.remove('active'));
  document.getElementById('panel1').classList.add('active');
  for(let i=1;i<=5;i++){ const b=document.getElementById('sBtn'+i); b.className='s-btn'+(i===1?' active':' locked'); b.onclick=i===1?()=>goStep(1):null; }
  updateXP(); window.scrollTo({top:0,behavior:'smooth'});
}

function launchConfetti(){
  const cv=document.createElement('canvas');
  Object.assign(cv.style,{position:'fixed',top:'0',left:'0',width:'100%',height:'100%',pointerEvents:'none',zIndex:'9999'});
  document.body.appendChild(cv);
  cv.width=window.innerWidth; cv.height=window.innerHeight;
  const ctx=cv.getContext('2d'), colors=['#7d5f38','#c9a46a','#261a0c','#3d6b4a','#d4b483'];
  const ps=Array.from({length:80},()=>({x:Math.random()*cv.width,y:-20-Math.random()*60,w:Math.random()*10+4,h:Math.random()*5+3,c:colors[Math.floor(Math.random()*colors.length)],vx:(Math.random()-.5)*4,vy:Math.random()*4+2,r:Math.random()*360,vr:(Math.random()-.5)*8}));
  function tick(){ ctx.clearRect(0,0,cv.width,cv.height); let a=0; ps.forEach(p=>{ if(p.y>cv.height+20) return; a++; p.x+=p.vx;p.y+=p.vy;p.r+=p.vr; ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.r*Math.PI/180);ctx.fillStyle=p.c;ctx.fillRect(-p.w/2,-p.h/2,p.w,p.h);ctx.restore(); }); if(a>0) requestAnimationFrame(tick); else cv.remove(); }
  tick();
}

updateXP();
