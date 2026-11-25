'use strict';
/* LUMI 0.7.3 - EDITOR: 12 movable/rotatable soil plots, paths, seed bag and sowing.
   Mission and growth data remain under lumi_garden_v02. Layout saved separately. */
(()=>{
const KEY='lumi_garden_v02', LAYOUT_KEY='lumi_garden_layout_v073', W=900,H=1500;
const FRUITS = [
 {name:'Bác ái',emoji:'❤️',tree:'🍎',question:'Ai đã giúp đỡ người bị nạn trong dụ ngôn người Samari nhân hậu?',choices:['Người Samari','Một người lính','Một người chủ quán'],answer:0,source:'Lc 10,25–37',explain:'Người Samari đã dừng lại chăm sóc người bị nạn; yêu thương cần đi cùng hành động.'},
 {name:'Hoan lạc',emoji:'🌻',tree:'🌻',question:'Trong lời loan báo của thiên thần ở Bêlem, điều gì được mang đến cho muôn dân?',choices:['Một cuộc thi','Một tin mừng trọng đại','Một mệnh lệnh xây thành'],answer:1,source:'Lc 2,10–11',explain:'Thiên thần loan báo tin mừng trọng đại về Đấng Cứu Độ.'},
 {name:'Bình an',emoji:'🕊️',tree:'🌳',question:'Khi hiện ra với các môn đệ, Chúa Giêsu nói lời nào?',choices:['Hãy tranh luận','Bình an cho anh em','Hãy trốn đi'],answer:1,source:'Ga 20,19',explain:'Lời chào bình an của Chúa giúp người môn đệ can đảm và tin tưởng.'},
 {name:'Nhẫn nhục',emoji:'🌿',tree:'🌲',question:'Thánh Phaolô khuyên người tín hữu đối xử với nhau thế nào?',choices:['Chịu đựng nhau trong đức ái','Đòi thắng mọi cuộc tranh luận','Không bao giờ tha thứ'],answer:0,source:'Ep 4,2',explain:'Khiêm tốn, hiền từ và nhẫn nại giúp gìn giữ sự hiệp nhất.'},
 {name:'Nhân hậu',emoji:'🍀',tree:'🍐',question:'Đức Giêsu dạy người môn đệ sống nhân từ như ai?',choices:['Người quyền lực nhất','Cha trên trời','Người giàu nhất'],answer:1,source:'Lc 6,36',explain:'Chúa mời gọi chúng ta có lòng thương xót và biết cảm thông.'},
 {name:'Từ tâm',emoji:'🌷',tree:'🌷',question:'Trong thư Êphêsô, người tín hữu được khuyên điều gì?',choices:['Đối xử tốt và thương xót nhau','Giữ mãi sự tức giận','Không giúp đỡ người khác'],answer:0,source:'Ep 4,32',explain:'Một lời nói và cử chỉ tử tế có thể nâng đỡ người khác.'},
 {name:'Quảng đại',emoji:'🌳',tree:'🌴',question:'Bà góa nghèo đã dâng điều gì trong Đền Thờ?',choices:['Rất nhiều vàng','Hai đồng tiền nhỏ','Một con chiên'],answer:1,source:'Mc 12,41–44',explain:'Sự quảng đại không được đo chỉ bằng số lượng vật chất.'},
 {name:'Hiền hòa',emoji:'🌼',tree:'🌼',question:'Chúa Giêsu mời gọi chúng ta học nơi Người điều gì?',choices:['Hiền lành và khiêm nhường','Giận dữ và kiêu căng','Hơn thua bằng mọi giá'],answer:0,source:'Mt 11,29',explain:'Sự hiền hòa giúp chúng ta lắng nghe và tôn trọng nhau.'},
 {name:'Trung tín',emoji:'🌲',tree:'🌳',question:'Trong dụ ngôn các yến bạc, người đầy tớ được khen vì điều gì?',choices:['Trung thành trong việc nhỏ','Trốn tránh trách nhiệm','Giấu mọi thứ'],answer:0,source:'Mt 25,21',explain:'Trung thành với trách nhiệm nhỏ là bước thực hành đáng quý.'},
 {name:'Nết na',emoji:'🪻',tree:'🪻',question:'Thư Philípphê khuyên ta nghĩ đến những điều nào?',choices:['Điều chân thật và đáng quý','Điều gây tổn thương','Điều ích kỷ'],answer:0,source:'Pl 4,8',explain:'Cách suy nghĩ và cư xử tốt đẹp giúp ta tôn trọng phẩm giá mọi người.'},
 {name:'Tiết độ',emoji:'🍇',tree:'🍇',question:'Thánh Phaolô dùng hình ảnh vận động viên để nói về điều gì?',choices:['Biết tự chủ trong luyện tập','Không cần kỷ luật','Luôn hơn thua'],answer:0,source:'1 Cr 9,25',explain:'Tiết độ là học cách sử dụng thời gian và khả năng một cách điều độ.'},
 {name:'Trong sạch',emoji:'🤍',tree:'🌸',question:'Trong bài giảng trên núi, ai được gọi là có phúc?',choices:['Người có tâm hồn trong sạch','Người nhiều của cải nhất','Người không bao giờ lắng nghe'],answer:0,source:'Mt 5,8',explain:'Sự trong sạch của tâm hồn hướng đến điều chân thật và tốt lành.'}
];
const $=id=>document.getElementById(id);
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const safeNum=(n,def=0)=>Number.isFinite(Number(n))?Number(n):def;
const today=()=>{const d=new Date();return [d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-')};
function readState(){const def={done:[],growth:Array(12).fill(0),lastCare:'',careCount:0,chapelBuilt:false,churchBuilt:false};try{const r=JSON.parse(localStorage.getItem(KEY)||'null');if(r&&Array.isArray(r.done)&&Array.isArray(r.growth))return {...def,...r,done:[...new Set(r.done.filter(i=>Number.isInteger(i)&&i>=0&&i<12))],growth:Array.from({length:12},(_,i)=>clamp(Math.trunc(safeNum(r.growth[i])),0,4))}}catch(_){}return def}
const defaults=()=>({plots:Array.from({length:12},(_,i)=>({x:220+(i%3)*230,y:355+Math.floor(i/3)*274,rotation:0})),roads:[],planted:{}});
function readLayout(){let d=defaults();try{const r=JSON.parse(localStorage.getItem(LAYOUT_KEY)||'null');if(r&&Array.isArray(r.plots)&&r.plots.length===12){d.plots=r.plots.map((p,i)=>({x:clamp(safeNum(p.x,d.plots[i].x),135,765),y:clamp(safeNum(p.y,d.plots[i].y),280,1360),rotation:p.rotation===90?90:0}));d.roads=Array.isArray(r.roads)?r.roads.filter(p=>['dirt','brick'].includes(p.kind)&&Number.isFinite(p.x)&&Number.isFinite(p.y)).slice(0,60):[];d.planted=r.planted&&typeof r.planted==='object'?r.planted:{}}}catch(_){}return d}
let state=readState(),layout=readLayout(),scene=null,mode='move',pickedSeed=null,selectedPlot=0;
// Migrate plants from the old game without resetting any existing growth stages.
// Earlier builds automatically planted completed missions; only growth>0 counts as planted.
for(let i=0;i<12;i++)if(state.growth[i]>0&&!Object.prototype.hasOwnProperty.call(layout.planted,i)){
 const assigned=new Set(Object.values(layout.planted).map(Number));let plot=assigned.has(i)?Array.from({length:12},(_,j)=>j).find(j=>!assigned.has(j)):i;
 if(plot!=null)layout.planted[i]=plot;
}
const assignedPlot=()=>new Set(Object.values(layout.planted).map(Number));
const isPlanted=i=>Object.prototype.hasOwnProperty.call(layout.planted,i);
const availableSeed=i=>state.done.includes(i)&&!isPlanted(i);
function saveState(){try{localStorage.setItem(KEY,JSON.stringify(state));return true}catch(_){message('Không thể lưu tiến trình trong trình duyệt này.');return false}}
function saveLayout(){try{localStorage.setItem(LAYOUT_KEY,JSON.stringify(layout));return true}catch(_){message('Không thể lưu bố cục khu vườn.');return false}}
function message(s){$('status').textContent=s}
function update(){
 $('seeds').textContent=state.done.length;
 $('missionsDone').textContent=state.done.length+'/12';$('careCount').textContent=state.careCount||0;
 $('grownCount').textContent=state.growth.filter(x=>x===4).length+'/12';
 const r=$('seedTray');r.replaceChildren();
 const seeds=FRUITS.map((f,i)=>({f,i})).filter(o=>availableSeed(o.i));
 if(!seeds.length){let p=document.createElement('p');p.className='empty';p.textContent='Chưa có hạt chờ gieo. Hãy làm nhiệm vụ để nhận hạt mới.';r.append(p)}
 seeds.forEach(({f,i})=>{
  const b=document.createElement('button');b.type='button';b.className='seed'+(pickedSeed===i?' chosen':'');b.draggable=true;b.dataset.seed=i;
  b.textContent='🌰 '+f.name;b.title='Kéo hạt xuống luống trống hoặc nhấn để chọn';
  b.addEventListener('click',()=>chooseSeed(i));
  b.addEventListener('dragstart',e=>{e.dataTransfer.setData('text/plain','seed:'+i);e.dataTransfer.effectAllowed='move';pickedSeed=i;highlight()});
  b.addEventListener('pointerdown',e=>{if(e.pointerType==='touch')beginTouchSeed(e,i)});
  r.append(b);
 });
 $('toolHint').textContent=mode==='move'?'Kéo luống để chuyển vị trí. Chạm luống để xem cây.':mode==='rotate'?'Chạm luống để xoay 90°.':mode==='dirt'?'Chạm vùng cỏ để lát đường đất.':mode==='brick'?'Chạm vùng cỏ để lát đường gạch.':'Chạm đường để xóa.';
 $('gateInfo').textContent=state.done.length===12&&state.growth.every(g=>g===4)?'🔓 Đã đủ điều kiện mở bản đồ Làng Đức tin (sẽ triển khai sau).':'🔒 Cổng Làng Đức tin: cần hoàn thành 12 nhiệm vụ và 12 cây 4/4.';
}
function highlight(){document.querySelectorAll('.tool').forEach(b=>b.classList.toggle('active',b.dataset.mode===mode));document.querySelectorAll('.seed').forEach(b=>b.classList.toggle('chosen',Number(b.dataset.seed)===pickedSeed))}
function chooseSeed(i){pickedSeed=i;mode='sow';highlight();update();message('🌰 Đang cầm hạt '+FRUITS[i].name+'. Chạm một luống đất trống để gieo.')}
const make=(tag,txt,cls)=>{let n=document.createElement(tag);if(txt!=null)n.textContent=txt;if(cls)n.className=cls;return n};
const action=(name,fn)=>{let b=make('button',name,'action');b.type='button';b.onclick=fn;return b};
function show(title){$('dlgTitle').textContent=title;$('dlgBody').replaceChildren();$('overlay').hidden=false;$('close').focus()}
function hide(){$('overlay').hidden=true}
$('close').onclick=hide;$('overlay').addEventListener('click',e=>{if(e.target===$('overlay'))hide()});document.addEventListener('keydown',e=>{if(e.key==='Escape')hide()});
function info(plotIndex){state=readState();selectedPlot=plotIndex;let fruit=Object.keys(layout.planted).find(key=>Number(layout.planted[key])===plotIndex);
 if(fruit===undefined){show('🌱 Luống đất số '+(plotIndex+1));$('dlgBody').append(make('p','Luống đất trống. Hoàn thành nhiệm vụ để nhận hạt, rồi chọn hạt ở khay bên phải và gieo vào đây.'),action('📖 Làm nhiệm vụ',missions));return}
 const i=Number(fruit),f=FRUITS[i];show(f.emoji+' '+f.name);$('dlgBody').append(make('p','Cây đang ở giai đoạn '+state.growth[i]+'/4.'),make('p',f.source+' · '+f.explain),action('Đóng',hide));
}
function missions(){state=readState();show('📖 12 nhiệm vụ Kinh Thánh');$('dlgBody').append(make('p','Trả lời đúng để nhận hạt vào khay. Hạt chỉ được gieo khi bạn tự chọn một luống đất trống.','muted'));FRUITS.forEach((f,i)=>{$('dlgBody').append(action((state.done.includes(i)?'✓ ':'')+(i+1)+'. '+f.name+' · '+f.source,()=>question(i)))})}
function question(i){state=readState();let f=FRUITS[i];show('📖 '+f.name);let body=$('dlgBody');body.append(make('p',f.source+' — '+f.question));
 if(state.done.includes(i)){body.append(make('p',isPlanted(i)?'✓ Đã hoàn thành và đã gieo cây.':'✓ Đã hoàn thành. Hạt đang chờ trong khay bên phải.'),action('Đóng',hide));return}
 const feedback=make('p','','muted');f.choices.forEach((c,j)=>{const b=action(String.fromCharCode(65+j)+'. '+c,()=>{
  if(j!==f.answer){feedback.textContent='Chưa đúng. Bạn hãy thử lại nhé.';return}
  state.done.push(i);if(!saveState())return;
  body.querySelectorAll('button').forEach(x=>x.disabled=true);feedback.textContent='✓ Chính xác! '+f.explain+' Hạt '+f.name+' đã có trong khay.';
  body.append(action('🌰 Chọn hạt vừa nhận',()=>{hide();chooseSeed(i)}));update();scene?.refresh();
 });b.classList.add('choice');body.append(b)});body.append(feedback)}
function sow(i,plot){state=readState();if(!availableSeed(i)){message('Hạt này chưa được nhận hoặc đã được gieo.');return}
 if(assignedPlot().has(plot)){message('Luống này đã có cây. Hãy chọn một luống trống.');return}
 layout.planted[i]=plot;state.growth[i]=Math.max(1,state.growth[i]);
 if(!saveLayout()||!saveState())return;selectedPlot=plot;pickedSeed=null;mode='move';update();highlight();scene?.refresh();message('🌱 Đã gieo hạt '+FRUITS[i].name+' vào luống số '+(plot+1)+'.')}
function care(){state=readState();if(state.lastCare===today()){message('💧 Hôm nay bạn đã chăm cây rồi. Hẹn ngày mai nhé!');return}
 let i=Object.keys(layout.planted).find(k=>Number(layout.planted[k])===selectedPlot&&state.growth[k]<4);
 if(i===undefined)i=Object.keys(layout.planted).find(k=>state.growth[k]<4);
 if(i===undefined){message('Hãy gieo hạt vào luống trước khi tưới, hoặc các cây đã trưởng thành.');return}
 i=Number(i);state.growth[i]++;state.careCount=safeNum(state.careCount)+1;state.lastCare=today();if(!saveState())return;scene?.refresh();scene?.water(i);update();message('💧 Đã chăm cây '+FRUITS[i].name+' lên giai đoạn '+state.growth[i]+'/4.')}
$('missions').onclick=missions;$('water').onclick=care;
document.querySelectorAll('.tool').forEach(b=>b.addEventListener('click',()=>{mode=b.dataset.mode;pickedSeed=null;update();highlight()}));
if(typeof Phaser==='undefined'){message('Không tải được Phaser. Kiểm tra kết nối mạng.');return}
class Farm extends Phaser.Scene{
 constructor(){super('Farm');this.plots=[];this.roadObjects=[];this.scaleFactor=1;this.dragging=false;this.draggingPlot=false;this.refit=0}
 preload(){this.load.image('meadow','assets/meadow.webp');this.load.image('soil','assets/soil-flat.png');this.load.image('road-dirt','assets/path-dirt.png');this.load.image('road-brick','assets/path-brick.png');for(let i=0;i<12;i++)for(let g=0;g<=4;g++)this.load.image('fruit-'+i+'-'+g,'assets/fruit-'+i+'-'+g+'.png');this.load.on('loaderror',f=>message('Thiếu ảnh '+f.key+'. Hãy kiểm tra assets/'))}
 create(){scene=this;this.add.image(W/2,H/2,'meadow').setDisplaySize(W,H).setDepth(-10000);
  this.add.text(W/2,84,'🌱 KHU VƯỜN 12 HOA TRÁI',{fontFamily:'Arial',fontSize:'26px',fontStyle:'bold',color:'#205c2b',backgroundColor:'#fffbdeee',padding:{x:16,y:9}}).setOrigin(.5).setDepth(9999);
  for(let i=0;i<12;i++){
   const p=layout.plots[i],soil=this.add.image(p.x,p.y,'soil').setDisplaySize(188,102).setAngle(p.rotation).setDepth(p.y).setInteractive({useHandCursor:true,draggable:true});
   this.input.setDraggable(soil);
   soil.on('pointerup',()=>{if(!this.dragging&&mode!=='move'&&mode!=='sow')this.plotClick(i);else if(!this.dragging&&mode==='sow')this.plotClick(i);else if(!this.dragging&&mode==='move')info(i)});
   this.plots.push({i,soil,art:null,label:null,lock:null});
  }
  this.input.on('dragstart',(pointer,obj)=>{if(mode!=='move')return;this.draggingPlot=true;this.oldPos={x:obj.x,y:obj.y};obj.setTint(0xffdf87)});
  this.input.on('drag',(pointer,obj,dragX,dragY)=>{if(!this.draggingPlot||mode!=='move')return;obj.setPosition(clamp(dragX,120,780),clamp(dragY,250,1400));this.repositionAll()});
  this.input.on('dragend',(pointer,obj)=>{if(!this.draggingPlot)return;this.draggingPlot=false;obj.clearTint();const plot=this.plots.find(p=>p.soil===obj);if(!plot)return;
    const x=clamp(Math.round(obj.x/12)*12,135,765),y=clamp(Math.round(obj.y/12)*12,280,1360);
    if(!this.validPlot(x,y,plot.i)){obj.setPosition(this.oldPos.x,this.oldPos.y);message('Chỗ này đã có luống, có đường hoặc nằm ngoài vùng trồng.');}else{obj.setPosition(x,y);layout.plots[plot.i].x=x;layout.plots[plot.i].y=y;saveLayout();message('✓ Đã đặt luống số '+(plot.i+1)+' tại vị trí mới.');}
    this.repositionAll();
  });
  this.input.on('pointerdown',p=>{this.start={x:p.x,y:p.y};this.dragging=false});
  this.input.on('pointermove',p=>{if(!p.isDown||!this.start||this.draggingPlot||mode!=='move')return;if(Math.hypot(p.x-this.start.x,p.y-this.start.y)>10)this.dragging=true;if(!this.dragging)return;const c=this.cameras.main;c.scrollX-=(p.x-p.prevPosition.x)/c.zoom;c.scrollY-=(p.y-p.prevPosition.y)/c.zoom;this.clampCam()});
  this.input.on('pointerup',p=>{if(this.start&&!this.dragging&&!this.draggingPlot&&['dirt','brick','erase'].includes(mode))this.pathAt(p.worldX,p.worldY);this.start=null;this.time.delayedCall(55,()=>this.dragging=false)});
  this.refresh();this.fit(true);this.scale.on('resize',()=>this.scheduleFit());if(typeof ResizeObserver!=='undefined'){this.ro=new ResizeObserver(()=>this.scheduleFit());this.ro.observe($('game'));this.events.once('shutdown',()=>this.ro.disconnect())}
  this.events.once('shutdown',()=>cancelAnimationFrame(this.refit));message('✅ Đã sẵn sàng: kéo luống, xoay, lát đường và gieo hạt từ khay bên phải.');
 }
 validPlot(x,y,index){if(x<135||x>765||y<260||y>1390)return false;for(let j=0;j<12;j++)if(j!==index&&Math.hypot(x-this.plots[j].soil.x,(y-this.plots[j].soil.y)*1.25)<165)return false;for(const road of layout.roads)if(Math.hypot(x-road.x,(y-road.y)*1.25)<92)return false;return true}
 plotClick(i){selectedPlot=i;if(mode==='sow'&&pickedSeed!=null){sow(pickedSeed,i);return}if(mode==='rotate'){layout.plots[i].rotation=layout.plots[i].rotation===90?0:90;saveLayout();this.repositionAll();message('🔄 Đã xoay luống '+(i+1));return}info(i)}
 pathAt(x,y){x=clamp(Math.round(x/38)*38,135,765);y=clamp(Math.round(y/38)*38,220,1400);const nearest=layout.roads.findIndex(p=>Math.hypot(p.x-x,p.y-y)<38);if(mode==='erase'){if(nearest>=0){layout.roads.splice(nearest,1);saveLayout();this.drawRoads();message('Đã xóa một đoạn đường.')}return}
  if(nearest>=0){message('Vị trí này đã có đường.');return}if(layout.roads.length>=60){message('Đã đạt giới hạn 60 đoạn đường.');return}
  if(this.plots.some(p=>Math.hypot(p.soil.x-x,(p.soil.y-y)*1.25)<105)){message('Không thể lát đường đè lên luống trồng.');return}
  layout.roads.push({x,y,kind:mode});saveLayout();this.drawRoads();message('✓ Đã lát '+(mode==='dirt'?'đường đất':'đường gạch')+'.');
 }
 drawRoads(){this.roadObjects.forEach(o=>o.destroy());this.roadObjects=layout.roads.map(r=>this.add.image(r.x,r.y,'road-'+r.kind).setDisplaySize(108,64).setDepth(r.y-3))}
 repositionAll(){for(const p of this.plots){const d=layout.plots[p.i];if(!this.draggingPlot){p.soil.setPosition(d.x,d.y)}p.soil.setAngle(d.rotation);p.soil.setDepth(p.soil.y);if(p.art)p.art.setPosition(p.soil.x,p.soil.y-48).setDepth(p.soil.y+4);if(p.label)p.label.setPosition(p.soil.x,p.soil.y+58).setDepth(p.soil.y+5);if(p.lock)p.lock.setPosition(p.soil.x,p.soil.y-32).setDepth(p.soil.y+3)}}
 refresh(){state=readState();this.drawRoads();this.plots.forEach(p=>{p.art?.destroy();p.label?.destroy();p.lock?.destroy();p.art=p.lock=p.label=null;const id=Object.keys(layout.planted).find(k=>Number(layout.planted[k])===p.i);const x=layout.plots[p.i].x,y=layout.plots[p.i].y;
  if(id!==undefined){const i=Number(id),g=state.growth[i];p.art=this.add.image(x,y-48,'fruit-'+i+'-'+g).setDisplaySize(g>=3?125:108,g>=3?125:108).setDepth(y+4).setInteractive({useHandCursor:true});p.art.on('pointerup',()=>{if(!this.dragging){if(mode==='rotate'||mode==='sow')this.plotClick(p.i);else if(mode==='move')info(p.i)}});p.label=this.add.text(x,y+58,FRUITS[i].name,{fontFamily:'Arial',fontSize:'19px',fontStyle:'bold',color:'#593b1b',backgroundColor:'#fff4d8df',padding:{x:9,y:4}}).setOrigin(.5).setDepth(y+5)}
  else{p.label=this.add.text(x,y+58,'Luống '+(p.i+1),{fontFamily:'Arial',fontSize:'15px',color:'#39592c',backgroundColor:'#fff9e0c9',padding:{x:5,y:3}}).setOrigin(.5).setDepth(y+5)}
 });this.repositionAll()}
 water(i){const idx=Number(layout.planted[i]);const p=layout.plots[idx];if(!p)return;for(let k=0;k<12;k++){const b=this.add.circle(p.x+Phaser.Math.Between(-40,40),p.y-110,Phaser.Math.Between(3,7),0x62e9ff,.95).setDepth(p.y+20);this.tweens.add({targets:b,y:p.y-9,alpha:0,duration:600,delay:k*45,onComplete:()=>b.destroy()})}}
 fit(center=true){let el=$('game'),w=Math.max(1,Math.round(el.clientWidth)),h=Math.max(1,Math.round(el.clientHeight));if(this.scale.gameSize.width!==w||this.scale.gameSize.height!==h)this.scale.resize(w,h);const c=this.cameras.main;c.setViewport(0,0,w,h);this.baseZoom=w/W;c.setZoom(this.baseZoom*this.scaleFactor);if(center)c.centerOn(W/2,720);this.clampCam();this.game.canvas.style.width=w+'px';this.game.canvas.style.height=h+'px'}
 clampCam(){const c=this.cameras.main,vw=c.width/c.zoom,vh=c.height/c.zoom;c.scrollX=vw>=W?(W-vw)/2:Phaser.Math.Clamp(c.scrollX,0,W-vw);c.scrollY=vh>=H?(H-vh)/2:Phaser.Math.Clamp(c.scrollY,0,H-vh)}
 scheduleFit(){cancelAnimationFrame(this.refit);this.refit=requestAnimationFrame(()=>this.fit(false))}
 zoom(d){const c=this.cameras.main,x=c.midPoint.x,y=c.midPoint.y;this.scaleFactor=Phaser.Math.Clamp(this.scaleFactor*(d>0?1.18:.84),1,2.4);c.setZoom(this.baseZoom*this.scaleFactor);c.centerOn(x,y);this.clampCam()}
 reset(){this.scaleFactor=1;this.fit(true)}
}
const host=$('game');new Phaser.Game({type:Phaser.AUTO,parent:'game',width:host.clientWidth,height:host.clientHeight,backgroundColor:'#78bf51',render:{antialias:true,pixelArt:false},scale:{mode:Phaser.Scale.RESIZE,autoCenter:Phaser.Scale.NO_CENTER,width:host.clientWidth,height:host.clientHeight},scene:[Farm]});
$('zoomIn').onclick=()=>scene?.zoom(1);$('zoomOut').onclick=()=>scene?.zoom(-1);$('resetView').onclick=()=>scene?.reset();update();highlight();
// Desktop HTML5 drag-drop: a seed is dragged from the right tray onto a prepared soil plot.
const gameHost=$('game');gameHost.addEventListener('dragover',e=>{e.preventDefault();e.dataTransfer.dropEffect='move'});
function toWorld(clientX,clientY){const canvas=gameHost.querySelector('canvas');if(!scene||!canvas)return null;const rect=canvas.getBoundingClientRect();const c=scene.cameras.main;return c.getWorldPoint((clientX-rect.left)*c.width/rect.width,(clientY-rect.top)*c.height/rect.height)}
function sowAtPoint(i,clientX,clientY){const p=toWorld(clientX,clientY);if(!p)return;const target=scene.plots.map(o=>({i:o.i,dist:Math.hypot((o.soil.x-p.x)/1.15,(o.soil.y-p.y)/.85)})).sort((a,b)=>a.dist-b.dist)[0];if(target&&target.dist<92)sow(i,target.i);else message('Hãy thả hạt trực tiếp lên một luống trống.');}
gameHost.addEventListener('drop',e=>{e.preventDefault();const data=e.dataTransfer.getData('text/plain');if(data.startsWith('seed:'))sowAtPoint(Number(data.slice(5)),e.clientX,e.clientY)});
// Touch support: short tap selects seed, long movement drags a visual seed onto a plot.
let touchSeed=null;
function beginTouchSeed(e,i){if(touchSeed)return;const ghost=make('div','🌰 '+FRUITS[i].name,'seed-ghost');document.body.append(ghost);touchSeed={i,ghost,startX:e.clientX,startY:e.clientY,moved:false};ghost.style.left=e.clientX+'px';ghost.style.top=e.clientY+'px';}
document.addEventListener('pointermove',e=>{if(!touchSeed||e.pointerType!=='touch')return;touchSeed.ghost.style.left=e.clientX+'px';touchSeed.ghost.style.top=e.clientY+'px';if(Math.hypot(e.clientX-touchSeed.startX,e.clientY-touchSeed.startY)>12)touchSeed.moved=true});
document.addEventListener('pointerup',e=>{if(!touchSeed||e.pointerType!=='touch')return;const t=touchSeed;touchSeed=null;t.ghost.remove();if(t.moved){const rect=gameHost.getBoundingClientRect();if(e.clientX>=rect.left&&e.clientX<=rect.right&&e.clientY>=rect.top&&e.clientY<=rect.bottom)sowAtPoint(t.i,e.clientX,e.clientY)}else chooseSeed(t.i)});
document.addEventListener('visibilitychange',()=>{if(!document.hidden){state=readState();scene?.refresh();update()}});
})();
