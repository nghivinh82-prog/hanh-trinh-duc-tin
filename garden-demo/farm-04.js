/* LUMI 0.4: hiệu ứng phản hồi. Logic lưu trò chơi nằm trong garden.js. */
'use strict';
(function(){
  const world=document.getElementById('farmMap');
  if(!world)return;
  world.addEventListener('click',function(ev){
    const tile=ev.target.closest('[data-plot]');
    if(!tile)return;
    tile.classList.remove('farm-highlight');
    void tile.offsetWidth;
    tile.classList.add('farm-highlight');
  });
  const care=document.getElementById('careBtn');
  care?.addEventListener('click',function(){
    const before=Number(document.getElementById('care')?.textContent||0);
    requestAnimationFrame(()=>{
      const after=Number(document.getElementById('care')?.textContent||0);
      if(after<=before)return;
      const tile=document.querySelector('.plot:not(.locked)');
      if(tile){tile.classList.remove('farm-highlight');void tile.offsetWidth;tile.classList.add('farm-highlight')}
      const drop=document.createElement('span');drop.textContent='💧✨';
      drop.style.cssText='position:absolute;z-index:10;top:44%;left:49%;font-size:32px;pointer-events:none;animation:cropPop .65s ease-out both';
      world.append(drop);setTimeout(()=>drop.remove(),1000);
    });
  });
})();
