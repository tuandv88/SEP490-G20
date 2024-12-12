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


    public static string DiscussionFlaggedTemplate(string fullName, string title, string description, string flaggedDate, string violationLevel, string violationLevelClass, string reason, string callbackUrl)
    {
        string htmlStr = $@"
<!DOCTYPE html>
<html lang='en'>
<head>
    <meta charset='UTF-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1.0'>
    <title>Discussion Flagged Notification - ICoder</title>
    <link href='https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap' rel='stylesheet'>
    <style>
        body {{
            font-family: 'Poppins', sans-serif;
            background-color: #f4f4f4;
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
            color: #e67e22;
            font-weight: 600;
            margin-bottom: 30px;
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
            background: linear-gradient(45deg, #e67e22, #d35400);
            color: #ffffff !important;
            text-decoration: none;
            padding: 16px 36px;
            font-size: 18px;
            border-radius: 50px;
            text-align: center;
            font-weight: 600;
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
            transition: background 0.3s ease, transform 0.3s ease;
        }}

        .btn:hover {{
            transform: translateY(-4px);
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
            color: #e67e22;
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

        hr {{
            border: 0;
            border-top: 1px solid #ddd;
            margin: 30px 0;
        }}

        .small-text {{
            font-size: 12px;
            color: #999;
        }}

        .low-violation {{
            background-color: #fff3cd;
            color: #856404;
            border: 1px solid #ffeeba;
        }}

        .medium-violation {{
            background-color: #f9e0b7;
            color: #e67e22;
            border: 1px solid #f1c40f;
        }}

        .high-violation {{
            background-color: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
        }}

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
    <div class='email-wrapper'>
        <div class='email-container'>
            <div class='logo'>
                <img src='https://sin1.contabostorage.com/9414348a03c9471cb842d448f65ca5fb:icoder/backend/imageidentity/ICoderlogomain.jpg' alt='ICoder Logo' />
            </div>

            <div class='header'>
                Discussion Flagged Notification
            </div>

            <div class='message'>
                <p>Hi,<strong> {fullName} </strong>  -  Have a good day. </p>
                <p>We would like to inform you that a discussion has been flagged on ICoder.</p>
                <p><strong>Title:</strong> {title}</p>
                <p><strong>Description: </strong> {description}</p>
                <p><strong>Date Flagged:</strong> {flaggedDate}</p>
                <p><strong>Violation Level:</strong> <span class='{violationLevelClass}'>{violationLevel}</span></p>
                <p><strong>Reason for Flagging:</strong> {reason}</p>
            </div>

            <a href='{callbackUrl}' class='btn'>View Discussion Details</a>

            <p class='small-text'>If you believe this is a mistake, please contact support.</p>
            <hr>

            <div class='footer'>
                <p>ICoder Team</p>
                <p>© 2024 ICoder, All rights reserved.</p>
                <p>
                    <a href='#'>Support</a> · 
                    <a href='#'>Help</a> · 
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


    public static string PaymentSuccessfullyTemplate(string fullName, string recipientEmail, string courseName, decimal amountPaid, string paymentType, DateTime paymentDate, string transactionId, string callbackUrl)
    {
        string htmlStr = $@"
<!DOCTYPE html>
<html lang='en'>
<head>
    <meta charset='UTF-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1.0'>
    <title>Payment Confirmation - Course</title>
    <link href='https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap' rel='stylesheet'>
    <style>
        body {{
            font-family: 'Poppins', sans-serif;
            background-color: #f4f4f4;
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
            color: #ffffff;
            text-decoration: none;
            padding: 16px 36px;
            font-size: 18px;
            border-radius: 50px;
            text-align: center;
            font-weight: 600;
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
            transition: background 0.3s ease, transform 0.3s ease;
        }}
        .btn:hover {{
            background: linear-gradient(45deg, #2980b9, #3498db);
            transform: translateY(-4px);
        }}
        .email-container .btn {{
            color: #ffffff !important;
        }}
        .email-container .btn:hover {{
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
        hr {{
            border: 0;
            border-top: 1px solid #ddd;
            margin: 30px 0;
        }}
        .small-text {{
            font-size: 12px;
            color: #999;
        }}
        .payment-table {{
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
            text-align: left;
            font-size: 14px;
        }}
        .payment-table th, .payment-table td {{
            padding: 12px;
            border: 1px solid #ddd;
        }}
        .payment-table th {{
            background-color: #3498db; /* Màu xanh trùng với nút */
            color: #ffffff; /* Màu chữ trắng */
            font-weight: bold;
        }}
        .payment-table td {{
            background-color: #e3f2fd; 
            color: #333; /* Màu chữ tối để dễ đọc */
        }}
        .payment-table tr:hover {{
            background-color: #b3c8e6; /* Màu nền khi hover */
            cursor: pointer; /* Thêm con trỏ khi di chuột vào bảng */
        }}
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
    <div class='email-wrapper'>
        <div class='email-container'>
            <div class='logo'>
                <img src='https://sin1.contabostorage.com/9414348a03c9471cb842d448f65ca5fb:icoder/backend/imageidentity/ICoderlogomain.jpg' alt='Logo'/>
            </div>
            <div class='header'>
                Payment Confirmation
            </div>
            <div class='message'>
                <p>Hello <strong>{fullName}</strong>, Email: <strong>{recipientEmail}</strong></p>
                <p>We have <strong>successfully</strong> received your payment. Below are the details of the transaction:</p>
                <table class='payment-table'>
                    <tr>
                        <th>Details</th>
                        <th>Information</th>
                    </tr>
                    <tr>
                        <td>Course Name</td>
                        <td>{courseName}</td>
                    </tr>
                    <tr>
                        <td>Payment Amount</td>
                        <td>{amountPaid:C}</td> <!-- Chuyển đổi sang định dạng tiền tệ -->
                    </tr>
                    <tr>
                        <td>Payment Type</td>
                        <td>{paymentType}</td>
                    </tr>
                    <tr>
                        <td>Payment Date</td>
                        <td>{paymentDate:yyyy-MM-dd}</td> <!-- Định dạng ngày tháng -->
                    </tr>
                    <tr>
                        <td>Transaction ID</td>
                        <td>{transactionId}</td>
                    </tr>
                </table>
                <p>To access your course and begin learning, please click the button below:</p>
            </div>
            <a href='{callbackUrl}' class='btn'>Start Course Now</a>
            <p class='small-text'>If you did not make this transaction, please contact us immediately.</p>
            <hr>
            <div class='footer'>
                <p>Thank you for choosing [Company Name] as your trusted learning platform. We are dedicated to helping you achieve your goals.</p>
                <p>Need help? Contact us at: <a href='mailto:support@yourcompany.com'>support@yourcompany.com</a></p>
                <p class='unsubscribe'>If you no longer wish to receive emails from us, you can <a href='#'>unsubscribe here</a>.</p>
                <p>© 2024 [Company Name], All rights reserved.</p>
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

    public static string PaymentFailureTemplate(string fullName, string recipientEmail, string courseName, decimal amountPaid, string paymentType, DateTime paymentDate, string transactionId, string retryUrl)
    {
        string htmlStr = $@"
<!DOCTYPE html>
<html lang='en'>
<head>
    <meta charset='UTF-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1.0'>
    <title>Payment Failure - Course</title>
    <link href='https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap' rel='stylesheet'>
    <style>
        body {{
            font-family: 'Poppins', sans-serif;
            background-color: #f4f4f4;
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
        .email-wrapper {{
            background-color: #fbe9e7;
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
            color: #e74c3c;
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
            background: linear-gradient(45deg, #e74c3c, #c0392b);
            color: #ffffff;
            text-decoration: none;
            padding: 16px 36px;
            font-size: 18px;
            border-radius: 50px;
            text-align: center;
            font-weight: 600;
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
            transition: background 0.3s ease, transform 0.3s ease;
        }}
        .btn:hover {{
            background: linear-gradient(45deg, #c0392b, #e74c3c);
            transform: translateY(-4px);
        }}
        .email-container .btn {{
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
            color: #e74c3c;
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
        hr {{
            border: 0;
            border-top: 1px solid #ddd;
            margin: 30px 0;
        }}
        .small-text {{
            font-size: 12px;
            color: #999;
        }}
        .payment-table {{
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
            text-align: left;
            font-size: 14px;
        }}
        .payment-table th, .payment-table td {{
            padding: 12px;
            border: 1px solid #ddd;
        }}
        .payment-table th {{
            background-color: #e74c3c;
            color: #ffffff;
            font-weight: bold;
        }}
        .payment-table td {{
            background-color: #fbe9e7; 
            color: #333;
        }}
        .payment-table tr:hover {{
            background-color: #f5c6cb;
            cursor: pointer;
        }}
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
    <div class='email-wrapper'>
        <div class='email-container'>
            <div class='logo'>
                <img src='https://sin1.contabostorage.com/9414348a03c9471cb842d448f65ca5fb:icoder/backend/imageidentity/ICoderlogomain.jpg' alt='Logo'/>
            </div>
            <div class='header'>
                Payment Failed
            </div>
            <div class='message'>
                <p>Hello <strong>{fullName}</strong>,</p>
                <p>We are sorry, but your payment attempt for the course <strong>{courseName}</strong> has failed. Below are the details of the transaction:</p>
                <table class='payment-table'>
                    <tr>
                        <th>Details</th>
                        <th>Information</th>
                    </tr>
                    <tr>
                        <td>Course Name</td>
                        <td>{courseName}</td>
                    </tr>
                    <tr>
                        <td>Payment Amount</td>
                        <td>{amountPaid:C}</td>
                    </tr>
                    <tr>
                        <td>Payment Type</td>
                        <td>{paymentType}</td>
                    </tr>
                    <tr>
                        <td>Attempt Date</td>
                        <td>{paymentDate:yyyy-MM-dd}</td>
                    </tr>
                    <tr>
                        <td>Transaction ID</td>
                        <td>{transactionId}</td>
                    </tr>
                </table>
                <p>Please check your payment details and try again by clicking the button below. If the issue persists, please contact our support team for further assistance.</p>
            </div>
            <a href='{retryUrl}' class='btn'>Retry Payment</a>
            <p class='small-text'>If you did not attempt this transaction, please contact us immediately.</p>
            <hr>
            <div class='footer'>
                <p>Need help? Contact us at: <a href='mailto:support@yourcompany.com'>support@yourcompany.com</a></p>
                <p class='unsubscribe'>If you no longer wish to receive emails from us, you can <a href='#'>unsubscribe here</a>.</p>
                <p>© 2024 [Company Name], All rights reserved.</p>
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