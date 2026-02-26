# Dating App

## Cách chạy

### 1) Cài đặt dependencies

```bash
cd api
npm install

cd ../web
npm install
```

### 2) Cấu hình môi trường

#### API (`api/.env`)

Copy từ `api/.env.example`:

```env
PORT=3001
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_NAME=dating_app
DB_SYNC=true

JWT_SECRET=your_secret
```

#### WEB (`web/.env`)

Copy từ `web/.env.example`:

```env
PORT=3000
BE_URL=http://localhost:3001
AUTH_SECRET=your_auth_secret
```

### 3) Khởi động hệ thống

Mở 2 terminal:

```bash
# Terminal 1
cd api
npm run dev

# Terminal 2
cd web
npm run dev
```

Truy cập:
- Frontend: `http://localhost:3000`
- API: `http://localhost:3001/api`
- Swagger: `http://localhost:3001/api-docs`

## Trả lời các câu hỏi

### 1) Mô tả cách bạn tổ chức hệ thống

Hệ thống tách 2 phần:
- `web` (Next.js): render UI, gọi API, quản lý session đăng nhập.
- `api` (NestJS): xử lý nghiệp vụ `auth`, `user`, `match` và thao tác DB.

Dữ liệu lưu bằng PostgreSQL qua TypeORM với 4 bảng chính: `users`, `likes`, `matches`, `availabilities`.

Luồng chính: sau khi đăng nhập, người dùng vào trang Home để xem danh sách tài khoản được gợi ý (recommend users). Từ đây, người dùng chọn một profile để xem chi tiết và bấm thích. Khi cả hai cùng thích nhau, cặp đó sẽ xuất hiện trong trang Matches.Tại Matches, người dùng có thể bấm vào icon lịch để chọn các khung giờ rảnh. Nếu hai bên có khung giờ trùng nhau, lịch hẹn sẽ được hiển thị ở trang Schedule và vẫn có thể chỉnh sửa lại khung giờ khi cần.

### 2) Bạn lưu data bằng gì (local storage / backend / database)

Dữ liệu nghiệp vụ được lưu ở **backend + PostgreSQL** (không lưu business data trong local storage).

Frontend chỉ giữ session đăng nhập qua NextAuth/JWT để xác thực request.  
Nguồn sự thật của hệ thống là DB: `users`, `likes`, `matches`, `availabilities`.

### 3) Logic match của bạn hoạt động thế nào

Logic match là cơ chế "mutual like" (like 2 chiều), xử lý trong `user.service`.

**Quy trình chi tiết khi A like B**
1. Validate input:
   - Không cho phép A like chính A.
   - Kiểm tra B có tồn tại trong hệ thống.
2. Ghi nhận like:
   - Nếu A -> B chưa tồn tại thì tạo bản ghi mới trong `likes`.
   - Nếu đã tồn tại thì bỏ qua (idempotent theo business).
3. Kiểm tra điều kiện match:
   - Query xem B -> A đã tồn tại chưa.
4. Nếu đã tồn tại B -> A:
   - `isMatch = true`.
   - Sắp xếp cặp id theo thứ tự tăng dần để tạo key canonic (`user_a_id`, `user_b_id`).
   - Nếu cặp này chưa có trong `matches` thì tạo match mới.
5. Nếu chưa tồn tại B -> A:
   - `isMatch = false`.
   - Chỉ dừng lại ở mức "like", chưa tạo match.

**Tính chất logic**
- Tránh duplicate match nhờ sort id + unique constraint DB.
- Tránh duplicate like nhờ unique constraint likes.
- Match mới tạo có status mặc định `matched` (chưa tìm lịch chung).

**Kết quả hiển thị**
- Frontend lấy danh sách từ endpoint `/match`.
- Cùng một endpoint có thể trả user + metadata match (`status`, `first_common_date`, `first_common_block_type`) để dùng cho cả màn Match và Schedule.

### 4) Logic tìm slot trùng hoạt động thế nào

Logic này được xử lý trong `match.service` khi gọi `PUT /match/:matchId/availability`.

**Input**
- Danh sách slot dạng:
  - `date`: định dạng `YYYY-MM-DD`
  - `block_type`: `morning` | `afternoon` | `evening`

**Quy trình xử lý**
1. Xác thực và phân quyền:
   - Kiểm tra `matchId` có tồn tại.
   - Kiểm tra current user có thuộc cặp match này không.
2. Validate và chuẩn hóa input:
   - Validate format date.
   - Validate block type thuộc enum hợp lệ.
   - Loại bỏ slot trùng trong payload bằng map key `date|block_type`.
3. Ghi đè availability của current user:
   - Xóa toàn bộ slot cũ của user trong match.
   - Insert lại danh sách slot mới (có thể xem là full replace).
4. Lấy availability của đối phương trong cùng match.
5. Xử lý theo 3 nhánh:
   - **Đối phương chưa có slot nào**:
     - Đặt match về `matched`.
     - Xóa `first_common_date` và `first_common_block_type`.
   - **Đã có slot nhưng không giao nhau**:
     - Đặt match = `no_common_slot`.
     - Xóa thông tin slot chung đầu tiên.
   - **Có giao nhau**:
     - Tạo tập common slot = intersection của 2 bên.
     - Sort theo độ ưu tiên:
       1) date tăng dần
       2) block order: morning (1) -> afternoon (2) -> evening (3)
     - Chọn slot đầu tiên sau sort làm "nearest common slot".
     - Đặt match = `scheduled` + lưu `first_common_date` + `first_common_block_type`.

### 5) Nếu có thêm thời gian bạn sẽ cải thiện gì

- Bổ sung test unit/integration cho luồng like -> match -> schedule để tránh hồi quy.
- Chuyển sang migration + seed data để vận hành ổn định hơn khi deploy.
- Tối ưu tính slot trùng (query + index) khi data lớn.
- Cải thiện UX lập lịch (cho phép clear hết slot, hiện trạng thái đối phương đã cập nhật hay chưa).

### 6) 1-3 tính năng đề xuất thêm cho sản phẩm và lý do

1. **Chat sau khi match**: giúp user trao đổi và chốt lịch ngay trong app, tăng tỷ lệ từ match sang hẹn gặp.  
2. **Thông báo realtime**: báo match mới/cập nhật lịch nhanh hơn, tăng engagement.  
3. **Recommendation cơ bản**: ưu tiên profile phù hợp để tăng tỷ lệ like 2 chiều.
