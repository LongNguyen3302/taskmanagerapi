module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',  // Chỉ cần URL cơ sở của backend
        changeOrigin: true,  // Cho phép thay đổi nguồn yêu cầu (CORS)
        secure: false,  // Đặt là false nếu backend không sử dụng HTTPS
        pathRewrite: { '^/api': '' }  // Loại bỏ `/api` khỏi đường dẫn nếu backend không cần
      }
    }
  }
};
