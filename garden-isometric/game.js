'use strict';
/* LUMI 0.7 Isometric demo. Independent scene; keeps the 0.5/0.6 save schema. */
(() => {
  const KEY = 'lumi_garden_v02';
  const W = 900, H = 1200;
  const FRUITS = [
    {name:'Bác ái', slug:'love', ref:'Lc 10,25–37', question:'Ai đã giúp đỡ người bị nạn trong dụ ngôn người Samari nhân hậu?', choices:['Người Samari','Một người lính','Một người chủ quán'], answer:0, explanation:'Người Samari đã dừng lại chăm sóc người bị nạn; yêu thương cần đi cùng hành động.'},
    {name:'Hoan lạc', slug:'joy', ref:'Lc 2,10–11', question:'Trong lời loan báo của thiên thần ở Bêlem, điều gì được mang đến cho muôn dân?', choices:['Một cuộc thi','Một tin mừng trọng đại','Một mệnh lệnh xây thành'], answer:1, explanation:'Thiên thần loan báo tin mừng trọng đại về Đấng Cứu Độ.'},
    {name:'Bình an', slug:'peace', ref:'Ga 20,19', question:'Khi hiện ra với các môn đệ, Chúa Giêsu nói lời nào?', choices:['Hãy tranh luận','Bình an cho anh em','Hãy trốn đi'], answer:1, explanation:'Lời chào bình an của Chúa giúp người môn đệ can đảm và tin tưởng.'}
  ];
  const $ = id => document.getElementById(id);
  const safeInt=(v,min,max)=>Number.isFinite(Number(v))?Math.min(max,Math.max(min,Math.trunc(Number(v)))):min;
  function readState() {
    const defaults={done:[],growth:Array(12).fill(0),lastCare:'',careCount:0,chapelBuilt:false,churchBuilt:false};
    try {
      const obj=JSON.parse(localStorage.getItem(KEY)||'null');
      if(obj&&Array.isArray(obj.done)&&Array.isArray(obj.growth)) {
        return {...defaults,...obj,done:[...new Set(obj.done.filter(x=>Number.isInteger(x)&&x>=0&&x<12))],growth:Array.from({length:12},(_,i)=>safeInt(obj.growth[i],0,4))};
      }
    } catch(_error) { /* Keep the user playing without destroying old data. */ }
    return defaults;
  }
  let state=readState(), selected=0, scene=null, game=null;
  const canUse=i=>i===0||state.done.includes(i);
  const today=()=>{const d=new Date();return [d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-')};
  function writeState(){try{localStorage.setItem(KEY,JSON.stringify(state));return true}catch(_error){$('status').textContent='Không thể lưu tiến trình trên thiết bị này.';return false}}
  function updateStats(){ $('seeds').textContent=1+state.done.filter(i=>i!==0).length; $('missionsDone').textContent=state.done.length+'/12'; $('careCount').textContent=state.careCount; }
  function openDialog(title){$('dlgTitle').textContent=title;$('dlgBody').replaceChildren();$('overlay').hidden=false;$('close').focus()}
  function closeDialog(){$('overlay').hidden=true}
  $('close').onclick=closeDialog; $('overlay').addEventListener('click',e=>{if(e.target===$('overlay'))closeDialog()});document.addEventListener('keydown',e=>{if(e.key==='Escape')closeDialog()});
  function el(tag,text,cl){const node=document.createElement(tag);if(text!==undefined)node.textContent=text;if(cl)node.className=cl;return node}
  function button(text,cb){const b=el('button',text,'green');b.type='button';b.onclick=cb;return b}
  function plantInfo(i){state=readState();selected=i;const f=FRUITS[i];openDialog('🌱 '+f.name);const body=$('dlgBody');body.append(el('span',canUse(i)?'Đã khám phá':'Chưa mở khóa','badge'));body.append(el('p',canUse(i)?`Cây của bạn hiện ở giai đoạn ${state.growth[i]}/4.`:'Hãy hoàn thành câu hỏi để mở hạt giống này.'));body.append(el('p',`Lời Chúa: ${f.ref}. ${f.explanation}`));body.append(button('📖 Xem nhiệm vụ',()=>showQuestion(i)));}
  function showMissions(){state=readState();openDialog('📖 Nhiệm vụ Kinh Thánh');const body=$('dlgBody');body.append(el('p','Bản thử nghiệm 0.7 giới thiệu ba nhiệm vụ đầu. Các nhiệm vụ đã hoàn thành vẫn được giữ nguyên.','muted'));FRUITS.forEach((f,i)=>{const b=el('button',`${state.done.includes(i)?'✓ ':''}${i+1}. ${f.name} · ${f.ref}`,'option');b.onclick=()=>showQuestion(i);body.append(b)});}
  function showQuestion(i){state=readState();const f=FRUITS[i];openDialog('🌿 Khám phá '+f.name);const body=$('dlgBody');body.append(el('p',f.ref+' · '+f.question));if(state.done.includes(i)){body.append(el('p','✓ Nhiệm vụ này đã hoàn thành. '+f.explanation));body.append(button('Trở lại khu vườn',closeDialog));return}
    const feedback=el('p','','muted');f.choices.forEach((choice,j)=>{const b=el('button',String.fromCharCode(65+j)+'. '+choice,'option');b.onclick=()=>{if(j!==f.answer){b.classList.add('incorrect');feedback.textContent='Bạn thử lựa chọn khác nhé.';return}b.classList.add('correct');if(!state.done.includes(i)){state.done.push(i);state.growth[i]=Math.max(state.growth[i],1);if(!writeState()){feedback.textContent='Chưa thể lưu tiến trình. Hãy kiểm tra chế độ riêng tư của trình duyệt.';return}} body.querySelectorAll('button.option').forEach(x=>x.disabled=true);feedback.textContent='✓ Chính xác! '+f.explanation;body.append(button('🌱 Trở lại khu vườn',()=>{closeDialog();scene?.refresh();updateStats()}));scene?.refresh();updateStats()};body.append(b)});body.append(feedback);
  }
  function care(){state=readState();if(state.lastCare===today()){$('status').textContent='💧 Hôm nay bạn đã chăm cây rồi. Hẹn ngày mai nhé!';return}
    let i=canUse(selected)&&state.growth[selected]<4?selected:FRUITS.findIndex((_,j)=>canUse(j)&&state.growth[j]<4);
    if(i<0){$('status').textContent='Các cây đang xem đã trưởng thành.';return}
    state.growth[i]++;state.lastCare=today();state.careCount=safeInt(state.careCount,0,10000000)+1;
    if(!writeState())return;updateStats();scene?.refresh();scene?.waterAt(i);$('status').textContent='💧 Đã chăm cây '+FRUITS[i].name+' · '+state.growth[i]+'/4';
  }
  $('missions').onclick=showMissions;$('water').onclick=care;
  if(typeof Phaser==='undefined'){$('status').textContent='Không tải được Phaser. Hãy kiểm tra kết nối internet hoặc trình chặn nội dung.';return}
  class Meadow extends Phaser.Scene {
    constructor(){super('Meadow');this.tiles=[];this.dragging=false;this.zoomFactor=1;this.pendingFit=0}
    preload(){
      const version='071';
      this.failedAssets=[];
      this.load.on('loaderror',file=>{
        this.failedAssets.push(file.key);
        console.warn('[LUMI] Khong tai duoc',file.key,file.src);
      });
      this.load.image('meadow','assets/meadow.webp?v='+version);
      ['soil','chapel','fence'].forEach(s=>this.load.image(s,`assets/${s}.png?v=${version}`));
      FRUITS.forEach(f=>{for(let i=0;i<5;i++)this.load.image(f.slug+'-'+i,`assets/${f.slug}-${i}.png?v=${version}`)});
    }
    create(){
      scene=this;
      const required=['meadow','soil','chapel','fence',...FRUITS.flatMap(f=>Array.from({length:5},(_,i)=>f.slug+'-'+i))];
      const missing=required.filter(k=>!this.textures.exists(k));
      if(missing.length){
        const list=[...new Set([...missing,...(this.failedAssets||[])])];
        $('status').textContent='⚠️ Không tải được hình: '+list.join(', ')+'. Kiểm tra tệp trong garden-isometric/assets hoặc GitHub Pages.';
        this.add.rectangle(W/2,H/2,W,H,0xf5f6ce);
        this.add.text(W/2,350,'⚠️ HÌNH ẢNH CHƯA TẢI ĐƯỢC\n'+list.join(', '),{
          color:'#7b2424',fontFamily:'Arial',fontSize:'27px',align:'center',wordWrap:{width:780}
        }).setOrigin(.5);
        return;
      }
      $('status').textContent='✅ Đã tải đủ hình PNG/WebP. Chạm vào cây hoặc kéo nông trại để chơi.';
      this.add.image(W/2,H/2,'meadow').setDisplaySize(W,H).setDepth(-1000);this.add.image(170,380,'fence').setDisplaySize(235,150).setAlpha(.75).setDepth(375);this.add.image(735,400,'chapel').setDisplaySize(285,230).setDepth(430).setInteractive({useHandCursor:true}).on('pointerup',()=>{if(!this.dragging){openDialog('⛪ Nguyện đường');$('dlgBody').append(el('p',`Cần khám phá 8 hoa trái để xây Nguyện đường. Hiện đã khám phá ${state.done.length}/12.`));$('dlgBody').append(el('p','Công trình hiển thị để xem trước; bản 0.7 chưa có chức năng xây dựng.'))}});
      const spots=[{x:205,y:670},{x:450,y:655},{x:695,y:680}];
      spots.forEach((p,i)=>{
        const soil=this.add.image(p.x,p.y,'soil').setDisplaySize(258,196).setDepth(p.y).setInteractive({useHandCursor:true});soil.on('pointerup',()=>{if(!this.dragging)plantInfo(i)});
        const label=this.add.text(p.x,p.y+87,FRUITS[i].name,{fontFamily:'Arial',fontSize:'23px',fontStyle:'bold',color:'#5e3515',backgroundColor:'#ffedb9',padding:{x:13,y:7}}).setOrigin(.5).setDepth(p.y+6);
        this.tiles.push({i,p,soil,label,art:null,lock:null});
      });
      this.add.image(115,1015,'fence').setDisplaySize(220,150).setDepth(1015);this.add.image(780,1040,'fence').setDisplaySize(210,150).setDepth(1040);
      this.add.text(450,970,'🌼 Khám phá thêm 9 hoa trái trong các phiên bản tiếp theo 🌼',{fontFamily:'Arial',fontSize:'19px',fontStyle:'bold',color:'#235b2c',backgroundColor:'#fff4cddd',padding:{x:12,y:9}}).setOrigin(.5).setDepth(1100);
      this.refresh();this.fit(true);
      this.scale.on('resize',()=>this.scheduleFit());if(typeof ResizeObserver!=='undefined'){this.observer=new ResizeObserver(()=>this.scheduleFit());this.observer.observe($('game'));this.events.once('shutdown',()=>this.observer.disconnect())}
      this.input.on('pointerdown',p=>{this.dragging=false;this.start={x:p.x,y:p.y}});
      this.input.on('pointermove',p=>{if(!p.isDown||!this.start)return;if(Math.hypot(p.x-this.start.x,p.y-this.start.y)>9)this.dragging=true;if(!this.dragging)return;const cam=this.cameras.main;cam.scrollX-=(p.x-p.prevPosition.x)/cam.zoom;cam.scrollY-=(p.y-p.prevPosition.y)/cam.zoom;this.clamp()});
      this.input.on('pointerup',()=>{this.start=null;this.time.delayedCall(70,()=>this.dragging=false)});
      this.events.once('shutdown',()=>cancelAnimationFrame(this.pendingFit));
      $('status').textContent='✅ Nông trại isometric đã sẵn sàng.';
    }
    refresh(){state=readState();this.tiles.forEach(t=>{t.art?.destroy();t.lock?.destroy();t.art=null;t.lock=null;const stage=state.growth[t.i];const active=canUse(t.i);if(active){t.art=this.add.image(t.p.x,t.p.y-76,FRUITS[t.i].slug+'-'+stage).setDisplaySize(195,173).setDepth(t.p.y+2).setInteractive({useHandCursor:true});t.art.on('pointerup',()=>{if(!this.dragging)plantInfo(t.i)});if(t.i===0&&stage>0)this.tweens.add({targets:t.art,y:t.p.y-81,duration:1700,yoyo:true,repeat:-1,ease:'Sine.easeInOut'})}else{t.lock=this.add.text(t.p.x,t.p.y-46,'🔒',{fontSize:'48px'}).setOrigin(.5).setDepth(t.p.y+2)};t.soil.setTint(active?0xffffff:0xdfcfb7)})}
    waterAt(i){const p=this.tiles[i].p;for(let n=0;n<13;n++){const dot=this.add.circle(p.x+Phaser.Math.Between(-70,70),p.y-165+Phaser.Math.Between(-20,20),Phaser.Math.Between(3,8),0x4cdbff,.96).setDepth(p.y+40);this.tweens.add({targets:dot,y:p.y-10,alpha:0,duration:600,delay:n*55,onComplete:()=>dot.destroy()})}}
    scheduleFit(){cancelAnimationFrame(this.pendingFit);this.pendingFit=requestAnimationFrame(()=>this.fit(false))}
    fit(center=true){const host=$('game');const w=Math.max(1,Math.round(host.clientWidth));const h=Math.max(1,Math.round(host.clientHeight));if(this.scale.gameSize.width!==w||this.scale.gameSize.height!==h)this.scale.resize(w,h);const cam=this.cameras.main;cam.setViewport(0,0,w,h);this.baseZoom=w/W;cam.setZoom(this.baseZoom*this.zoomFactor);if(center)cam.centerOn(W/2,675);this.clamp();this.game.canvas.style.width=w+'px';this.game.canvas.style.height=h+'px'}
    clamp(){const c=this.cameras.main,vw=c.width/c.zoom,vh=c.height/c.zoom;c.scrollX=vw>=W?(W-vw)/2:Phaser.Math.Clamp(c.scrollX,0,W-vw);c.scrollY=vh>=H?(H-vh)/2:Phaser.Math.Clamp(c.scrollY,0,H-vh)}
    zoom(by){const c=this.cameras.main;const x=c.midPoint.x,y=c.midPoint.y;this.zoomFactor=Phaser.Math.Clamp(this.zoomFactor*(by>0?1.22:.82),1,2.7);c.setZoom(this.baseZoom*this.zoomFactor);c.centerOn(x,y);this.clamp()}
    reset(){this.zoomFactor=1;this.fit(true)}
  }
  const host=$('game');game=new Phaser.Game({type:Phaser.AUTO,parent:'game',width:host.clientWidth,height:host.clientHeight,backgroundColor:'#62ba4b',render:{antialias:true,pixelArt:false},scale:{mode:Phaser.Scale.RESIZE,autoCenter:Phaser.Scale.NO_CENTER,width:host.clientWidth,height:host.clientHeight},scene:[Meadow]});
  $('zoomIn').onclick=()=>scene?.zoom(1);$('zoomOut').onclick=()=>scene?.zoom(-1);$('resetView').onclick=()=>scene?.reset();updateStats();document.addEventListener('visibilitychange',()=>{if(!document.hidden){state=readState();scene?.refresh();updateStats()}});
})();
