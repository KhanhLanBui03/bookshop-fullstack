# API Authentication Integration - Frontend User

## Tổng quan

Frontend-user đã được tích hợp hoàn chỉnh với các API xác thực từ backend Java:

- ✅ **Đăng nhập** - Login API
- ✅ **Đăng ký** - Register API  
- ✅ **Refresh Token** - Tự động làm mới token hết hạn
- ✅ **Logout** - Đăng xuất và xóa token
- ✅ **Get Current User** - Lấy thông tin user hiện tại

## Cấu trúc Dự án

### API Layer (`src/api/`)

#### `auth.api.ts`
Các hàm gọi API xác thực:
- `login(data: LoginRequest)` - Đăng nhập với email & password
- `register(data: RegisterRequest)` - Đăng ký tài khoản mới
- `logout(token: string)` - Đăng xuất
- `getCurrentUser()` - Lấy thông tin user hiện tại
- `refreshToken(refreshToken: string)` - Làm mới access token

#### `axios.ts`
Cấu hình Axios client:
- Base URL: `http://localhost:8686/api/v1/`
- Tự động gắn `Authorization` header với access token
- Xử lý auto-refresh token khi hết hạn (401)
- Redirect về login nếu refresh token cũng hết hạn

### Context & Hooks (`src/contexts/`)

#### `AuthContext.tsx`
Context cung cấp authentication state:
- `user` - Thông tin user hiện tại
- `isAuthenticated` - Trạng thái đăng nhập
- `loading` - Trạng thái tải dữ liệu
- `logout()` - Hàm đăng xuất
- `getCurrentUser()` - Hàm lấy thông tin user

Sử dụng: `const { user, isAuthenticated, logout } = useAuth()`

### Components

#### `ProtectedRoute.tsx`
Component để bảo vệ các tuyến cần xác thực:
```tsx
<ProtectedRoute>
  <CartPage />
</ProtectedRoute>
```

Tự động redirect về login nếu chưa đăng nhập.

### Pages

#### `LoginPage.tsx`
- Gọi API `authApi.login()` khi submit form
- Lưu `accessToken` & `refreshToken` vào localStorage
- Lấy thông tin user và lưu vào localStorage
- Redirect về trang chủ sau khi đăng nhập thành công

#### `RegisterPage.tsx`
- Gọi API `authApi.register()` khi submit form
- Kiểm tra validation trước khi submit
- Lưu tokens tương tự như login
- Redirect về trang chủ sau khi đăng ký thành công

#### `Header.tsx`
- Hiển thị menu đăng nhập/đăng ký khi chưa xác thực
- Hiển thị tên user & button đăng xuất khi đã xác thực
- Gọi `logout()` khi click button đăng xuất

## Cách Hoạt Động

### Luồng Đăng Nhập

```
1. User nhập email & password
2. Click button "Đăng nhập"
3. Gọi authApi.login()
4. Nhận lại accessToken & refreshToken
5. Lưu vào localStorage
6. Lấy thông tin user bằng getCurrentUser()
7. Lưu user info vào localStorage
8. Redirect về trang chủ
```

### Luồng Auto Refresh Token

```
1. Request API gặp lỗi 401 (Unauthorized)
2. Axios interceptor catch lỗi này
3. Gọi authApi.refreshToken() với refresh token
4. Nhận access token mới
5. Cập nhật localStorage
6. Retry request ban đầu với token mới
7. Nếu refresh token cũng hết hạn → Redirect login
```

## Type Definitions

### `src/types/Account.ts`

```typescript
export type LoginRequest = {
    email: string;
    password: string;
}

export type LoginResponse = {
    accessToken: string;
    refreshToken: string;
    expiresIn?: number;
}

export type RegisterRequest = {
    name: string;
    email: string;
    password: string;
}

export type RegisterResponse = {
    accessToken: string;
    refreshToken: string;
}

export type User = {
    userId: string;
    email: string;
    fullName: string;
    roles: string[];
}

export type ApiResponse<T> = {
    code: number;
    message: string;
    data: T;
}
```

## Cài Đặt

1. **Backend phải chạy trước:**
   ```bash
   # Backend chạy trên port 8686
   cd backend
   mvn spring-boot:run
   ```

2. **Frontend user:**
   ```bash
   cd frontend-user
   npm install
   npm run dev
   ```

3. **Kiểm tra:**
   - Mở http://localhost:5173 (hoặc port được cấu hình)
   - Thử đăng ký tài khoản mới
   - Thử đăng nhập
   - Kiểm tra localStorage xem có lưu token không
   - Thử truy cập trang cart (cần xác thực)

## Thử Nghiệm API

### Đăng Ký
```bash
curl -X POST http://localhost:8686/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Nguyễn Văn A",
    "email": "a@example.com",
    "password": "password123"
  }'
```

### Đăng Nhập
```bash
curl -X POST http://localhost:8686/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "a@example.com",
    "password": "password123"
  }'
```

### Refresh Token
```bash
curl -X POST http://localhost:8686/api/v1/auth/refresh-token \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "your_refresh_token_here"
  }'
```

### Lấy Thông Tin User
```bash
curl -X GET http://localhost:8686/api/v1/auth/me \
  -H "Authorization: Bearer your_access_token_here"
```

### Đăng Xuất
```bash
curl -X DELETE "http://localhost:8686/api/v1/auth/logout?token=your_access_token_here"
```

## Ghi Chú Quan Trọng

1. **Token Storage**: Tokens lưu trong localStorage. Bạn có thể cân nhắc sử dụng HttpOnly cookies cho bảo mật tốt hơn.

2. **CORS**: Đảm bảo backend cho phép CORS từ frontend.

3. **Validation**: Frontend đã có validation form cơ bản. Backend cũng nên validate.

4. **Error Handling**: Các lỗi API được catch và hiển thị cho user trong form.

5. **Protected Routes**: Route `/cart` được bảo vệ, chỉ user đăng nhập mới vào được.

## Troubleshooting

### Lỗi CORS
- Kiểm tra backend có cấu hình CORS đúng không
- Đảm bảo frontend URL được thêm vào whitelist

### Token không save
- Kiểm tra localStorage có enable không
- Xem console có lỗi gì không

### Login thành công nhưng không redirect
- Kiểm tra router configuration
- Xem có error gì trong console

### Auto logout sau refresh page
- Kiểm tra AuthContext initialize logic
- Xem token có valid không
