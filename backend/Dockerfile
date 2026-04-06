# 1. Chọn môi trường chạy (Node.js)
FROM node:20-alpine

# 2. #thư mục này map với thư mục backend ở local, được khai báo trong docker-compose.yml, nên khi save code ở local thì container cũng tự động cập nhật theo, không cần phải build lại image nữa, rất tiện lợi cho việc phát triển ứng dụng. Nếu không map thì mỗi lần save code ở local thì phải build lại image mới có hiệu lực, rất mất thời gian.
WORKDIR /app 

# 3. Copy file quản lý thư viện vào trước
COPY package*.json ./

# 4. Cài đặt thư viện
RUN npm install

# 5. Copy toàn bộ code còn lại
COPY . .

# 6. Mở cổng cho app
EXPOSE 8000

# 7. Lệnh khởi chạy app
CMD ["npm", "run", "start:dev"]