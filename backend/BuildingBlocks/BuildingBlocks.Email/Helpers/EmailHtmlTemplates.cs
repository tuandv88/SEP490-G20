namespace BuildingBlocks.Email.Helpers;

public static class EmailHtmlTemplates
{
    public static string ConfirmEmailTemplate(string fullName, string callbackUrl)
    {
        string htmlStr = $@"
<!DOCTYPE html>
<html lang='en'>
<head>
    <meta charset='UTF-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1.0'>
    <title>Confirm Your Email - ICoder</title>
    <!-- Link to Google Fonts for a more modern look -->
    <link href='https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap' rel='stylesheet'>
    <style>
        body {{
            font-family: 'Poppins', sans-serif;
            background-color: #f4f4f4; /* Background màu sáng cho toàn bộ trang */
            margin: 0;
            padding: 0;
            line-height: 1.6;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
        }}

        .email-container {{
            width: 100%;
            max-width: 600px;
            margin: 40px auto;
            background-color: #ffffff;
            padding: 40px;
            border-radius: 20px;
            box-shadow: 0 20px 50px rgba(0, 0, 0, 0.1);
            text-align: center;
        }}

        /* Thêm một background nhẹ xung quanh email container */
        .email-wrapper {{
            background-color: #e5e5e5;
            padding: 30px;
            border-radius: 30px;
        }}

        .logo img {{
            width: 220px;
            height: auto;
            margin-bottom: 30px;
        }}

        .header {{
            font-size: 32px;
            color: #3b7ed0;
            font-weight: 600;
            margin-bottom: 30px;
            line-height: 1.3;
        }}

        .message {{
            font-size: 16px;
            color: #555;
            margin-bottom: 40px;
            text-align: left;
        }}

        .message p {{
            margin-bottom: 20px;
        }}

        .btn {{
            display: inline-block;
            background: linear-gradient(45deg, #3498db, #2980b9);
            color: #ffffff;  /* Màu chữ trắng trong trạng thái bình thường */
            text-decoration: none;
            padding: 16px 36px;
            font-size: 18px;
            border-radius: 50px;
            text-align: center;
            font-weight: 600;
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
            transition: background 0.3s ease, transform 0.3s ease;
        }}

        /* Giữ nguyên màu chữ khi hover */
        .btn:hover {{
            background: linear-gradient(45deg, #2980b9, #3498db);
            transform: translateY(-4px);
        }}
        
        /* Đảm bảo màu chữ luôn là trắng, ngay cả khi hover */
        .email-container .btn {{
            color: #ffffff !important;
        }}

        .email-container .btn:hover {{
            color: #ffffff !important;
        }}

        .email-container .btn span {{
            color: #ffffff !important;
        }}    

        .footer {{
            font-size: 14px;
            color: #777;
            margin-top: 40px;
            padding: 20px;
            background-color: #f4f4f4;
            text-align: center;
            border-radius: 15px;
        }}

        .footer a {{
            color: #3498db;
            text-decoration: none;
            font-weight: 500;
            margin: 0 8px;
        }}

        .footer p {{
            margin-bottom: 10px;
        }}

        .footer .unsubscribe {{
            font-size: 12px;
            color: #999;
        }}

        /* Divider style */
        hr {{
            border: 0;
            border-top: 1px solid #ddd;
            margin: 30px 0;
        }}

        /* Smaller text styling */
        .small-text {{
            font-size: 12px;
            color: #999;
        }}

        /* Mobile responsiveness */
        @media (max-width: 600px) {{
            .email-container {{
                padding: 20px;
            }}
            
            .header {{
                font-size: 28px;
            }}

            .btn {{
                padding: 14px 30px;
                font-size: 16px;
            }}
        }}
    </style>
</head>
<body>
    <!-- Wrapper bên ngoài để thêm background xung quanh email container -->
    <div class='email-wrapper'>
        <div class='email-container'>
            <!-- Logo -->
            <div class='logo'>
                <img src='https://sin1.contabostorage.com/9414348a03c9471cb842d448f65ca5fb:icoder/backend/imageidentity/ICoderlogomain.jpg' alt='ICoder Logo' />
            </div>

            <!-- Header -->
            <div class='header'>
                Welcome to ICoder!
            </div>

            <!-- Message -->
            <div class='message'>
                <p>Hello, <strong>{fullName}</strong></p>
                <p>Thank you for registering with ICoder! To confirm your email address, please click the button below:</p>
            </div>

            <!-- Confirm Button -->
            <a href='{callbackUrl}' class='btn'>Confirm Email</a>

            <!-- Smaller and gray text -->
            <p class='small-text'>If you did not request this, please ignore this email.</p>

            <!-- Divider -->
            <hr>
            
            <!-- Footer -->
            <div class='footer'>
                <p>Join us to discover useful information and enhance the skills you need.</p>
                <p class='unsubscribe'>If you no longer wish to receive these emails, you can <a href='#'>unsubscribe here</a>.</p>

                <!-- Additional Footer Links -->
                <p>© 2024 ICoder, All rights reserved.</p>
                <p>
                    <a href='#'>Feedback</a> · 
                    <a href='#'>Help</a> · 
                    <a href='#'>FAQs</a> · 
                    <a href='#'>Terms</a>
                </p>
            </div>
        </div>
    </div>
</body>
</html>
";

        return htmlStr;
    }

    public static string ResetPasswordTemplate(string fullName, string callbackUrl)
    {
        string htmlStr = $@"
<!DOCTYPE html>
<html lang='en'>
<head>
    <meta charset='UTF-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1.0'>
    <title>Reset Your Password - ICoder</title>
    <!-- Link to Google Fonts for a more modern look -->
    <link href='https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap' rel='stylesheet'>
    <style>
        body {{
            font-family: 'Poppins', sans-serif;
            background-color: #f4f4f4; /* Background màu sáng cho toàn bộ trang */
            margin: 0;
            padding: 0;
            line-height: 1.6;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
        }}

        .email-container {{
            width: 100%;
            max-width: 600px;
            margin: 40px auto;
            background-color: #ffffff;
            padding: 40px;
            border-radius: 20px;
            box-shadow: 0 20px 50px rgba(0, 0, 0, 0.1);
            text-align: center;
        }}

        /* Thêm một background nhẹ xung quanh email container */
        .email-wrapper {{
            background-color: #e5e5e5;
            padding: 30px;
            border-radius: 30px;
        }}

        .logo img {{
            width: 220px;
            height: auto;
            margin-bottom: 30px;
        }}

        .header {{
            font-size: 32px;
            color: #3b7ed0;
            font-weight: 600;
            margin-bottom: 30px;
            line-height: 1.3;
        }}

        .message {{
            font-size: 16px;
            color: #555;
            margin-bottom: 40px;
            text-align: left;
        }}

        .message p {{
            margin-bottom: 20px;
        }}

        .btn {{
            display: inline-block;
            background: linear-gradient(45deg, #3498db, #2980b9);
            color: #ffffff;  /* Màu chữ trắng trong trạng thái bình thường */
            text-decoration: none;
            padding: 16px 36px;
            font-size: 18px;
            border-radius: 50px;
            text-align: center;
            font-weight: 600;
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
            transition: background 0.3s ease, transform 0.3s ease;
        }}

        /* Giữ nguyên màu chữ khi hover */
        .btn:hover {{
            background: linear-gradient(45deg, #2980b9, #3498db);
            transform: translateY(-4px);
        }}
        
        /* Đảm bảo màu chữ luôn là trắng, ngay cả khi hover */
        .email-container .btn {{
            color: #ffffff !important;
        }}

        .email-container .btn:hover {{
            color: #ffffff !important;
        }}

        .email-container .btn span {{
            color: #ffffff !important;
        }}    

        .footer {{
            font-size: 14px;
            color: #777;
            margin-top: 40px;
            padding: 20px;
            background-color: #f4f4f4;
            text-align: center;
            border-radius: 15px;
        }}

        .footer a {{
            color: #3498db;
            text-decoration: none;
            font-weight: 500;
            margin: 0 8px;
        }}

        .footer p {{
            margin-bottom: 10px;
        }}

        .footer .unsubscribe {{
            font-size: 12px;
            color: #999;
        }}

        /* Divider style */
        hr {{
            border: 0;
            border-top: 1px solid #ddd;
            margin: 30px 0;
        }}

        /* Smaller text styling */
        .small-text {{
            font-size: 12px;
            color: #999;
        }}

        /* Mobile responsiveness */
        @media (max-width: 600px) {{
            .email-container {{
                padding: 20px;
            }}
            
            .header {{
                font-size: 28px;
            }}

            .btn {{
                padding: 14px 30px;
                font-size: 16px;
            }}
        }}
    </style>
</head>
<body>
    <!-- Wrapper bên ngoài để thêm background xung quanh email container -->
    <div class='email-wrapper'>
        <div class='email-container'>
            <!-- Logo -->
            <div class='logo'>
                <img src='https://sin1.contabostorage.com/9414348a03c9471cb842d448f65ca5fb:icoder/backend/imageidentity/ICoderlogomain.jpg' alt='ICoder Logo' />
            </div>

            <!-- Header -->
            <div class='header'>
                Reset Your Password
            </div>

            <!-- Message -->
            <div class='message'>
                <p>Hello, <strong>{fullName}</strong></p>
                <p>We received a request to reset your password for your ICoder account. To reset your password, please click the button below:</p>
            </div>

            <!-- Reset Password Button -->
            <a href='{callbackUrl}' class='btn'>Reset Password</a>

            <!-- Smaller and gray text -->
            <p class='small-text'>If you did not request this, please ignore this email.</p>

            <!-- Divider -->
            <hr>
            
            <!-- Footer -->
            <div class='footer'>
                <p>Join us to discover useful information and enhance the skills you need.</p>
                <p class='unsubscribe'>If you no longer wish to receive these emails, you can <a href='#'>unsubscribe here</a>.</p>

                <!-- Additional Footer Links -->
                <p>© 2024 ICoder, All rights reserved.</p>
                <p>
                    <a href='#'>Feedback</a> · 
                    <a href='#'>Help</a> · 
                    <a href='#'>FAQs</a> · 
                    <a href='#'>Terms</a>
                </p>
            </div>
        </div>
    </div>
</body>
</html>
";
        return htmlStr;
    }

}

