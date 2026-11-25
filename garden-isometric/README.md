# LUMI 0.7 – Khu vườn Isometric

Bản dựng thử nghiệm **riêng** cho ba cây Bác ái, Hoan lạc, Bình an, không thay đổi `garden-demo`, `garden-phaser` hay trang chủ LUMI.

## Triển khai

1. Giải nén ZIP.
2. Tải thư mục `garden-isometric` lên thư mục gốc repository `hanh-trinh-duc-tin` (giữ cả `assets/`).
3. Mở: `https://nghivinh82-prog.github.io/hanh-trinh-duc-tin/garden-isometric/` sau khi Pages triển khai.
4. Cần có Internet để tải thư viện Phaser 3.90 từ cdnjs.

## Bảo toàn dữ liệu

- Đọc và ghi cùng khóa localStorage `lumi_garden_v02`.
- Không xóa hoặc đổi các trường `done`, `growth`, `lastCare`, `careCount`, `chapelBuilt`, `churchBuilt`.
- Chỉ thêm nhiệm vụ trong 3 câu đầu tiên; giữ mọi nhiệm vụ khác đã hoàn thành.
- Dữ liệu chỉ tồn tại trên cùng trình duyệt, cùng tên miền, chưa có đồng bộ máy chủ.

## Lưu ý

- Chưa có chức năng xây công trình trong 0.7: hình Nguyện đường chỉ để kiểm tra đồ họa.
- Bản đồ dùng ảnh nền gốc riêng cho LUMI; luống đất/cây/nguyện đường là SVG riêng và các đối tượng Phaser độc lập.
- Đây là thiết kế game phong cách 2.5D; không phải 3D camera xoay tự do, không sử dụng tài nguyên có bản quyền của Happy Farm.
