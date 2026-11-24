'use strict';
// Front-end prototype only. No accounts, messages or private user data are transmitted.
const $ = (id) => document.getElementById(id);
const welcome = $('welcome-screen');
const home = $('home-screen');
const backdrop = $('modal-backdrop');
const modalTitle = $('modal-title');
const modalIcon = $('modal-icon');
const modalContent = $('modal-content');
const branches = [
  {name:'Ấu Nhi',age:'7–9 tuổi',fill:'#16963e',border:'#f2d529',cross:'#f2d529'},
  {name:'Thiếu Nhi',age:'10–12 tuổi',fill:'#1269c6',border:'#f2d529',cross:'#f2d529'},
  {name:'Nghĩa Sĩ',age:'13–15 tuổi',fill:'#ffe91a',border:'#e52925',cross:'#e52925'},
  {name:'Hiệp Sĩ',age:'16–18 tuổi',fill:'#804010',border:'#f2d529',cross:'#f2d529'},
  {name:'Dự Trưởng',age:'',fill:'#e71920',border:null,cross:'#f2d529'},
  {name:'Huynh Trưởng',age:'',fill:'#e71920',border:'#f2d529',cross:'#f2d529'}
];
let activeBranch = null;
let answered = false;
const safeText = (text) => String(text).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
function scarfSVG(b) {
  // Only inset diagonal V border; no border on the horizontal top edge.
  const stripe = b.border ? `<path d="M10 7 L47 43 L84 7" fill="none" stroke="${b.border}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />` : '';
  const cross = `<path d="M43 16 H51 L50 22 H56 V30 H50 L51 36 H43 L44 30 H38 V22 H44 Z" fill="${b.cross}" />`;
  return `<svg viewBox="0 0 94 49" role="img" aria-label="Khăn ${safeText(b.name)}"><path d="M3 2 H91 L47 47 Z" fill="${b.fill}" />${stripe}${cross}</svg>`;
}
function showModal(title,icon,html){modalTitle.textContent=title;modalIcon.textContent=icon;modalContent.innerHTML=html;backdrop.classList.remove('hidden');$('modal-close').focus()}
function closeModal(){backdrop.classList.add('hidden')}
$('modal-close').addEventListener('click',closeModal);
backdrop.addEventListener('click',e=>{if(e.target===backdrop)closeModal()});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal()});
function showHome(){welcome.classList.add('hidden');home.classList.remove('hidden');closeModal();}
$('start-button').addEventListener('click',showHome);
$('signin-button').addEventListener('click',()=>showModal('Đăng nhập','🔐','<p>Đây là bản mô phỏng giao diện. Chức năng đăng nhập sẽ được triển khai khi có hệ thống xác thực và chính sách bảo vệ dữ liệu phù hợp cho người chưa thành niên.</p><button class="action" id="go-demo">Trải nghiệm bản mẫu</button>'));
document.addEventListener('click',e=>{if(e.target.id==='go-demo')showHome()});
function branchPicker(){
  const buttons=branches.map((b,i)=>`<button type="button" class="branch-choice" data-branch="${i}">${scarfSVG(b)}<span>${b.name}${b.age?`<small>${b.age}</small>`:''}</span></button>`).join('');
  showModal('Chọn ngành TNTT','🌿',`<p>Chọn ngành để thử cá nhân hóa nội dung. Bản mẫu không lưu hay gửi thông tin cá nhân.</p><div class="branch-list">${buttons}</div>`);
}
$('branch-button').addEventListener('click',branchPicker);
document.addEventListener('click',e=>{
  const btn=e.target.closest('[data-branch]'); if(!btn)return;
  activeBranch=branches[Number(btn.dataset.branch)];$('branch-button').textContent='✦ '+activeBranch.name+' ⌄';closeModal();
});
$('notifications-button').addEventListener('click',()=>showModal('Thông báo','🔔','<p>Chưa có thông báo mới. Trong phiên bản chính thức, bạn có thể tự chọn nhận thông báo về Lời Chúa và hoạt động giáo xứ.</p>'));
const features={
  word:['Lời Chúa hôm nay','📖','<p><strong>Ga 15,12:</strong> “Anh em hãy yêu thương nhau như Thầy đã yêu thương anh em.”</p><p><strong>Gợi ý suy niệm:</strong> Hôm nay, tôi có thể quan tâm đến một người đang cần được lắng nghe bằng cách nào?</p><p><strong>Việc làm nhỏ:</strong> Gửi một lời hỏi thăm hoặc giúp đỡ một người trong gia đình.</p>'],
  garden:['Khu vườn Đức tin','🌱','<p>Mỗi chặng học Lời Chúa sẽ giúp khu vườn của bạn phát triển. Sự tiến bộ trong trò chơi không phải là thước đo lòng đạo đức.</p><p>🌱 Hạt giống của bạn đang chờ một cuộc khám phá mới!</p>'],
  prayer:['Nguyện đường','🙏','<p><strong>Lời nguyện ngắn:</strong> Lạy Chúa Giêsu, xin hướng dẫn con biết yêu thương, sống chân thành và mang bình an đến cho mọi người. Amen.</p><p>Bản chính thức sẽ có kinh sáng, kinh tối và lần chuỗi Mân Côi với nội dung được duyệt.</p>'],
  memorial:['Vườn tưởng nhớ','🕯️','<p>Không gian cầu nguyện cho ông bà, người thân và các linh hồn. Bạn có thể dành một phút thinh lặng để tưởng nhớ.</p><p>Chức năng tra cứu Nhà Chờ Phục Sinh sẽ chỉ được kết nối khi có nguồn dữ liệu và quyền truy cập phù hợp.</p>'],
  community:['Cộng đoàn Giới trẻ','👥','<p>Nơi chia sẻ hành trình sống Lời Chúa và khám phá các hoạt động giáo xứ được quản trị.</p><p>Chưa có nhắn tin riêng hoặc đăng bài công khai trong bản mô phỏng để bảo đảm an toàn cho các bạn nhỏ.</p>'],
  events:['Hoạt động Giáo xứ','🗓️','<p>Lịch sinh hoạt, hoạt động bác ái, chương trình nhóm và thông báo của giáo xứ sẽ xuất hiện khi ban quản trị cập nhật.</p>'],
  profile:['Cá nhân & an toàn','🛡️','<p>Phiên bản thử nghiệm không yêu cầu tên thật, số điện thoại, vị trí hoặc ngày sinh.</p><p>Khi ra mắt, tài khoản trẻ vị thành niên sẽ có các giới hạn tương tác, tính năng báo cáo và quản trị nội dung.</p>']
};
function game(){answered=false;showModal('Trò chơi Kinh Thánh','🎮','<p><strong>Câu hỏi:</strong> Trong dụ ngôn người Samari nhân hậu, ai đã chăm sóc người bị nạn?</p><button class="quiz-option" data-answer="wrong">A. Một tư tế</button><button class="quiz-option" data-answer="correct">B. Một người Samari</button><button class="quiz-option" data-answer="wrong">C. Một người Lêvi</button><p class="feedback" id="game-feedback" aria-live="polite"></p>')}
function openFeature(key){if(key==='game')return game();const entry=features[key];if(entry)showModal(...entry)}
document.querySelectorAll('[data-feature]').forEach(el=>el.addEventListener('click',()=>openFeature(el.dataset.feature)));
document.querySelectorAll('[data-nav]').forEach(el=>el.addEventListener('click',()=>{const key=el.dataset.nav;if(key==='home'){closeModal();return}openFeature(key)}));
document.addEventListener('click',e=>{const btn=e.target.closest('[data-answer]');if(!btn||answered)return;answered=true;const ok=btn.dataset.answer==='correct';btn.classList.add(ok?'correct':'incorrect');$('game-feedback').textContent=ok?'Chính xác! Lc 10,25–37 nhắc chúng ta yêu thương bằng hành động.':'Đáp án là B. Một người Samari. Hãy đọc Lc 10,25–37 để cùng khám phá nhé!'});
