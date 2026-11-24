/* LUMI 0.5 — Bản đồ kéo/zoom, hiệu ứng tưới cây, tiến độ công trình.
   Không tạo khóa lưu trữ mới. Dữ liệu do garden.js quản lý (lumi_garden_v02). */
'use strict';
(function () {
  const viewport=document.getElementById('farmViewport');
  const map=document.getElementById('farmMap');
  if(!viewport||!map)return;
  const MW=800,MH=1260;
  let scale=0.5, x=0, y=0, active=null, moved=false;
  const zoomLabel=document.getElementById('zoomLevel');
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function fitScale(){return Math.min(1,Math.max(.32,(viewport.clientWidth-5)/MW));}
  function bound(){
    const vw=viewport.clientWidth,vh=viewport.clientHeight,w=MW*scale,h=MH*scale;
    x=w<=vw?(vw-w)/2:Math.max(vw-w,Math.min(0,x));
    y=h<=vh?(vh-h)/2:Math.max(vh-h,Math.min(0,y));
  }
  function paint(){bound();map.style.transform=`translate3d(${x}px,${y}px,0) scale(${scale})`;zoomLabel.textContent=Math.round(scale/fitScale()*100)+'%';}
  function reset(){scale=fitScale();x=(viewport.clientWidth-MW*scale)/2;y=0;paint();}
  function zoom(factor){
    const old=scale,newScale=Math.min(1.25,Math.max(fitScale()*.85,old*factor));
    const cx=viewport.clientWidth/2,cy=viewport.clientHeight/2;
    x=cx-(cx-x)*newScale/old;y=cy-(cy-y)*newScale/old;
    scale=newScale;paint();
  }
  document.getElementById('zoomIn')?.addEventListener('click',()=>zoom(1.24));
  document.getElementById('zoomOut')?.addEventListener('click',()=>zoom(1/1.24));
  document.getElementById('zoomReset')?.addEventListener('click',reset);
  viewport.addEventListener('pointerdown',function(e){
    if(e.button!==0||e.target.closest('button'))return;
    active={id:e.pointerId,cx:e.clientX,cy:e.clientY,x,y};moved=false;
    map.classList.add('is-dragging');viewport.setPointerCapture(e.pointerId);
  });
  viewport.addEventListener('pointermove',function(e){
    if(!active||e.pointerId!==active.id)return;
    const dx=e.clientX-active.cx,dy=e.clientY-active.cy;
    if(Math.abs(dx)+Math.abs(dy)>4)moved=true;
    x=active.x+dx;y=active.y+dy;paint();
  });
  function stop(e){if(!active||e.pointerId!==active.id)return;active=null;map.classList.remove('is-dragging');}
  viewport.addEventListener('pointerup',stop);viewport.addEventListener('pointercancel',stop);
  viewport.addEventListener('wheel',function(e){if(!e.ctrlKey)return;e.preventDefault();zoom(e.deltaY<0?1.12:1/1.12)},{passive:false});
  const resize=new ResizeObserver(()=>{const previous=scale;const fit=fitScale();if(previous<fit){reset();}else paint();});resize.observe(viewport);
  reset();
  // Visual tiers inferred from unlocked fruit count; actual construction remains gated by garden.js.
  function updateStages(){
    const n=(typeof state!=='undefined'&&Array.isArray(state.done))?state.done.length:0;
    const stages={chapel:Math.min(3,n>=8?3:n>=5?2:n>=2?1:0),church:Math.min(3,n>=12?3:n>=10?2:n>=8?1:0)};
    ['chapel','church'].forEach(which=>{
      const el=viewport.querySelector('[data-building="'+which+'"]');if(!el)return;
      const built=typeof state!=='undefined'&&!!state[which+'Built'];
      const st=stages[which];el.dataset.stage=String(st);el.classList.toggle('is-built',built);
      el.dataset.stageLabel=built?'✓ Hoàn thành':['Dự kiến','Nền móng','Đang xây','Sẵn sàng'][st];
      let scaffold=el.querySelector('.farm-construction');
      if(!scaffold){scaffold=document.createElement('span');scaffold.className='farm-construction';scaffold.setAttribute('aria-hidden','true');el.appendChild(scaffold);}
    });
  }
  const progress=document.getElementById('progressText');
  if(progress){new MutationObserver(updateStages).observe(progress,{childList:true,characterData:true,subtree:true});}
  updateStages();
  // Animation is invoked only after the actual care counter increments.
  const care=document.getElementById('careBtn');
  care?.addEventListener('click',()=>{
    const countBefore=Number(document.getElementById('care')?.textContent||0);
    requestAnimationFrame(()=>{
      const countAfter=Number(document.getElementById('care')?.textContent||0);
      if(countAfter<=countBefore)return;
      const crops=[...viewport.querySelectorAll('.plot:not(.locked)')];
      const target=crops.find(el=>el.querySelector('.plant-art'))||crops[0];
      if(!target)return;
      target.classList.remove('farm-grow-now');void target.offsetWidth;target.classList.add('farm-grow-now');
      if(reduced)return;
      const rect=target.getBoundingClientRect(),vr=viewport.getBoundingClientRect();
      for(let i=0;i<7;i++){
        const drop=document.createElement('span');drop.className='farm-water-particle';drop.textContent=i%3?'💧':'✨';
        drop.style.left=(rect.left-vr.left+rect.width*(.18+.13*i))+'px';
        drop.style.top=(rect.top-vr.top+rect.height*.2)+'px';
        drop.style.animationDelay=(i*65)+'ms';viewport.appendChild(drop);
        setTimeout(()=>drop.remove(),1800);
      }
    });
  });
  // Re-evaluate construction status on button clicks after garden.js updates state.
  document.addEventListener('click',e=>{if(e.target.closest('[data-build]'))requestAnimationFrame(updateStages)});
})();
