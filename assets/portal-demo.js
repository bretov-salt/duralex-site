/* DuraLex client portal demo (home page). Sample cases; names, numbers and dates are made up. Text lives in /assets/portal-data.js. */
(function(){
var root=document.getElementById('cpd');if(!root||!window.PD)return;
var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
var LOC={en:'en-US',uk:'uk-UA',uz:'uz-Latn-UZ',es:'es-US',pt:'pt-BR'};
var SH={
 imm:{total:6000,paid:3500,inst:1250,cur:3,payments:[['2026-09-09',2500],['2026-09-23',1000]],
  receiptNums:['IOE9990011231','IOE9990011232','IOE9990011233','IOE9990011234'],
  dates:[{d:'2026-10-15'},{s:'2026-10-29T09:00:00-04:00',e:'2026-10-29T12:00:00-04:00',loc:'Batavia Immigration Court, 4250 Federal Drive, Batavia, NY 14020'},{none:1}],
  upd:[['eoir','2026-09-22'],['uscis','2026-09-27'],['uscis','2026-09-27']],
  files:[['I-134A supporter confirmation.pdf','CBP travel authorization.pdf','I-94 parole record (UHP).pdf'],['I-765 approval notice.pdf','I-589 receipt notice.pdf','I-131 re-parole receipt notice.pdf'],['Notice of custody determination (I-286).pdf','ICE detainee locator record.pdf'],['Notice to Appear (I-862).pdf','Hearing notice, master calendar.pdf','Hearing notice, individual hearing.pdf'],['Form I-589, filed with the court.pdf','Declaration.pdf','Country conditions, Ukraine.pdf'],['Engagement agreement, signed.pdf','Invoice 2051.pdf']],
  todoTab:[4,4,3],docSigned:[false,false,true],apptMin:[30,20,15],
  slots:['2026-10-05T10:00:00-04:00','2026-10-05T15:30:00-04:00','2026-10-06T11:00:00-04:00','2026-10-07T09:30:00-04:00','2026-10-08T14:00:00-04:00','2026-10-09T10:30:00-04:00']},
 crim:{total:7500,paid:5000,inst:1250,cur:2,payments:[['2026-09-24',5000]],receiptNums:[],
  dates:[{s:'2026-09-28T10:00:00-04:00',e:'2026-09-28T10:30:00-04:00',weekly:'MO',loc:'U.S. Pretrial Services, 225 Cadman Plaza East, Brooklyn, NY 11201'},{s:'2026-10-16T10:00:00-04:00',e:'2026-10-16T11:00:00-04:00',loc:'U.S. District Court, 225 Cadman Plaza East, Brooklyn, NY 11201'},{d:'2026-10-26'}],
  upd:[['pacer','2026-09-25'],['pacer','2026-09-24'],['eoir','2026-09-27']],
  files:[['Criminal complaint.pdf','Arrest report summary.pdf'],['Initial appearance minute entry.pdf','Order setting conditions of release.pdf','Appearance bond.pdf'],['Green card (I-551), front and back.pdf','Passport surrender receipt.pdf'],['Voter registration record.pdf','Ballot record, November 2024.pdf'],['Engagement agreement, signed.pdf','Invoice 2052.pdf']],
  todoTab:[3,4,2],docSigned:[false,false,true],apptMin:[60,30,20],
  slots:['2026-09-29T14:00:00-04:00','2026-09-30T10:00:00-04:00','2026-10-01T16:00:00-04:00','2026-10-05T11:30:00-04:00','2026-10-07T09:00:00-04:00','2026-10-09T13:00:00-04:00']}
};
var ST={imm:{paid:0,pays:[],appts:[],signed:{},uploads:[],sent:[]},crim:{paid:0,pays:[],appts:[],signed:{},uploads:[],sent:[]}};
var L='en',C='imm',T=0,selDoc=0,selSlot=-1,selType=0,payAmt='inst',payMeth='card';
function $(s){return root.querySelector(s)}
function esc(x){return String(x).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function D(){return PD[L][C]}function U(){return PD[L].ui}
function fmt(d,opt){try{return new Intl.DateTimeFormat(LOC[L],opt).format(d)}catch(e){return new Intl.DateTimeFormat('en-US',opt).format(d)}}
function dday(iso){return fmt(new Date(iso+'T12:00:00'),{weekday:'short',year:'numeric',month:'short',day:'numeric'})}
function dtime(iso){return fmt(new Date(iso),{weekday:'short',year:'numeric',month:'short',day:'numeric',hour:'numeric',minute:'2-digit',timeZone:'America/New_York'})}
function money(v){if(L==='pt')return 'US$ '+new Intl.NumberFormat('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:2}).format(v);if(L==='uk'||L==='uz')return new Intl.NumberFormat('uk-UA',{minimumFractionDigits:2,maximumFractionDigits:2}).format(v)+' $';return '$'+v.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2})}
function paid(){return SH[C].paid+ST[C].paid}function due(){return SH[C].total-paid()}
function z(d){return d.toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,'')}
function nextDay(iso){var n=new Date(iso+'T12:00:00Z');n.setUTCDate(n.getUTCDate()+1);return n.toISOString().slice(0,10).replace(/-/g,'')}
function icsEvent(ev,title,note){var s='BEGIN:VEVENT\r\nUID:'+Math.random().toString(36).slice(2)+'@duralex.law\r\nDTSTAMP:'+z(new Date())+'\r\n';
  if(ev.d)s+='DTSTART;VALUE=DATE:'+ev.d.replace(/-/g,'')+'\r\nDTEND;VALUE=DATE:'+nextDay(ev.d)+'\r\n';
  else{s+='DTSTART:'+z(new Date(ev.s))+'\r\nDTEND:'+z(new Date(ev.e))+'\r\n';if(ev.weekly)s+='RRULE:FREQ=WEEKLY;BYDAY='+ev.weekly+';COUNT=8\r\n'}
  var cl=function(t){return String(t).replace(/[\\;,]/g,function(c){return '\\'+c}).replace(/\n/g,'\\n')};
  s+='SUMMARY:'+cl(title)+'\r\n';if(ev.loc)s+='LOCATION:'+cl(ev.loc)+'\r\n';return s+'DESCRIPTION:'+cl((note?note+' ':'')+'(DuraLex portal demo, sample event)')+'\r\nEND:VEVENT\r\n'}
function download(name,type,text){var b=new Blob([text],{type:type}),u=URL.createObjectURL(b),a=document.createElement('a');a.href=u;a.download=name;document.body.appendChild(a);a.click();setTimeout(function(){URL.revokeObjectURL(u);a.remove()},800)}
function fold(t){return t.split('\r\n').map(function(line){var out='',cur='',n=0;for(var ch of line){var b=new TextEncoder().encode(ch).length;if(n+b>75){out+=cur+'\r\n ';cur='';n=1}cur+=ch;n+=b}return out+cur}).join('\r\n')}
function ics(events){download('duralex-sample.ics','text/calendar;charset=utf-8',fold('BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//DuraLex//Client portal demo//EN\r\nCALSCALE:GREGORIAN\r\nMETHOD:PUBLISH\r\n'+events.join('')+'END:VCALENDAR\r\n'))}
function gcal(ev,title,note){var dates=ev.d?ev.d.replace(/-/g,'')+'/'+nextDay(ev.d):z(new Date(ev.s))+'/'+z(new Date(ev.e));
  return 'https://calendar.google.com/calendar/render?action=TEMPLATE&text='+encodeURIComponent(title)+'&dates='+dates+'&details='+encodeURIComponent((note||'')+' (DuraLex portal demo, sample event)')+(ev.loc?'&location='+encodeURIComponent(ev.loc):'')+(ev.weekly?'&recur='+encodeURIComponent('RRULE:FREQ=WEEKLY;BYDAY='+ev.weekly+';COUNT=8'):'')}
function calBtns(k,ev,title,note){return '<span class="cpd-cal"><button type="button" class="cpd-mini" data-ics="'+k+'">'+esc(U().addCal)+'</button><a class="cpd-mini" target="_blank" rel="noopener" href="'+esc(gcal(ev,title,note))+'">'+esc(U().google)+'</a></span>'}
function chrome(){var u=U();root.setAttribute('lang',L);$('.cpd-title').textContent=u.title;$('.cpd-sample').textContent=u.sample;$('#cpdCaseLbl').textContent=u.caseLbl;$('#cpdLangLbl').textContent=u.langLbl;
  [].forEach.call(root.querySelectorAll('.cpd-case'),function(b){b.textContent=PD[L][b.dataset.c].pick;b.setAttribute('aria-pressed',b.dataset.c===C?'true':'false')});
  [].forEach.call(root.querySelectorAll('.cpd-lang'),function(b){b.setAttribute('aria-pressed',b.dataset.l===L?'true':'false')});
  [].forEach.call(root.querySelectorAll('[role=tab]'),function(t,i){t.textContent=u.tabs[i];t.setAttribute('aria-selected',i===T?'true':'false');t.tabIndex=i===T?0:-1});
  var d=D();$('#cpdWho').innerHTML='<b>'+esc(d.name)+'</b><span>'+esc(d.kind)+(d.shared?' · '+esc(d.shared):'')+'</span>'}
function say(t){var s=$('#cpdStatus');s.textContent='';setTimeout(function(){s.textContent=t},30)}
function overview(){var u=U(),d=D(),S=SH[C],h='';
  h+='<div class="cpd-ids">'+d.ids.map(function(r){return '<div><small>'+esc(r[0])+'</small><b>'+esc(r[1])+'</b></div>'}).join('')+'</div>';
  h+='<h4>'+esc(u.stand)+'</h4><p class="cpd-stage">'+esc(d.stage)+'</p><ol class="cpd-steps">'+d.steps.map(function(s,i){return '<li class="'+(i<S.cur?'done':i===S.cur?'cur':'')+'"'+(i===S.cur?' aria-current="step"':'')+'>'+esc(s)+'</li>'}).join('')+'</ol>';
  if(d.alert)h+='<div class="cpd-alert" role="note"><b>'+esc(u.important)+'</b><p>'+esc(d.alert)+'</p></div>';
  if(d.receipts)h+='<h4>'+esc(d.rcTitle)+'</h4><ul class="cpd-rc">'+d.receipts.map(function(r,i){return '<li><b>'+esc(r[0])+'</b><span>'+esc(S.receiptNums[i]||'')+'</span><small>'+esc(r[1])+'</small></li>'}).join('')+'</ul>';
  if(d.note)h+='<div class="cpd-info" role="note"><p>'+esc(d.note)+'</p></div>';
  if(d.charges)h+='<h4>'+esc(d.chargesTitle)+'</h4><ul class="cpd-list">'+d.charges.map(function(c){return '<li>'+esc(c)+'</li>'}).join('')+'</ul><h4>'+esc(d.releaseTitle)+'</h4><p>'+esc(d.release)+'</p>';
  h+='<h4>'+esc(u.todo)+'</h4><ul class="cpd-todo">'+d.todo.map(function(t,i){return '<li><span>'+esc(t[0])+'</span><button type="button" class="cpd-mini" data-go="'+S.todoTab[i]+'">'+esc(u.tabs[S.todoTab[i]])+' →</button></li>'}).join('')+'</ul>';
  h+='<h4>'+esc(u.next)+'</h4><ul class="cpd-dates">'+d.dates.map(function(x,i){var ev=S.dates[i],when=ev.none?'':ev.d?dday(ev.d):dtime(ev.s);return '<li>'+(when?'<span>'+esc(when)+'</span>':'')+'<b>'+esc(x[0])+'</b><small>'+esc(x[1])+'</small>'+(ev.none?'':calBtns(String(i),ev,x[0],x[1]))+'</li>'}).join('')+'</ul>';
  h+='<div class="cpd-row"><button type="button" class="btn solid" id="cpdAll">'+esc(u.addAll)+'</button><small class="cpd-note">'+esc(u.icsHint)+'</small></div>';
  return h+'<h4>'+esc(u.team)+'</h4><p>'+d.team.map(esc).join(' · ')+'</p>'}
function updates(){var u=U(),d=D(),S=SH[C];return '<p class="cpd-note">'+esc(u.sampleFeed)+'</p><ul class="cpd-upd">'+d.updates.map(function(x,i){return '<li><img src="/icons/'+S.upd[i][0]+'.png" alt="" width="32" height="32"><div><small>'+esc(x[0])+' · '+esc(dday(S.upd[i][1]))+'</small><b>'+esc(x[1])+'</b><p>'+esc(x[2])+'</p></div></li>'}).join('')+'</ul>'}
function appts(){var u=U(),d=D(),S=SH[C],A=ST[C].appts,h='<h4>'+esc(u.book)+'</h4><fieldset class="cpd-fs"><legend>'+esc(u.type)+'</legend>'+d.apptTypes.map(function(t,i){return '<label class="cpd-opt"><input type="radio" name="cpdType" value="'+i+'"'+(i===selType?' checked':'')+'> '+esc(t)+'</label>'}).join('')+'</fieldset>';
  h+='<fieldset class="cpd-fs" id="cpdSlotFs" aria-describedby="cpdBookErr"><legend>'+esc(u.pickTime)+'</legend><div class="cpd-slots">'+S.slots.map(function(s,i){if(A.some(function(a){return a.s===s}))return '';return '<label class="cpd-slot'+(i===selSlot?' sel':'')+'"><input type="radio" name="cpdSlot" value="'+i+'"'+(i===selSlot?' checked':'')+'> '+esc(dtime(s))+'</label>'}).join('')+'</div></fieldset>';
  h+='<button type="button" class="btn solid" id="cpdBook">'+esc(u.confirm)+'</button><p class="cpd-err" id="cpdBookErr" role="alert"></p>';
  return h+'<h4>'+esc(u.yourAppts)+'</h4>'+(A.length?'<ul class="cpd-dates">'+A.map(function(a,i){return '<li><span>'+esc(dtime(a.s))+'</span><b>'+esc(d.apptTypes[a.t])+'</b>'+calBtns('a'+i,{s:a.s,e:a.e},d.apptTypes[a.t],'')+'</li>'}).join('')+'</ul>':'<p class="cpd-note">'+esc(u.noAppts)+'</p>')}
function sign(){var u=U(),d=D(),S=SH[C],sg=ST[C].signed,h='<h4>'+esc(u.toSign)+'</h4><ul class="cpd-docs">'+d.docs.map(function(x,i){var done=S.docSigned[i]||sg[i];return '<li><button type="button" class="cpd-doc'+(i===selDoc?' sel':'')+'" data-doc="'+i+'" aria-pressed="'+(i===selDoc)+'"><b>'+esc(x[0])+'</b><span class="chip '+(done?'ok':'soon')+'">'+esc(done?u.signed:u.needsSig)+'</span></button></li>'}).join('')+'</ul>';
  var x=d.docs[selDoc],done=S.docSigned[selDoc]||sg[selDoc];
  h+='<article class="cpd-paper" aria-labelledby="cpdDocT"><h5 id="cpdDocT">'+esc(x[0])+'</h5><p>'+esc(x[1])+'</p>';
  if(done)h+='<p class="cpd-ok">'+esc(sg[selDoc]?u.signedBy.replace('{n}',sg[selDoc].n).replace('{d}',sg[selDoc].d):u.signed)+'</p>';
  else h+='<label class="cpd-opt"><input type="checkbox" id="cpdAck" aria-describedby="cpdSignErr"> '+esc(u.readAck)+'</label><p class="cpd-lbl" id="cpdPadL">'+esc(u.drawSig)+'</p><canvas class="cpd-pad" id="cpdPad" width="560" height="140" role="img" aria-labelledby="cpdPadL"></canvas><div class="cpd-row"><button type="button" class="cpd-mini" id="cpdClr">'+esc(u.clear)+'</button></div><label class="cpd-lbl" for="cpdTyped">'+esc(u.typeSig)+'</label><input class="cpd-in" id="cpdTyped" type="text" autocomplete="name" aria-describedby="cpdSignErr"><button type="button" class="btn solid" id="cpdSign">'+esc(u.signBtn)+'</button><p class="cpd-err" id="cpdSignErr" role="alert"></p>';
  return h+'</article>'}
function files(){var u=U(),d=D(),S=SH[C],up=ST[C].uploads,sg=ST[C].signed,last=d.folders.length-1;
  var h='<p class="cpd-note">'+esc(u.filesNote)+'</p><div class="cpd-files"><ul class="cpd-tree">'+d.folders.map(function(f,i){var fs=S.files[i].slice();if(i===last)Object.keys(sg).forEach(function(k){fs.push(d.docs[k][0]+' ('+u.signed+').pdf')});return '<li><span class="cpd-folder">'+esc(f)+'</span><ul>'+fs.map(function(n){return '<li><button type="button" class="cpd-file" data-f="'+esc(n)+'" data-fo="'+esc(f)+'">'+esc(n)+'</button></li>'}).join('')+'</ul></li>'}).join('')+(up.length?'<li><span class="cpd-folder">'+esc(u.yourUploads)+'</span><ul>'+up.map(function(x){return '<li><button type="button" class="cpd-file" data-f="'+esc(x.n)+'" data-fo="'+esc(u.yourUploads)+'">'+esc(x.n)+' · '+esc(x.s)+'</button></li>'}).join('')+'</ul></li>':'')+'</ul><div class="cpd-prev" id="cpdPrev"></div></div>';
  return h+'<label class="btn line cpd-up">'+esc(u.upload)+'<input id="cpdFile" class="cpd-fileinput" type="file" multiple></label><p class="cpd-note">'+esc(u.uploadNote)+'</p>'}
function messages(){var u=U(),d=D();return '<div class="cpd-chat" id="cpdChat">'+d.msgs.map(function(m){return m[0]==='c'?'<div class="cpd-m c">'+esc(m[1])+'</div>':'<div class="cpd-m t"><small>'+esc(m[1])+'</small>'+esc(m[2])+'<small class="rv">'+esc(u.reviewed)+'</small></div>'}).join('')+ST[C].sent.map(function(v){return '<div class="cpd-m c">'+esc(v)+'</div><div class="cpd-m t sys">'+esc(u.sent)+'<br>'+esc(d.reply)+'</div>'}).join('')+'</div>'+
  '<form class="cpd-ask" id="cpdAsk" novalidate><label class="sr-only" for="cpdQ">'+esc(u.askPh)+'</label><input id="cpdQ" type="text" placeholder="'+esc(u.askPh)+'" autocomplete="off" aria-describedby="cpdErr"><button type="submit" class="btn solid">'+esc(u.send)+'</button></form><p class="cpd-err" id="cpdErr"></p>'}
function billing(){var u=U(),d=D(),S=SH[C],dv=due(),amt=payAmt==='full'?dv:Math.min(S.inst,dv),h='<div class="cpd-bill"><div><small>'+esc(u.total)+'</small><b>'+money(S.total)+'</b></div><div><small>'+esc(u.paid)+'</small><b>'+money(paid())+'</b></div><div class="due"><small>'+esc(u.due)+'</small><b>'+money(dv)+'</b></div></div>';
  h+='<p><b>'+esc(u.planL)+':</b> '+esc(d.planTxt)+'</p><h4>'+esc(u.history)+'</h4><ul class="cpd-pay">'+S.payments.map(function(x){return '<li><span>'+esc(dday(x[0]))+'</span><b>'+money(x[1])+'</b></li>'}).join('')+ST[C].pays.map(function(x){return '<li class="new"><span>'+esc(u.today)+'</span><b>'+money(x)+'</b></li>'}).join('')+'</ul>';
  if(dv>0)h+='<fieldset class="cpd-fs"><legend>'+esc(u.amount)+'</legend><label class="cpd-opt"><input type="radio" name="cpdAmt" value="inst"'+(payAmt==='inst'?' checked':'')+'> '+esc(u.nextInst)+' · '+money(Math.min(S.inst,dv))+'</label><label class="cpd-opt"><input type="radio" name="cpdAmt" value="full"'+(payAmt==='full'?' checked':'')+'> '+esc(u.fullBal)+' · '+money(dv)+'</label></fieldset><fieldset class="cpd-fs"><legend>'+esc(u.method)+'</legend><label class="cpd-opt"><input type="radio" name="cpdMeth" value="card"'+(payMeth==='card'?' checked':'')+'> '+esc(u.card)+'</label><label class="cpd-opt"><input type="radio" name="cpdMeth" value="bank"'+(payMeth==='bank'?' checked':'')+'> '+esc(u.bank)+'</label></fieldset><button type="button" class="btn solid" id="cpdPay">'+esc(u.payNow.replace('{a}',money(amt)))+'</button>';
  return h+'<p class="cpd-ok" id="cpdPayOk"></p>'+(ST[C].pays.length?'<button type="button" class="btn line" id="cpdRcpt">'+esc(u.receipt)+'</button>':'')}
var PANELS=[overview,updates,appts,sign,files,messages,billing];
function render(){var p=$('#cpdPanel');p.innerHTML=PANELS[T]();p.setAttribute('aria-labelledby','cpdTab'+T);wire()}
function all(){chrome();render()}
function wire(){var u=U(),d=D(),S=SH[C];
  [].forEach.call(root.querySelectorAll('[data-go]'),function(b){b.onclick=function(){setTab(+b.dataset.go,true)}});
  [].forEach.call(root.querySelectorAll('[data-ics]'),function(b){b.onclick=function(){var k=b.dataset.ics;if(k[0]==='a'){var a=ST[C].appts[+k.slice(1)];ics([icsEvent({s:a.s,e:a.e},d.apptTypes[a.t],'')])}else{var i=+k;ics([icsEvent(S.dates[i],d.dates[i][0],d.dates[i][1])])}}});
  var al=$('#cpdAll');if(al)al.onclick=function(){ics(S.dates.map(function(ev,i){return ev.none?'':icsEvent(ev,d.dates[i][0],d.dates[i][1])}))};
  [].forEach.call(root.querySelectorAll('input[name=cpdType]'),function(r){r.onchange=function(){selType=+r.value}});
  [].forEach.call(root.querySelectorAll('input[name=cpdSlot]'),function(r){r.onchange=function(){selSlot=+r.value;[].forEach.call(root.querySelectorAll('.cpd-slot'),function(l,i){l.classList.toggle('sel',i===selSlot)});$('#cpdBookErr').textContent=''}});
  var bk=$('#cpdBook');if(bk)bk.onclick=function(){var fs=$('#cpdSlotFs');if(selSlot<0||ST[C].appts.some(function(a){return a.s===S.slots[selSlot]})){$('#cpdBookErr').textContent=u.pickFirst;fs.setAttribute('aria-invalid','true');var r0=root.querySelector('input[name=cpdSlot]');if(r0)r0.focus();return}fs.removeAttribute('aria-invalid');var s=S.slots[selSlot],e=new Date(new Date(s).getTime()+S.apptMin[selType]*60000).toISOString();ST[C].appts.push({s:s,e:e,t:selType});var t=dtime(s);selSlot=-1;render();say(u.booked.replace('{t}',t))};
  [].forEach.call(root.querySelectorAll('.cpd-doc'),function(b){b.onclick=function(){selDoc=+b.dataset.doc;render()}});
  var pad=$('#cpdPad');if(pad){var ctx=pad.getContext('2d'),on=false,drew=false;ctx.lineWidth=2.5;ctx.lineCap='round';ctx.strokeStyle='#132029';
    var pos=function(e){var r=pad.getBoundingClientRect();return [(e.clientX-r.left)*pad.width/r.width,(e.clientY-r.top)*pad.height/r.height]};
    pad.onpointerdown=function(e){on=true;try{pad.setPointerCapture(e.pointerId)}catch(x){}var p=pos(e);ctx.beginPath();ctx.moveTo(p[0],p[1])};
    pad.onpointermove=function(e){if(!on)return;var p=pos(e);ctx.lineTo(p[0],p[1]);ctx.stroke();drew=true};
    pad.onpointerup=pad.onpointercancel=function(){on=false};
    $('#cpdClr').onclick=function(){ctx.clearRect(0,0,pad.width,pad.height);drew=false};
    $('#cpdSign').onclick=function(){var nm=$('#cpdTyped').value.trim();var ack=$('#cpdAck'),ty=$('#cpdTyped');var inv=function(el,on){if(on)el.setAttribute('aria-invalid','true');else el.removeAttribute('aria-invalid')};inv(ack,!ack.checked);inv(ty,!drew&&!nm);if(!ack.checked||(!drew&&!nm)){$('#cpdSignErr').textContent=u.signErr;(ack.checked?ty:ack).focus();return}
      var when=fmt(new Date(),{year:'numeric',month:'long',day:'numeric'});ST[C].signed[selDoc]={n:nm||d.name,d:when};render();say(u.signedBy.replace('{n}',nm||d.name).replace('{d}',when))}}
  [].forEach.call(root.querySelectorAll('.cpd-file'),function(b){b.onclick=function(){[].forEach.call(root.querySelectorAll('.cpd-file'),function(x){x.classList.toggle('sel',x===b)});$('#cpdPrev').innerHTML='<small>'+esc(u.preview)+'</small><b>'+esc(b.dataset.f)+'</b><span>'+esc(b.dataset.fo)+' · '+esc(d.name)+'</span><i></i><i></i><i style="width:70%"></i><i style="width:85%"></i>'}});
  var fi=$('#cpdFile');if(fi)fi.onchange=function(){var names=[];[].forEach.call(fi.files,function(f){var kb=f.size<1048576?Math.max(1,Math.round(f.size/1024))+' KB':(f.size/1048576).toFixed(1)+' MB';ST[C].uploads.push({n:f.name,s:kb});names.push(f.name)});if(!names.length)return;render();say(u.uploaded.replace('{f}',names.join(', ')))};
  var f=$('#cpdAsk');if(f)f.onsubmit=function(e){e.preventDefault();var q=$('#cpdQ'),v=q.value.trim();if(!v){$('#cpdErr').textContent=u.emptyQ;q.setAttribute('aria-invalid','true');q.focus();return}ST[C].sent.push(v);render();var ch=$('#cpdChat');ch.scrollTop=ch.scrollHeight;say(u.sent);$('#cpdQ').focus()};
  var q=$('#cpdQ');if(q)q.oninput=function(){$('#cpdErr').textContent='';q.removeAttribute('aria-invalid')};
  [].forEach.call(root.querySelectorAll('input[name=cpdAmt]'),function(r){r.onchange=function(){payAmt=r.value;render()}});
  [].forEach.call(root.querySelectorAll('input[name=cpdMeth]'),function(r){r.onchange=function(){payMeth=r.value}});
  var pay=$('#cpdPay');if(pay)pay.onclick=function(){if(pay.disabled)return;pay.disabled=true;var dv=due(),amt=payAmt==='full'?dv:Math.min(S.inst,dv);setTimeout(function(){ST[C].paid+=amt;ST[C].pays.push(amt);payAmt='inst';render();var t=u.paidDone.replace('{a}',money(amt));$('#cpdPayOk').textContent=t;say(t)},reduce?0:800)};
  var rc=$('#cpdRcpt');if(rc)rc.onclick=function(){var last=ST[C].pays[ST[C].pays.length-1];download('duralex-receipt-sample.html','text/html;charset=utf-8','<!doctype html><meta charset="utf-8"><title>'+esc(u.receiptTitle)+'</title><body style="font-family:system-ui;max-width:520px;margin:40px auto"><h1>'+esc(u.receiptTitle)+'</h1><p>'+esc(d.name)+'</p><p>'+esc(u.paid)+': <b>'+money(last)+'</b> · '+esc(payMeth==='card'?u.card:u.bank)+'</p><p>'+esc(u.due)+': '+money(due())+'</p><p>'+esc(fmt(new Date(),{year:'numeric',month:'long',day:'numeric'}))+'</p><p><small>DuraLex portal demo. Sample receipt; no real payment was made.</small></p></body>')};
}
function setTab(i,focus){T=i;chrome();render();if(focus)root.querySelectorAll('[role=tab]')[i].focus()}
[].forEach.call(root.querySelectorAll('[role=tab]'),function(t,i){t.onclick=function(){setTab(i)};t.onkeydown=function(e){var n=root.querySelectorAll('[role=tab]').length,k=e.key;if(k==='ArrowRight'||k==='ArrowDown'){e.preventDefault();setTab((i+1)%n,true)}if(k==='ArrowLeft'||k==='ArrowUp'){e.preventDefault();setTab((i+n-1)%n,true)}if(k==='Home'){e.preventDefault();setTab(0,true)}if(k==='End'){e.preventDefault();setTab(n-1,true)}}});
[].forEach.call(root.querySelectorAll('.cpd-case'),function(b){b.onclick=function(){C=b.dataset.c;selDoc=0;selSlot=-1;all();say(D().name)}});
[].forEach.call(root.querySelectorAll('.cpd-lang'),function(b){b.onclick=function(){L=b.dataset.l;all();say(b.textContent)}});
all();
})();
