namespace Course.Domain.Enums;
public enum CourseStatus {
    Draft,         // Khóa học đang ở chế độ nháp
    Published,     // Khóa học đã được công khai
    Scheduled,     // Khóa học đã được lên lịch công khai
    Archived,      // Khóa học ở trạng thái lưu trữ, không còn được Published nữa
}

