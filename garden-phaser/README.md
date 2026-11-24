# LUMI 0.6 – Bản thử nghiệm Phaser 3

- Tách biệt hoàn toàn với ứng dụng chính và `garden-demo/`.
- Triển khai ở `hanh-trinh-duc-tin/garden-phaser/`.
- Dùng bộ SVG hiện có tại `../garden-demo/assets/`; không phải upload lại 60 hình.
- Phaser 3.90.0 nạp từ cdnjs, cần có Internet và CDN không bị chặn.
- Dữ liệu dùng chung khóa `lumi_garden_v02` với 0.5. Không xóa dữ liệu gốc.
- Có thể chạm luống đất, tưới cây, xem tiến trình; nhiệm vụ và xây công trình vẫn dùng giao diện 0.5.
- Chưa có Firebase hoặc tính năng nhiều tài khoản.

## Tải lên GitHub

1. Mở repository `hanh-trinh-duc-tin` > Add file > Create new file.
2. Tạo `garden-phaser/README.md` (bạn có thể ghi nội dung ngắn và commit).
3. Mở thư mục `garden-phaser`, chọn Add file > Upload files.
4. Upload `index.html`, `game.js`, `style.css`, rồi commit.
5. Xem https://nghivinh82-prog.github.io/hanh-trinh-duc-tin/garden-phaser/

## Kiểm tra

- Cây Bác ái vẫn ở giai đoạn 2/4 (nếu dùng cùng trình duyệt và dữ liệu còn đó).
- Kéo chuột/ngón tay để đi quanh bản đồ.
- Nhấn +/- để zoom, ⌖ để đặt lại.
- Chạm luống đất để mở chi tiết.
- Chăm cây không vượt giới hạn một lượt mỗi ngày.
- Nhấn “Làm nhiệm vụ” để trở về phiên bản 0.5.

Nếu trang trắng, mở DevTools Console và kiểm tra kết nối tới cdnjs.
