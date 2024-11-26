// 1. Đăng ký người dùng
const productData = {
    username: 'testUser2',
    password: 'password123',
    accessLevel: 'admin'
};

fetch('http://localhost:8080/api/users/register', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(productData)
})
    .then(response => response.json())
    .then(data => {
        console.log('User registered:', data);
        alert('User registered successfully!');

        // Sau khi đăng ký thành công, tiếp tục đăng nhập
        const loginData = {
            username: productData.username,
            password: productData.password
        };

        fetch('http://localhost:8080/api/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginData)
        })
            .then(response => response.json())
            .then(data => {
                console.log('User logged in:', data);
                alert('User logged in successfully!');

                // Lưu token để dùng cho các request bảo mật sau này
                const token = data.token;
                console.log('JWT Token:', token);

                // Lấy userId từ kết quả đăng nhập và hiển thị
                const userId = data.userId;  // Giả sử server trả về userId khi đăng nhập thành công
                console.log('User ID after login:', userId);

                // Thực hiện các thao tác tiếp theo như lấy danh sách người dùng, cập nhật, xóa, v.v...
                getUsers(token);
                // updateUser(userId, token);
                // deleteUser(userId, token);
            })
            .catch(error => {
                console.error('Error logging in user:', error);
                alert('Failed to log in user!');
            });
    })
    .catch(error => {
        console.error('Error registering user:', error);
        alert('Failed to register user!');
    });

// 2. Lấy danh sách người dùng (Cần JWT token trong header)
function getUsers(token) {
    if (!token) {
        alert('No token provided!');
        return;
    }

    fetch('http://localhost:8080/api/users/users', {
        method: 'GET',
        headers: {
            'Authorization': ` ${token}` // Gửi token trong header
        }
    })
        .then(response => response.json())
        .then(data => {
            console.log('Users:', data);
            alert('Users fetched successfully!');
        })
        .catch(error => {
            console.error('Error fetching users:', error);
            alert('Failed to fetch users!');
        });
}

