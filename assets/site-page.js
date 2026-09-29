/* Site menu and reveal-on-scroll for simple pages (landing pages, 404). */
(function(){
  var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  var d=document.getElementById('drawer'),o=document.getElementById('openMenu'),c=document.getElementById('closeMenu');
  function closeMenu(){d.hidden=true;o.setAttribute('aria-expanded','false');o.focus()}
  o.onclick=function(){d.hidden=false;o.setAttribute('aria-expanded','true');c.focus()};c.onclick=closeMenu;
  d.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){d.hidden=true;o.setAttribute('aria-expanded','false')})});
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&!d.hidden)closeMenu()});
  var rv=[].slice.call(document.querySelectorAll('.reveal'));
  if(innerWidth>=760)rv.forEach(function(e){var p=e.parentElement;if(!p)return;var w=e.closest('.wrap')||p,pr=w.getBoundingClientRect(),r=e.getBoundingClientRect();if(r.width<pr.width*.8){e.style.setProperty('--rx',(r.left+r.width/2<pr.left+pr.width/2?-24:24)+'px');e.style.setProperty('--ry','0px')}var i=[].indexOf.call(p.children,e);if(!e.style.getPropertyValue('--d'))e.style.setProperty('--d',Math.min(Math.max(i,0),4)*.07+'s')});
  if(reduce||!('IntersectionObserver' in window)){rv.forEach(function(e){e.classList.add('in')})}
  else{var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{rootMargin:'0px 0px -6% 0px',threshold:.1});rv.forEach(function(e){io.observe(e)})}
})();
