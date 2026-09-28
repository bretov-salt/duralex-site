/* DuraLex client portal demo (home page), shown inside a phone frame. Sample cases: names, numbers and dates are made up.
   View only: sign, book, pay, send, upload and calendar buttons do not act, and the portal offers no download buttons.
   Documents are page images of official blank forms filled with the fictional data, or plain-paper notices;
   third-party names, signatures and identifying numbers are blacked out. Text lives in /assets/portal-data.js. */
(function(){
var root=document.getElementById('cpd'),sim=document.getElementById('cpdSim');if(!root||!sim||!window.PD)return;
var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
var LOC={en:'en-US',uk:'uk-UA',uz:'uz-Latn-UZ',es:'es-US',pt:'pt-BR'};
var DOCS='/assets/portal-docs/';
/* Screen-reader summaries of the sample documents (English, as the documents are). */
var DSUM={i134a:'USCIS online account page: Form I-134A for Andrii Melnyk confirmed April 18, 2023, receipt IOE9990011231; supporter details blacked out.',
 i94:'CBP I-94 printout: Andrii Melnyk, entered May 12, 2023, class of admission UHP, admit until May 11, 2025; record and passport numbers blacked out.',
 i765app:'Form I-765, page 1, filed for Andrii Melnyk as an initial application for employment authorization.',
 i765r:'Form I-797C receipt notice: I-765 received June 5, 2023, receipt IOE9990011232.',
 ead:'Copy of a work permit (EAD), USCIS specimen image with the name, photo, numbers and dates blacked out.',
 i589r:'Form I-797C receipt notice: I-589 asylum application received January 16, 2025, receipt IOE9990011233. It does not grant any status.',
 i131app:'Form I-131, page 1: application for a travel document, used here for re-parole under Uniting for Ukraine.',
 i131r:'Form I-797C receipt notice: I-131 re-parole application received January 20, 2025, receipt IOE9990011234.',
 i286:'ICE Notice of Custody Determination dated August 18, 2026: Andrii Melnyk detained in DHS custody; officer details blacked out.',
 locator:'ICE Online Detainee Locator result: Andrii Melnyk, in ICE custody at the Buffalo (Batavia) Service Processing Center, Batavia, New York.',
 nta:'DHS Form I-862 Notice to Appear, carrying the DHS sample mark: Andrii Melnyk, arriving alien paroled under section 212(d)(5) until May 11, 2025, charged under section 212(a)(7)(A)(i)(I); to appear at the Batavia Immigration Court on a date to be set.',
 eoir28:'Form EOIR-28: Robert Bond enters his appearance as attorney for Andrii Melnyk, A 999-002-417, before the immigration court.',
 mch:'Notice of master calendar hearing: Tuesday, September 22, 2026, 1:00 PM, Batavia Immigration Court, detained docket.',
 ih:'Notice of individual hearing: Thursday, October 29, 2026, 9:00 AM, Batavia Immigration Court; evidence and witness lists due October 15, 2026.',
 i589:'Form I-589, page 1, as filed with the Batavia Immigration Court: Andrii Melnyk, citizen of Ukraine, applying for asylum, withholding of removal and protection under the Convention Against Torture; date of birth and document numbers blacked out.',
 decl:'Declaration of Andrii Melnyk in support of his asylum application, signed September 21, 2026; most paragraphs blacked out.',
 cc:'Index of country conditions exhibits on Ukraine, tabs A through D.',
 engI:'Signed engagement agreement for removal defense and asylum: flat fee $6,000.00 with a payment plan.',
 invI:'Invoice 2051: $6,000.00 flat fee, payments of $2,500.00 and $1,000.00, balance $2,500.00.',
 complaint:'Criminal complaint, form AO 91, Eastern District of New York, case 1:26-mj-00987: United States v. Jasur Karimov, alleging violations of 18 U.S.C. 1015(f) and 611(a) on or about March 4, 2024 and November 5, 2024; sworn September 23, 2026; signatures blacked out.',
 warrant:'Arrest warrant, form AO 442, on the complaint in case 1:26-mj-00987, issued September 23, 2026; executed September 24, 2026 in Jamaica, New York; officer details blacked out.',
 docket:'PACER docket sheet for 1:26-mj-00987: complaint and warrant September 23, arrest September 24, initial appearance September 25, 2026 with $50,000 bond and preliminary hearing set for October 16, 2026 at 10:00 AM.',
 release:'Order setting conditions of release, form AO 199A: appear on October 16, 2026 at 10:00 AM; surrender passport, travel limited to New York City and Long Island, weekly Monday reporting to Pretrial Services.',
 bond:'Appearance bond, form AO 98: $50,000 unsecured bond for Jasur Karimov to appear and comply with all conditions of release.',
 pretrial:'Pretrial Services reporting instructions: report every Monday at 10:00 AM starting September 28, 2026; next court date October 16, 2026.',
 gc:'Copy of a green card, front and back, USCIS specimen image with the name, photo, numbers and dates blacked out.',
 passport:'Pretrial Services receipt for the surrendered passport of the Republic of Uzbekistan, received September 25, 2026; passport number blacked out.',
 voter:'New York State voter registration form produced in discovery: Karimov, Jasur, Queens; the citizenship question is answered Yes; signed March 4, 2024; personal details blacked out.',
 ballot:'New York City Board of Elections voter record: registered March 4, 2024; voted in person in the November 5, 2024 general election.',
 engC:'Signed engagement agreement for federal criminal defense through the charging decision: flat fee $7,500.00 with a payment plan.',
 invC:'Invoice 2052: $7,500.00 flat fee, payment of $5,000.00, balance $2,500.00.'};
var SH={
 imm:{total:6000,paid:3500,inst:1250,cur:3,payments:[['2026-09-09',2500],['2026-09-23',1000]],
  receiptNums:['IOE9990011231','IOE9990011232','IOE9990011233','IOE9990011234'],rcKeys:['i134a','ead','i589r','i131r'],
  dates:[{d:'2026-10-15'},{s:'2026-10-29T09:00:00-04:00'},{none:1}],
  upd:[['eoir','2026-09-22'],['uscis','2026-09-27'],['uscis','2026-09-27']],
  files:[[['I-134A confirmation.pdf','i134a'],['I-94 record.pdf','i94']],
   [['I-765 application.pdf','i765app'],['I-765 receipt notice.pdf','i765r'],['Work permit (EAD), copy.pdf','ead'],['I-589 receipt notice.pdf','i589r'],['I-131 re-parole application.pdf','i131app'],['I-131 receipt notice.pdf','i131r']],
   [['Custody determination (I-286).pdf','i286'],['ICE detainee locator record.pdf','locator']],
   [['Notice to Appear (I-862).pdf','nta'],['EOIR-28 notice of appearance.pdf','eoir28'],['Hearing notice, master calendar.pdf','mch'],['Hearing notice, individual hearing.pdf','ih']],
   [['Form I-589, filed with the court.pdf','i589'],['Declaration of Andrii Melnyk.pdf','decl'],['Country conditions index.pdf','cc']],
   [['Engagement agreement, signed.pdf','engI'],['Invoice 2051.pdf','invI']]],
  docSigned:[false,false,true],
  aiNeed:[['you','2026-10-15',4],['you','2026-10-15',4],['you','',3],['firm','2026-10-15',-1]],
  slots:['2026-10-05T10:00:00-04:00','2026-10-05T15:30:00-04:00','2026-10-06T11:00:00-04:00','2026-10-07T09:30:00-04:00','2026-10-08T14:00:00-04:00','2026-10-09T10:30:00-04:00']},
 crim:{total:7500,paid:5000,inst:1250,cur:2,payments:[['2026-09-24',5000]],receiptNums:[],rcKeys:[],
  dates:[{s:'2026-09-28T10:00:00-04:00'},{s:'2026-10-16T10:00:00-04:00'},{d:'2026-10-26'}],
  upd:[['pacer','2026-09-25'],['pacer','2026-09-24'],['eoir','2026-09-27']],
  files:[[['Criminal complaint (AO 91).pdf','complaint'],['Arrest warrant (AO 442).pdf','warrant']],
   [['Docket sheet.pdf','docket'],['Order setting conditions of release.pdf','release'],['Appearance bond.pdf','bond'],['Pretrial Services reporting instructions.pdf','pretrial']],
   [['Green card, front and back.pdf','gc'],['Passport surrender receipt.pdf','passport']],
   [['Voter registration form.pdf','voter'],['Voter history record.pdf','ballot']],
   [['Engagement agreement, signed.pdf','engC'],['Invoice 2052.pdf','invC']]],
  docSigned:[false,false,true],
  aiNeed:[['you','',3],['you','2026-10-16',4],['you','2026-10-16',2],['firm','2026-10-26',-1]],
  slots:['2026-09-29T14:00:00-04:00','2026-09-30T10:00:00-04:00','2026-10-01T16:00:00-04:00','2026-10-05T11:30:00-04:00','2026-10-07T09:00:00-04:00','2026-10-09T13:00:00-04:00']}
};
var L='en',C='imm',T=0,selDoc=0,selSlot=-1,selType=0,payAmt='inst',payMeth='card',FO=-1,FV=null,lastThumb=null;
function $(s){return root.querySelector(s)}
function esc(x){return String(x).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function D(){return PD[L][C]}function U(){return PD[L].ui}
function fmt(d,opt){try{return new Intl.DateTimeFormat(LOC[L],opt).format(d)}catch(e){return new Intl.DateTimeFormat('en-US',opt).format(d)}}
function dday(iso){return fmt(new Date(iso+'T12:00:00'),{weekday:'short',year:'numeric',month:'short',day:'numeric'})}
function dtime(iso){return fmt(new Date(iso),{weekday:'short',year:'numeric',month:'short',day:'numeric',hour:'numeric',minute:'2-digit',timeZone:'America/New_York'})}
function money(v){if(L==='pt')return 'US$ '+new Intl.NumberFormat('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:2}).format(v);if(L==='uk'||L==='uz')return new Intl.NumberFormat('uk-UA',{minimumFractionDigits:2,maximumFractionDigits:2}).format(v)+' $';return '$'+v.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2})}
function paid(){return SH[C].paid}function due(){return SH[C].total-paid()}
var TODAY='2026-09-28';
function daysTo(iso){return Math.round((Date.parse(iso.slice(0,10)+'T12:00:00Z')-Date.parse(TODAY+'T12:00:00Z'))/864e5)}
function rel(n){try{return new Intl.RelativeTimeFormat(LOC[L],{numeric:'auto'}).format(n,'day')}catch(e){return new Intl.RelativeTimeFormat('en-US',{numeric:'auto'}).format(n,'day')}}
function aiBox(){var u=U(),d=D(),S=SH[C],n=S.files.reduce(function(a,f){return a+f.length},0),next=null;
  S.dates.forEach(function(ev){var iso=ev.d||ev.s;if(iso&&daysTo(iso)>=0&&(!next||daysTo(iso)<daysTo(next)))next=iso});
  var h='<section class="cpd-ai" aria-labelledby="cpdAiT"><div class="cpd-ai-hd"><h3 id="cpdAiT">'+esc(u.aiTitle)+'</h3><small>'+esc(u.aiChecked.replace('{d}',dday(TODAY)))+'</small></div>';
  h+='<div class="cpd-ai-stats"><div><b>'+n+'</b><small>'+esc(u.aiOnFile)+'</small></div><div><b>'+d.aiNeed.length+'</b><small>'+esc(u.aiMissing)+'</small></div>'+(next?'<div><b>'+esc(rel(daysTo(next)))+'</b><small>'+esc(u.aiNext)+'</small></div>':'')+'</div>';
  h+='<ul class="cpd-ai-list">'+d.aiNeed.map(function(t,i){var m=S.aiNeed[i];return '<li><span class="cpd-ai-who '+m[0]+'">'+esc(m[0]==='you'?u.aiYou:u.aiFirm)+'</span><span class="cpd-ai-t">'+esc(t)+'<small>'+esc(m[1]?u.aiBy.replace('{d}',dday(m[1]))+' · '+rel(daysTo(m[1])):u.aiNow)+'</small></span>'+(m[2]>=0?'<button type="button" class="cpd-mini" data-go="'+m[2]+'">'+esc(u.tabs[m[2]])+' →</button>':'')+'</li>'}).join('')+'</ul>';
  return h+'</section>'}
function chrome(){var u=U();root.setAttribute('lang',L);$('.cpd-title').textContent=u.title;sim.querySelector('#cpdCaseLbl').textContent=u.caseLbl;sim.querySelector('#cpdLangLbl').textContent=u.langLbl;
  [].forEach.call(sim.querySelectorAll('.cpd-case'),function(b){b.textContent=PD[L][b.dataset.c].pick;b.setAttribute('aria-pressed',b.dataset.c===C?'true':'false')});
  [].forEach.call(sim.querySelectorAll('.cpd-lang'),function(b){b.setAttribute('aria-pressed',b.dataset.l===L?'true':'false')});
  [].forEach.call(root.querySelectorAll('[role=tab]'),function(t,i){t.querySelector('.tl').textContent=u.tabs[i];t.setAttribute('aria-selected',i===T?'true':'false');t.tabIndex=i===T?0:-1});
  $('.cpd-tabs').setAttribute('aria-label',u.portalSections);fade();var d=D();$('#cpdWho').innerHTML='<b>'+esc(d.name)+'</b><span>'+esc(d.kind)+'</span>'}
function fade(){var b=$('.cpd-tabs');if(!b)return;var r=b.scrollLeft+b.clientWidth<b.scrollWidth-4,l=b.scrollLeft>4;b.classList.toggle('more',r&&!l);b.classList.toggle('less',l&&!r);b.classList.toggle('both',l&&r)}
function say(t){var s=$('#cpdStatus');s.textContent='';setTimeout(function(){s.textContent=t},30)}
function view(k){return '<button type="button" class="cpd-mini" data-open="'+k+'">'+esc(U().viewCopy)+'</button>'}
function calBtns(){var u=U();return '<span class="cpd-cal"><button type="button" class="cpd-mini" data-demo>'+esc(u.addCal)+'</button><button type="button" class="cpd-mini" data-demo>'+esc(u.google)+'</button></span>'}
function overview(){var u=U(),d=D(),S=SH[C],h='';
  h+='<div class="cpd-ids">'+d.ids.map(function(r){return '<div><small>'+esc(r[0])+'</small><b'+(/\d{3}/.test(r[1])?' class="cpd-num"':'')+'>'+esc(r[1])+'</b></div>'}).join('')+'</div>'+aiBox();
  h+='<h3>'+esc(u.stand)+'</h3><p class="cpd-stage">'+esc(d.stage)+'</p><ol class="cpd-steps">'+d.steps.map(function(s,i){return '<li class="'+(i<S.cur?'done':i===S.cur?'cur':'')+'"'+(i===S.cur?' aria-current="step"':'')+'>'+esc(s)+'</li>'}).join('')+'</ol>';
  if(d.alert)h+='<div class="cpd-alert" role="note"><b>'+esc(u.important)+'</b><p>'+esc(d.alert)+'</p></div>';
  if(d.receipts)h+='<h3>'+esc(d.rcTitle)+'</h3><ul class="cpd-rc">'+d.receipts.map(function(r,i){return '<li><b>'+esc(r[0])+'</b><span>'+esc(S.receiptNums[i]||'')+'</span><small>'+esc(r[1])+'</small>'+(S.rcKeys[i]?'<span class="cpd-rcv">'+view(S.rcKeys[i])+'</span>':'')+'</li>'}).join('')+'</ul>';
  if(d.note)h+='<div class="cpd-info" role="note"><p>'+esc(d.note)+'</p></div>';
  if(d.charges)h+='<h3>'+esc(d.chargesTitle)+'</h3><ul class="cpd-list">'+d.charges.map(function(c){return '<li>'+esc(c)+'</li>'}).join('')+'</ul><div class="cpd-row">'+view('complaint')+'</div><h3>'+esc(d.releaseTitle)+'</h3><p>'+esc(d.release)+'</p><div class="cpd-row">'+view('release')+'</div>';
  h+='<h3>'+esc(u.next)+'</h3><ul class="cpd-dates">'+d.dates.map(function(x,i){var ev=S.dates[i],when=ev.none?'':ev.d?dday(ev.d):dtime(ev.s);var iso=ev.d||ev.s;return '<li>'+(when?'<span>'+esc(when)+' · <em class="cpd-rel">'+esc(rel(daysTo(iso)))+'</em></span>':'')+'<b>'+esc(x[0])+'</b><small>'+esc(x[1])+'</small>'+(ev.none?'':calBtns())+'</li>'}).join('')+'</ul>';
  h+='<div class="cpd-row"><button type="button" class="btn solid" data-demo>'+esc(u.addAll)+'</button></div>';
  return h+'<h3>'+esc(u.team)+'</h3><p>'+d.team.map(esc).join(' · ')+'</p>'}
function updates(){var u=U(),d=D(),S=SH[C];return '<ul class="cpd-upd">'+d.updates.map(function(x,i){return '<li><img src="/icons/'+S.upd[i][0]+'.png" alt="" width="32" height="32"><div><small>'+esc(x[0])+' · '+esc(dday(S.upd[i][1]))+'</small><b>'+esc(x[1])+'</b><p>'+esc(x[2])+'</p></div></li>'}).join('')+'</ul>'}
function appts(){var u=U(),d=D(),S=SH[C],h='<h3>'+esc(u.book)+'</h3><fieldset class="cpd-fs"><legend>'+esc(u.type)+'</legend>'+d.apptTypes.map(function(t,i){return '<label class="cpd-opt"><input type="radio" name="cpdType" value="'+i+'"'+(i===selType?' checked':'')+'> '+esc(t)+'</label>'}).join('')+'</fieldset>';
  h+='<fieldset class="cpd-fs"><legend>'+esc(u.pickTime)+'</legend><div class="cpd-slots">'+S.slots.map(function(s,i){return '<label class="cpd-slot'+(i===selSlot?' sel':'')+'"><input type="radio" name="cpdSlot" value="'+i+'"'+(i===selSlot?' checked':'')+'> '+esc(dtime(s))+'</label>'}).join('')+'</div></fieldset>';
  h+='<div class="cpd-row"><button type="button" class="btn solid" data-demo>'+esc(u.confirm)+'</button></div>';
  return h+'<h3>'+esc(u.yourAppts)+'</h3><p class="cpd-note">'+esc(u.noAppts)+'</p>'}
function sign(){var u=U(),d=D(),S=SH[C],h='<h3>'+esc(u.toSign)+'</h3><ul class="cpd-docs">'+d.docs.map(function(x,i){var done=S.docSigned[i];return '<li><button type="button" class="cpd-doc'+(i===selDoc?' sel':'')+'" data-doc="'+i+'" aria-pressed="'+(i===selDoc)+'"><b>'+esc(x[0])+'</b><span class="chip '+(done?'ok':'soon')+'">'+esc(done?u.signed:u.needsSig)+'</span></button></li>'}).join('')+'</ul>';
  var x=d.docs[selDoc],done=S.docSigned[selDoc];
  h+='<article class="cpd-paper" aria-labelledby="cpdDocT"><h5 id="cpdDocT">'+esc(x[0])+'</h5><p>'+esc(x[1])+'</p>';
  if(done)h+='<p class="cpd-ok">'+esc(u.signed)+'</p>';
  else h+='<label class="cpd-opt"><input type="checkbox" disabled> '+esc(u.readAck)+'</label><p class="cpd-lbl">'+esc(u.drawSig)+'</p><div class="cpd-pad off" aria-hidden="true"></div><label class="cpd-lbl" for="cpdTyped">'+esc(u.typeSig)+'</label><input class="cpd-in" id="cpdTyped" type="text" disabled><div class="cpd-row"><button type="button" class="btn solid" data-demo>'+esc(u.signBtn)+'</button></div>';
  return h+'</article>'}
var SV=function(x){return '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">'+x+'</svg>'};
/* Icons: Lucide (lucide-static 1.48.0), ISC license; full notice in /assets/licenses/lucide-LICENSE.txt */
var FICON=SV('<path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" />'),CL=SV('<path d="m15 18-6-6 6-6" />'),CR=SV('<path d="m9 18 6-6-6-6" />');
function folderOf(k){var S=SH[C];for(var i=0;i<S.files.length;i++)for(var j=0;j<S.files[i].length;j++)if(S.files[i][j][1]===k)return i;return -1}
function allKeys(){return SH[C].files.reduce(function(a,f){return a.concat(f)},[])}
function files(){var u=U(),d=D(),S=SH[C],h;
  if(FO<0){h='<ul class="cpd-folders">'+d.folders.map(function(f,i){return '<li><button type="button" class="cpd-fo" data-fo="'+i+'">'+FICON+'<span>'+esc(f)+'</span><b>'+S.files[i].length+'</b>'+CR+'</button></li>'}).join('')+'</ul>';}
  else{h='<ul class="cpd-thumbs">'+S.files[FO].map(function(x){return '<li><button type="button" class="cpd-th" data-k="'+x[1]+'"><img src="'+DOCS+'t/'+x[1]+'.jpg" alt="" width="150" height="194" loading="lazy" draggable="false"><span>'+esc(x[0])+'</span></button></li>'}).join('')+'</ul>';}
  return h+'<div class="cpd-row"><button type="button" class="btn line cpd-up" data-demo>'+esc(u.upload)+'</button></div>'}
function messages(){var u=U(),d=D();return '<div class="cpd-chat" id="cpdChat">'+d.msgs.map(function(m){return m[0]==='c'?'<div class="cpd-m c">'+esc(m[1])+'</div>':'<div class="cpd-m t"><small>'+esc(m[1])+'</small>'+esc(m[2])+'<small class="rv">'+esc(u.reviewed)+'</small></div>'}).join('')+'</div>'+
  '<form class="cpd-ask" id="cpdAsk" novalidate><label class="sr-only" for="cpdQ">'+esc(u.askPh)+'</label><input id="cpdQ" type="text" placeholder="'+esc(u.askPh)+'" autocomplete="off"><button type="submit" class="btn solid">'+esc(u.send)+'</button></form>'}
function billing(){var u=U(),d=D(),S=SH[C],dv=due(),amt=payAmt==='full'?dv:Math.min(S.inst,dv),h='<div class="cpd-bill"><div><small>'+esc(u.total)+'</small><b>'+money(S.total)+'</b></div><div><small>'+esc(u.paid)+'</small><b>'+money(paid())+'</b></div><div class="due"><small>'+esc(u.due)+'</small><b>'+money(dv)+'</b></div></div>';
  h+='<p><b>'+esc(u.planL)+':</b> '+esc(d.planTxt)+'</p><h3>'+esc(u.history)+'</h3><ul class="cpd-pay">'+S.payments.map(function(x){return '<li><span>'+esc(dday(x[0]))+'</span><b>'+money(x[1])+'</b></li>'}).join('')+'</ul>';
  h+='<fieldset class="cpd-fs"><legend>'+esc(u.amount)+'</legend><label class="cpd-opt"><input type="radio" name="cpdAmt" value="inst"'+(payAmt==='inst'?' checked':'')+'> '+esc(u.nextInst)+' · '+money(Math.min(S.inst,dv))+'</label><label class="cpd-opt"><input type="radio" name="cpdAmt" value="full"'+(payAmt==='full'?' checked':'')+'> '+esc(u.fullBal)+' · '+money(dv)+'</label></fieldset><fieldset class="cpd-fs"><legend>'+esc(u.method)+'</legend><label class="cpd-opt"><input type="radio" name="cpdMeth" value="card"'+(payMeth==='card'?' checked':'')+'> '+esc(u.card)+'</label><label class="cpd-opt"><input type="radio" name="cpdMeth" value="bank"'+(payMeth==='bank'?' checked':'')+'> '+esc(u.bank)+'</label></fieldset>';
  return h+'<div class="cpd-row"><button type="button" class="btn solid" data-demo>'+esc(u.payNow.replace('{a}',money(amt)))+'</button></div>'}
var PANELS=[overview,updates,appts,sign,files,messages,billing];
function render(dir){var p=$('#cpdPanel');var inF=T===4&&FO>=0;p.innerHTML=(inF?'<button type="button" class="cpd-back" data-back>'+CL+'<span>'+esc(U().tabs[4])+'</span></button>':'')+'<h2 class="cpd-large">'+esc(inF?D().folders[FO]:U().tabs[T])+'</h2>'+PANELS[T]();p.classList.remove('push','pop');if(dir&&!reduce){void p.offsetWidth;p.classList.add(dir)}p.setAttribute('aria-labelledby','cpdTab'+T);p.scrollTop=0;wire()}
function all(){chrome();render()}
function demo(){say(U().demoOnly)}
function openDoc(k){var ks=allKeys(),i=-1;ks.forEach(function(x,j){if(x[1]===k)i=j});if(i<0)return;FV=k;FO=folderOf(k);
  var v=$('#cpdView');if(!v){v=document.createElement('div');v.id='cpdView';v.className='cpd-view';v.setAttribute('role','dialog');v.setAttribute('aria-modal','true');v.setAttribute('aria-labelledby','cpdViewT');v.setAttribute('aria-describedby','cpdViewD');root.appendChild(v)}
  var u=U(),x=ks[i];
  v.innerHTML='<div class="cpd-vbar"><button type="button" class="cpd-vx" data-close aria-label="'+esc(u.closeViewer)+'">'+CL+'</button><b id="cpdViewT">'+esc(x[0])+'</b><span>'+(i+1)+' / '+ks.length+'</span></div>'+
    '<p class="sr-only" id="cpdViewD">'+esc(DSUM[k]||'')+'</p>'+
    '<div class="cpd-vbody"><img src="'+DOCS+k+'.jpg" alt="'+esc(x[0])+'" draggable="false"></div>'+
    '<div class="cpd-vnav"><button type="button" data-step="-1" aria-label="'+esc(u.prevDoc)+'"'+(i===0?' disabled':'')+'>'+CL+'</button><button type="button" data-step="1" aria-label="'+esc(u.nextDoc)+'"'+(i===ks.length-1?' disabled':'')+'>'+CR+'</button></div>';
  var was=v.hidden!==false||!v.dataset.open;v.dataset.open='1';v.hidden=false;root.classList.add('viewing');if(was&&!reduce){v.classList.remove('rise');void v.offsetWidth;v.classList.add('rise')}
  var img=v.querySelector('img');img.onclick=function(){v.classList.toggle('zoom')};v.classList.remove('zoom');
  v.oncontextmenu=function(e){e.preventDefault()};
  v.querySelector('[data-close]').onclick=closeDoc;
  [].forEach.call(v.querySelectorAll('[data-step]'),function(b){b.onclick=function(){var n=ks[i+(+b.dataset.step)];if(n)openDoc(n[1])}});
  v.onkeydown=function(e){if(e.key==='Escape'){e.preventDefault();closeDoc()}if(e.key==='ArrowRight'&&ks[i+1])openDoc(ks[i+1][1]);if(e.key==='ArrowLeft'&&ks[i-1])openDoc(ks[i-1][1]);
    if(e.key==='Tab'){var f=[].filter.call(v.querySelectorAll('button'),function(b){return !b.disabled});if(!f.length)return;var a=f[0],z=f[f.length-1];if(e.shiftKey&&document.activeElement===a){e.preventDefault();z.focus()}else if(!e.shiftKey&&document.activeElement===z){e.preventDefault();a.focus()}}};
  v.querySelector('[data-close]').focus();say(x[0])}
function closeDoc(){var v=$('#cpdView');if(!v)return;v.hidden=true;delete v.dataset.open;root.classList.remove('viewing');var k=FV;FV=null;if(T!==4){setTab(4,false)}else render();var b=root.querySelector('.cpd-th[data-k="'+k+'"]');if(b)b.focus()}
function wire(){
  [].forEach.call(root.querySelectorAll('[data-go]'),function(b){b.onclick=function(){if(+b.dataset.go===4)FO=-1;setTab(+b.dataset.go,true)}});
  [].forEach.call(root.querySelectorAll('[data-demo]'),function(b){b.onclick=demo});
  [].forEach.call(root.querySelectorAll('[data-open]'),function(b){b.onclick=function(){var k=b.dataset.open;FO=folderOf(k);setTab(4,false);openDoc(k)}});
  [].forEach.call(root.querySelectorAll('[data-fo]'),function(b){b.onclick=function(){FO=+b.dataset.fo;render('push');var f=root.querySelector('.cpd-back');if(f)f.focus()}});
  [].forEach.call(root.querySelectorAll('[data-back]'),function(b){b.onclick=function(){var o=FO;FO=-1;render('pop');var f=root.querySelector('[data-fo="'+o+'"]');if(f)f.focus()}});
  [].forEach.call(root.querySelectorAll('.cpd-th'),function(b){b.onclick=function(){openDoc(b.dataset.k)}});
  [].forEach.call(root.querySelectorAll('.cpd-th img'),function(i){i.oncontextmenu=function(e){e.preventDefault()}});
  [].forEach.call(root.querySelectorAll('input[name=cpdType]'),function(r){r.onchange=function(){selType=+r.value}});
  [].forEach.call(root.querySelectorAll('input[name=cpdSlot]'),function(r){r.onchange=function(){selSlot=+r.value;[].forEach.call(root.querySelectorAll('.cpd-slot'),function(l,i){l.classList.toggle('sel',i===selSlot)})}});
  [].forEach.call(root.querySelectorAll('.cpd-doc'),function(b){b.onclick=function(){selDoc=+b.dataset.doc;render()}});
  var f=$('#cpdAsk');if(f)f.onsubmit=function(e){e.preventDefault();demo()};
  [].forEach.call(root.querySelectorAll('input[name=cpdAmt]'),function(r){r.onchange=function(){payAmt=r.value;render()}});
  [].forEach.call(root.querySelectorAll('input[name=cpdMeth]'),function(r){r.onchange=function(){payMeth=r.value}});
}
function setTab(i,focus){var v=$('#cpdView');if(v&&!v.hidden){v.hidden=true;root.classList.remove('viewing');FV=null}
  T=i;chrome();render();var t=root.querySelectorAll('[role=tab]')[i],bar=t.parentElement;bar.scrollLeft=Math.max(0,t.offsetLeft-(bar.clientWidth-t.offsetWidth)/2);fade();root.scrollLeft=0;root.scrollTop=0;if(focus)t.focus({preventScroll:true})}
[].forEach.call(root.querySelectorAll('[role=tab]'),function(t,i){t.onclick=function(){if(i===4)FO=-1;setTab(i)};t.onkeydown=function(e){var n=root.querySelectorAll('[role=tab]').length,k=e.key;if(k==='ArrowRight'||k==='ArrowDown'){e.preventDefault();setTab((i+1)%n,true)}if(k==='ArrowLeft'||k==='ArrowUp'){e.preventDefault();setTab((i+n-1)%n,true)}if(k==='Home'){e.preventDefault();setTab(0,true)}if(k==='End'){e.preventDefault();setTab(n-1,true)}}});
[].forEach.call(sim.querySelectorAll('.cpd-case'),function(b){b.onclick=function(){C=b.dataset.c;selDoc=0;selSlot=-1;FO=-1;setTab(T,false);say(D().name)}});
[].forEach.call(sim.querySelectorAll('.cpd-lang'),function(b){b.onclick=function(){L=b.dataset.l;var v=$('#cpdView'),k=FV;all();if(k&&v&&!v.hidden)openDoc(k);langCur(b);var d=b.closest('details');if(d){d.open=false;d.querySelector('summary').focus({preventScroll:true})}say(b.textContent)}});
function langCur(b){var c=document.getElementById('cpdLangCur');if(c)c.textContent=b.textContent.trim()}
(function(){var m=document.getElementById('cpdLangMenu');if(!m)return;var on=sim.querySelector('.cpd-lang[aria-pressed="true"]');if(on)langCur(on);document.addEventListener('click',function(e){if(m.open&&!m.contains(e.target))m.open=false});m.addEventListener('keydown',function(e){if(e.key==='Escape'&&m.open){m.open=false;m.querySelector('summary').focus()}})})();
$('.cpd-tabs').addEventListener('scroll',fade,{passive:true});addEventListener('resize',fade);
all();
})();
