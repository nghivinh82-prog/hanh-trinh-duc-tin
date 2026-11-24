# LUMI 0.4 – Thế giới nông trại Đức tin

## Tính năng
- Bản đồ phối cảnh 2.5D/isometric bằng SVG và CSS; 12 luống đất là nút tương tác.
- 12 cây có hình SVG khác nhau ở từng giai đoạn trưởng thành, cửa sổ xem cây và nhiệm vụ Kinh Thánh.
- Nguyện đường mở sau 8 hoa trái; Nhà thờ mở sau 12 và đã xây Nguyện đường.
- Giữ nguyên mã lưu dữ liệu localStorage `lumi_garden_v02` từ bản 0.2–0.3.
- Không có Firebase, tài khoản hoặc kết nối người chơi trong bản này.
- Không thay đổi index.html ở thư mục gốc của ứng dụng LUMI.

## Cách cài
Tải **toàn bộ nội dung thư mục `garden-demo/`** lên thư mục `garden-demo/` của repository đang dùng. Phải có `farm-04.css`, `farm-04.js`, các SVG `assets/farm-*` và `assets/fruit-*`.

## Kiểm tra
1. Mở `/garden-demo/` và tải lại Ctrl+Shift+R.
2. Kiểm tra Bác ái vẫn ở 2/4 nếu vẫn dùng cùng trình duyệt có dữ liệu 0.3.
3. Chạm luống cây, kiểm tra bảng thông tin; thử Nhiệm vụ, Chăm cây và Công trình.
4. F5 để xác minh dữ liệu vẫn còn.

## Lưu ý
- Đồ họa là **2.5D**: mặt đất, tán cây và tòa nhà được minh họa có chiều sâu; không phải mô hình WebGL/3D có camera xoay tự do.
- Không dùng ảnh nền chụp UI chứa nút giả; mọi điểm chạm thật là nút HTML.
- Dữ liệu cục bộ có thể bị xóa khi người dùng dọn dữ liệu trình duyệt. Cần Firebase cho đồng bộ nhiều người chơi sau này.
