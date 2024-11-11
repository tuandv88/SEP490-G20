
// Cấu hình OIDC client để kết nối với IdentityServer
var config = {
	client_id: "icoder.vn",													  // Client ID cấu hình trên IdentityServer
	response_type: "code",													  // Sử dụng Authorization Code Flow
	requirePkce: true,														  // Bật PKCE để tăng cường bảo mật
	authority: "https://localhost:6001",									  // URL của IdentityServer
	redirect_uri: "https://localhost:5003/callback.html",					  // Trang callback sau khi đăng nhập thành công
	post_logout_redirect_uri: "https://localhost:5003/index.html",			  // Trang sau khi đăng xuất
	scope: "openid profile email moviesApi roles offline_access",			  // Các scope yêu cầu
	loadUserInfo: true,														  // Tải thêm thông tin người dùng từ UserInfo endpoint
	silent_redirect_uri: "https://localhost:5003/silent-renew.html",          // Trang chạy ngầm để gia hạn token
	automaticSilentRenew: true 												  // Tự động gia hạn token

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
			xhr.open("GET", "https://localhost:6002/api/movies");                   // URL API bảo vệ
			xhr.setRequestHeader("Authorization", "Bearer " + user.access_token);   // Gửi kèm access token
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
	log("Profile: " + JSON.stringify(user.profile, null, 2));
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

userManager.events.addAccessTokenExpired(() => {
	log("Access token đã hết hạn. Đăng xuất người dùng...");
	userManager.signoutRedirect();  // Chuyển hướng người dùng tới trang đăng xuất
});

//// Đăng nhập ngầm (silent renew) khi token gần hết hạn
//userManager.events.addAccessTokenExpiring(() => {
//	userManager.signinSilent()
//		.then(user => {
//			console.log("Token đã được gia hạn:", user.access_token);
//		})
//		.catch(err => {
//			console.error("Lỗi gia hạn token:", err);
//		});
//});

//// Lắng nghe lỗi khi quá trình gia hạn thất bại
//userManager.events.addSilentRenewError(err => {
//	console.error("Gia hạn token ngầm thất bại:", err);
//});

//userManager.events.addAccessTokenExpiring(() => {
//	console.log("Access token sắp hết hạn. Bắt đầu gia hạn token...");

// Gọi hàm gia hạn token thủ công
//userManager.signinSilent()
//	.then(user => {
//		log("Access token mới: " + user.access_token);
//		log("Refresh token mới: " + user.refresh_token);			// Hiển thị refresh token mới

//		// Lưu lại access token và refresh token mới
//		localStorage.setItem("access_token", user.access_token);    // Lưu access token mới
//		if (user.refresh_token) {
//			localStorage.setItem("refresh_token", user.refresh_token);  // Lưu refresh token mới
//		}
//	})
//	.catch(err => {
//		console.error("Lỗi gia hạn token:", err);
//	});



// - signinSilent() đã có sẵn trong oidc-client.js 
// - Để hàm này hoạt động, cần cấu hình silent_redirect_uri và tạo trang silent - renew.html
// - Hàm này cho phép gia hạn access token ngầm mà không cần người dùng phải đăng nhập lại.
