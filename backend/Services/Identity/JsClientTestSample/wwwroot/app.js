
// Cấu hình OIDC client để kết nối với IdentityServer
var config = {
	authority: "https://localhost:5001",                        // URL của IdentityServer
	client_id: "movies_client",                                 // Client ID cấu hình trên IdentityServer
	redirect_uri: "https://localhost:5003/callback.html",       // Trang callback sau khi đăng nhập thành công
	post_logout_redirect_uri: "https://localhost:5003/index.html", // Trang sau khi đăng xuất
	response_type: "code",                                      // Sử dụng Authorization Code Flow
	scope: "offline_access openid profile email moviesApi roles",     // Các scope yêu cầu
	client_secret: "secret",                                    // Client secret(plain-text)
	requirePkce: true,                                          // Bật PKCE để tăng cường bảo mật
	automaticSilentRenew: true,                                 // Tự động gia hạn token
	loadUserInfo: true                                          // Tải thêm thông tin người dùng từ UserInfo endpoint

	 // Sử dụng localStorage để lưu trữ token thay vì sessionStorage (mặc định)
    //userStore: new Oidc.WebStorageStateStore({ store: window.localStorage })
};

// Tạo một UserManager từ oidc-client với cấu hình trên
var userManager = new Oidc.UserManager(config);

// Hàm để ghi kết quả ra màn hình
function log(message) {
	document.getElementById('results').innerText += message + '\n';
}

// Hàm đăng nhập: chuyển hướng người dùng đến trang đăng nhập của IdentityServer
function login() {
	userManager.signinRedirect();
}

// Hàm gọi API bảo vệ: yêu cầu access token trước khi gọi
function callApi() {
	userManager.getUser().then(function (user) {
		if (user) {
			console.log("User's access token: ", user.access_token);
			var xhr = new XMLHttpRequest();
			xhr.open("GET", "https://localhost:6001/api/movies");                   // URL API bảo vệ
			xhr.setRequestHeader("Authorization", "Bearer " + user.access_token);  // Gửi kèm access token
			xhr.onload = function () {
				log("API response: " + xhr.responseText);
				console.log("API response: ", xhr.responseText);
			};
			xhr.onerror = function () {
				log("Error while calling API");
				console.error("API call failed.");
			};
			xhr.send();
		} else {
			log("User is not logged in");
			console.error("User is not logged in");
		}
	});
}

//Hàm hiển thị thông tin người dùng
function displayUserInfo(user) {
	log("User Profile Information:");
	log("Profile: " + user.profile);
	log("Role: " + user.profile.role);
	log("Email: " + user.profile.email);  // Email của người dùng (nếu có)
	log("OpenID: " + user.profile.sub);   // OpenID của người dùng (sub)
	log("Access Token: " + user.access_token);  // Hiển thị access token
	log("Refresh Token: " + (user.refresh_token || "No refresh token available"));  // Hiển thị refresh token nếu có
}


// Hàm đăng xuất: chuyển hướng người dùng đến trang đăng xuất của IdentityServer
function logout() {
	userManager.signoutRedirect();
}

// Kiểm tra trạng thái đăng nhập khi trang được tải
userManager.getUser().then(function (user) {
	if (user) {
		log("User is logged in");
		displayUserInfo(user);  // Hiển thị thông tin người dùng
	} else {
		log("User is not logged in");
	}
});

// Đăng ký sự kiện click cho các nút
document.getElementById('login').addEventListener('click', login);
document.getElementById('api').addEventListener('click', callApi);
document.getElementById('logout').addEventListener('click', logout);


