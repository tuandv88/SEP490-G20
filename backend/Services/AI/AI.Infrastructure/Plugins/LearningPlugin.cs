using System.ComponentModel;

namespace AI.Infrastructure.Plugins;
public class LearningPlugin {
    [KernelFunction, Description("Retrieves detailed information about a lecture based on the provided LectureId.")]
    public static string? GetLectureDetails(
        Guid LectureId
        ) {
        return @"Bài học 1: Giới thiệu về Lập trình Java Cơ Bản

Mục tiêu học tập:
Hiểu cơ bản về Java là gì và tại sao nó được sử dụng rộng rãi.
Biết cách cài đặt Java Development Kit (JDK) và Java Runtime Environment (JRE).
Viết và chạy chương trình Java đầu tiên.
1. Java là gì?
Java là một ngôn ngữ lập trình mạnh mẽ, hướng đối tượng được phát triển bởi Sun Microsystems vào giữa những năm 1990. Java có đặc điểm là ""Write Once, Run Anywhere"", có nghĩa là mã Java có thể chạy trên bất kỳ hệ điều hành nào có cài đặt Java Runtime Environment (JRE).

Java được sử dụng rộng rãi trong phát triển ứng dụng desktop, ứng dụng web, ứng dụng di động (Android), và hệ thống nhúng.

2. Cài đặt Java Development Kit (JDK) và Java Runtime Environment (JRE)
Trước khi bắt đầu lập trình Java, bạn cần cài đặt JDK và JRE trên máy tính của mình.

Các bước cài đặt:
Bước 1: Truy cập trang web chính thức của Oracle: https://www.oracle.com/java/technologies/javase-jdk15-downloads.html
Bước 2: Tải xuống JDK phù hợp với hệ điều hành của bạn (Windows, macOS, hoặc Linux).
Bước 3: Cài đặt JDK và JRE theo hướng dẫn cài đặt của Oracle.
Bước 4: Kiểm tra cài đặt bằng cách mở Command Prompt (Windows) hoặc Terminal (macOS, Linux) và gõ lệnh java -version để kiểm tra phiên bản Java đã cài đặt.
3. Cấu trúc một chương trình Java
Một chương trình Java cơ bản gồm có các phần sau:

Lớp (Class): Là đơn vị cơ bản trong Java, nơi chứa mã nguồn của chương trình.
Phương thức (Method): Là nơi chứa các đoạn mã thực thi trong chương trình.
Biến (Variable): Dùng để lưu trữ dữ liệu trong chương trình.
Cấu trúc chương trình Java:
java
Sao chép mã
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println(""Hello, World!"");
    }
}
public class HelloWorld: Định nghĩa một lớp Java có tên là HelloWorld.
public static void main(String[] args): Phương thức main là điểm bắt đầu của chương trình.
System.out.println(""Hello, World!"");: Dòng lệnh này sẽ in ra dòng chữ ""Hello, World!"" lên màn hình.
4. Chạy chương trình Java đầu tiên
Sau khi bạn đã viết mã nguồn của chương trình Java, bạn cần biên dịch và chạy chương trình.

Các bước chạy chương trình:
Bước 1: Mở Notepad (Windows) hoặc Text Editor (macOS, Linux) và sao chép mã nguồn vào đó.

Bước 2: Lưu tập tin với đuôi .java (ví dụ: HelloWorld.java).

Bước 3: Mở Command Prompt hoặc Terminal và điều hướng đến thư mục chứa tập tin Java.

Bước 4: Biên dịch chương trình bằng lệnh:

bash
Sao chép mã
javac HelloWorld.java
Bước 5: Chạy chương trình bằng lệnh:

bash
Sao chép mã
java HelloWorld
Kết quả: Bạn sẽ thấy thông điệp ""Hello, World!"" được in ra màn hình.

5. Các khái niệm cơ bản trong Java
Biến (Variable): Dùng để lưu trữ giá trị trong chương trình. Ví dụ:

java
Sao chép mã
int age = 25;
String name = ""John"";
Kiểu dữ liệu (Data Types): Các kiểu dữ liệu cơ bản trong Java bao gồm:

int: Dùng để lưu trữ số nguyên.
double: Dùng để lưu trữ số thực.
String: Dùng để lưu trữ chuỗi văn bản.
boolean: Dùng để lưu trữ giá trị true hoặc false.
Câu lệnh điều kiện (if-else): Được dùng để kiểm tra điều kiện và thực thi các lệnh khác nhau tùy vào kết quả của điều kiện.

java
Sao chép mã
if (age >= 18) {
    System.out.println(""You are an adult."");
} else {
    System.out.println(""You are a minor."");
}
Vòng lặp (Loop): Dùng để lặp lại một đoạn mã nhiều lần.

java
Sao chép mã
for (int i = 0; i < 5; i++) {
    System.out.println(""Iteration "" + i);
}
6. Kết luận
Bài học này đã cung cấp cho bạn một cái nhìn tổng quan về lập trình Java, cách cài đặt Java, và cách viết chương trình đầu tiên. Bạn đã học được cách sử dụng biến, kiểu dữ liệu, câu lệnh điều kiện, và vòng lặp trong Java. Đây là những kiến thức cơ bản và cần thiết để bắt đầu với lập trình Java.";
    }

    //public static string GetAllCourses(
    //    ) {

    //    throw new NotImplementedException();
    //}


}

