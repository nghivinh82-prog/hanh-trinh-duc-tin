'use strict';
/* LUMI Phaser 0.6.1 – camera responsive fix. Retain lumi_garden_v02 data. */
(()=>{
const KEY='lumi_garden_v02';
const names=['Bác ái','Hoan lạc','Bình an','Nhẫn nhục','Nhân hậu','Từ tâm','Quảng đại','Hiền hòa','Trung tín','Nết na','Tiết độ','Trong sạch'];
const desc=['Lc 10,25–37: Yêu thương cần đi cùng hành động.','Lc 2,10–11: Tin mừng trọng đại cho muôn dân.','Ga 20,19: Bình an cho anh em.','Ep 4,2: Khiêm tốn và nhẫn nại.','Lc 6,36: Có lòng thương xót.','Ep 4,32: Đối xử tốt với nhau.','Mc 12,41–44: Quảng đại từ tấm lòng.','Mt 11,29: Hiền lành và khiêm nhường.','Mt 25,21: Trung tín trong việc nhỏ.','Pl 4,8: Nghĩ đến điều chân thật.','1 Cr 9,25: Rèn luyện tự chủ.','Mt 5,8: Phúc cho tâm hồn trong sạch.'];
const $=id=>document.getElementById(id);
function readState(){
 let s={done:[],growth:Array(12).fill(0),lastCare:'',careCount:0,chapelBuilt:false,churchBuilt:false};
 try{const raw=JSON.parse(localStorage.getItem(KEY)||'null');if(raw&&Array.isArray(raw.done)&&Array.isArray(raw.growth))s={...s,...raw}}catch(e){}
 s.done=[...new Set(s.done.filter(i=>Number.isInteger(i)&&i>=0&&i<12))];
 s.growth=Array.from({length:12},(_,i)=>Math.max(0,Math.min(4,Number(s.growth[i])||0)));
 return s;
}
let state=readState(),selected=0,sceneRef=null,game=null;
function save(){try{localStorage.setItem(KEY,JSON.stringify(state));return true}catch(e){$('engineStatus').textContent='Không thể lưu dữ liệu trên trình duyệt này.';return false}}
function visible(i){return i===0||state.done.includes(i)}
function progress(){return state.done.length}
function updateStats(){$('seedCount').textContent=1+state.done.filter(i=>i!==0).length;$('doneCount').textContent=progress()+'/12';$('careCount').textContent=state.careCount}
// Use local calendar day, not UTC: care limits follow the player's local date.
function dayKey(){const d=new Date();return [d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-')}
function openInfo(type,index){
 const isPlant=type==='plant',name=isPlant?names[index]:(index==='chapel'?'Nguyện đường':'Nhà thờ');
 $('dialogTitle').textContent=(isPlant?'🌱 ':'⛪ ')+name;
 let body='';
 if(isPlant){selected=index;body=visible(index)?`<p><strong>Giai đoạn ${state.growth[index]}/4</strong></p><p>${desc[index]}</p>`:`<p>🔒 Hoa trái chưa mở. Hãy hoàn thành nhiệm vụ ${name} để gieo hạt.</p>`}
 else{const chapel=index==='chapel',needed=chapel?8:12,ready=chapel?progress()>=8:progress()===12&&state.chapelBuilt,built=chapel?state.chapelBuilt:state.churchBuilt;
 body=`<p>${built?'✅ Công trình đã hoàn thành.':ready?'🔨 Đã đạt điều kiện mở khóa; hãy sang bản 0.5 để xây.':'🔒 Cần '+needed+' hoa trái'+(chapel?'':' và hoàn thành Nguyện đường')+'.'}</p><p>Đã khám phá: ${progress()}/12 hoa trái.</p>`}
 $('dialogBody').innerHTML=body;$('dialogAction').textContent=isPlant?'Đến nhiệm vụ':'Xem công trình';$('dialogAction').onclick=()=>{location.href='../garden-demo/'};
 $('dialog').hidden=false;$('close').focus();
}
$('close').onclick=()=>{$('dialog').hidden=true};
$('dialog').addEventListener('click',e=>{if(e.target===$('dialog'))$('dialog').hidden=true});
document.addEventListener('keydown',e=>{if(e.key==='Escape')$('dialog').hidden=true});
function water(){
 state=readState();if(state.lastCare===dayKey()){$('engineStatus').textContent='💧 Hôm nay bạn đã chăm cây rồi. Hẹn ngày mai nhé!';return}
 let index=visible(selected)&&state.growth[selected]<4?selected:names.findIndex((_,i)=>visible(i)&&state.growth[i]<4);
 if(index<0){$('engineStatus').textContent='Các cây hiện đã trưởng thành.';return}
 state.growth[index]++;state.careCount++;state.lastCare=dayKey();
 if(!save())return;updateStats();sceneRef?.updatePlants();sceneRef?.waterEffect(index);
 $('engineStatus').textContent='💧 Đã chăm cây '+names[index]+' · giai đoạn '+state.growth[index]+'/4';
}
$('water').onclick=water;
if(typeof Phaser==='undefined'){$('engineStatus').textContent='Không tải được Phaser. Kiểm tra mạng hoặc trình chặn CDN.';return}
const W=800,H=1260,base='../garden-demo/assets/';
class FarmScene extends Phaser.Scene{
 constructor(){super('Farm');this.dragged=false;this.nodes=[];this.fitRAF=0;this.userZoom=1}
 preload(){
  this.load.svg('world',base+'farm-world.svg',{width:800,height:1260});
  this.load.svg('soil',base+'farm-plot.svg',{width:190,height:122});
  this.load.svg('chapel',base+'farm-chapel.svg',{width:220,height:210});
  this.load.svg('church',base+'farm-church.svg',{width:230,height:220});
  for(let i=0;i<12;i++)for(let g=1;g<=4;g++)this.load.svg('fruit-'+i+'-'+g,base+'fruit-'+i+'-'+g+'.svg',{width:140,height:140});
  this.load.on('loaderror',f=>{$('engineStatus').textContent='Thiếu hình '+f.key+'. Kiểm tra garden-demo/assets trên GitHub.'});
 }
 create(){
  sceneRef=this;
  this.add.image(W/2,H/2,'world').setDisplaySize(W,H).setDepth(-10);
  this.add.text(28,42,'🌱 THẾ GIỚI LUMI',{fontSize:'21px',fontFamily:'Arial',fontStyle:'bold',color:'#13512e',backgroundColor:'#fff6d8',padding:{x:15,y:9}}).setDepth(10);
  this.placeBuilding('chapel',220,408);this.placeBuilding('church',600,408);
  const positions=[];for(let row=0;row<4;row++)for(let col=0;col<3;col++)positions.push({x:135+col*265+(row%2?22:0),y:670+row*137});this.positions=positions;
  positions.forEach((p,i)=>{
   const soil=this.add.image(p.x,p.y,'soil').setDisplaySize(195,125).setInteractive({useHandCursor:true});soil.setDepth(p.y);
   soil.on('pointerup',()=>{if(!this.dragged)openInfo('plant',i)});
   const label=this.add.text(p.x,p.y+61,names[i],{fontFamily:'Arial',fontSize:'18px',fontStyle:'bold',color:'#5c361a',backgroundColor:'#fff0bf',padding:{x:8,y:3}}).setOrigin(.5).setDepth(p.y+4);
   this.nodes.push({i,p,soil,label,art:null,lock:null});
  });
  this.updatePlants();
  // Do not use Phaser camera bounds here: bounds clamp in world coordinates
  // can conflict with resize/zoom when the viewport is larger than the map.
  this.fit(true);
  this.scale.on('resize',()=>this.scheduleFit());
  this.resizeObserver=new ResizeObserver(()=>this.scheduleFit());this.resizeObserver.observe($('game'));
  this.events.once('shutdown',()=>{this.resizeObserver?.disconnect();cancelAnimationFrame(this.fitRAF)});
  this.input.on('pointerdown',p=>{this.dragged=false;this.down={x:p.x,y:p.y}});
  this.input.on('pointermove',p=>{
   if(!p.isDown||!this.down)return;
   if(Math.hypot(p.x-this.down.x,p.y-this.down.y)>9)this.dragged=true;
   if(!this.dragged)return;
   const cam=this.cameras.main;
   cam.scrollX-=(p.x-p.prevPosition.x)/cam.zoom;
   cam.scrollY-=(p.y-p.prevPosition.y)/cam.zoom;
   this.clampCam();
  });
  this.input.on('pointerup',()=>{this.down=null;setTimeout(()=>this.dragged=false,60)});
 }
 placeBuilding(type,x,y){
  const img=this.add.image(x,y,type).setDisplaySize(222,200).setDepth(y).setInteractive({useHandCursor:true});img.setAlpha(.83);
  img.on('pointerup',()=>{if(!this.dragged)openInfo('building',type)});
  const label=type==='chapel'?'Nguyện đường':'Nhà thờ';
  this.add.text(x,y+102,label,{font:'bold 23px Arial',color:'#214928',backgroundColor:'#fff4d4',padding:{x:9,y:5}}).setOrigin(.5).setDepth(y+1);
  this.add.text(x,y+142,type==='chapel'?'🔒 8 hoa trái':'🔒 12 hoa trái',{font:'bold 16px Arial',color:'#6d441c',backgroundColor:'#fff7df',padding:{x:6,y:3}}).setOrigin(.5).setDepth(y+2);
  this.buildings??={};this.buildings[type]=img;
 }
 updatePlants(){
  state=readState();this.nodes.forEach(n=>{
   n.art?.destroy();n.lock?.destroy();n.art=null;n.lock=null;
   const g=state.growth[n.i];
   if(visible(n.i)){
    if(g>0){n.art=this.add.image(n.p.x,n.p.y-47,'fruit-'+n.i+'-'+g).setDisplaySize(115+g*8,115+g*8).setDepth(n.p.y+2).setInteractive({useHandCursor:true});n.art.on('pointerup',()=>{if(!this.dragged)openInfo('plant',n.i)})}
    else n.art=this.add.text(n.p.x,n.p.y-40,'🌱',{fontSize:'39px'}).setOrigin(.5).setDepth(n.p.y+2);
   }else n.lock=this.add.text(n.p.x,n.p.y-45,'🔒',{fontSize:'42px'}).setOrigin(.5).setDepth(n.p.y+2);
  });
  this.buildings.chapel.setAlpha(state.chapelBuilt?1:.76);this.buildings.church.setAlpha(state.churchBuilt?1:.76);
 }
 // One rendering coordinate system: Phaser's own canvas dimensions, not CSS sizes.
 // Force actual Phaser game viewport to match the parent; fill width of 800-wide world.
 scheduleFit(){cancelAnimationFrame(this.fitRAF);this.fitRAF=requestAnimationFrame(()=>this.fit(false))}
 fit(center=true){
  const el=$('game');
  const width=Math.max(1,Math.round(el.clientWidth));
  const height=Math.max(1,Math.round(el.clientHeight));
  // Phaser RESIZE can fire before the renderer/canvas is resized. Synchronize here.
  if(this.scale.gameSize.width!==width||this.scale.gameSize.height!==height){
   this.scale.resize(width,height);
  }
  const cam=this.cameras.main;
  cam.setViewport(0,0,width,height);
  this.baseZoom=width/W;
  const zoom=this.baseZoom*this.userZoom;
  cam.setZoom(zoom);
  if(center)cam.centerOn(W/2,H/2);
  this.clampCam();
  const canvas=this.game.canvas;
  // Phaser must own actual canvas sizing; CSS only handles layout.
  canvas.style.width=width+'px';canvas.style.height=height+'px';canvas.style.maxWidth='100%';
  $('engineStatus').textContent=`✅ Phaser ${Math.round(cam.width)}×${Math.round(cam.height)} · zoom ${zoom.toFixed(3)} · bản đồ ${Math.round(W*zoom)}px`;
 }
 clampCam(){
  const cam=this.cameras.main,vw=cam.width/cam.zoom,vh=cam.height/cam.zoom;
  // Preserve a centered viewport on the non-scrollable axis.
  cam.scrollX=vw>=W?(W-vw)/2:Phaser.Math.Clamp(cam.scrollX,0,W-vw);
  cam.scrollY=vh>=H?(H-vh)/2:Phaser.Math.Clamp(cam.scrollY,0,H-vh);
 }
 zoom(delta){
  const cam=this.cameras.main;
  const oldX=cam.midPoint.x,oldY=cam.midPoint.y;
  this.userZoom=Phaser.Math.Clamp(this.userZoom*(delta>0?1.25:.8),1,2.6);
  cam.setZoom(this.baseZoom*this.userZoom);cam.centerOn(oldX,oldY);this.clampCam();
  $('engineStatus').textContent=`✅ Phaser · zoom ${cam.zoom.toFixed(3)} · bản đồ ${Math.round(W*cam.zoom)}px`;
 }
 reset(){this.userZoom=1;this.fit(true)}
 waterEffect(i){const p=this.positions[i];for(let n=0;n<9;n++){const drop=this.add.circle(p.x+Phaser.Math.Between(-35,35),p.y-110+Phaser.Math.Between(-10,10),Phaser.Math.Between(4,8),0x36d9ff,.9).setDepth(p.y+30);this.tweens.add({targets:drop,y:p.y-25,alpha:0,duration:550+n*40,delay:n*60,onComplete:()=>drop.destroy()})}}
}
// Phaser Scale.RESIZE: the canvas remains at the parent dimensions.
const host=$('game');
const cfg={
 type:Phaser.AUTO,parent:'game',width:host.clientWidth,height:host.clientHeight,
 backgroundColor:'#78c65e',render:{pixelArt:false,antialias:true},
 scale:{mode:Phaser.Scale.RESIZE,autoCenter:Phaser.Scale.NO_CENTER,width:host.clientWidth,height:host.clientHeight},
 scene:[FarmScene]
};
game=new Phaser.Game(cfg);
$('zoomIn').onclick=()=>sceneRef?.zoom(1);
$('zoomOut').onclick=()=>sceneRef?.zoom(-1);
$('resetView').onclick=()=>sceneRef?.reset();
updateStats();
document.addEventListener('visibilitychange',()=>{if(!document.hidden){state=readState();updateStats();sceneRef?.updatePlants();sceneRef?.scheduleFit()}});
})();
