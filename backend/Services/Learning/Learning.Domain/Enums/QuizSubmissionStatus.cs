namespace Learning.Domain.Enums;
public enum QuizSubmissionStatus {
    InProgress,   // Quiz đang được làm nhưng chưa nộp
    Processing,   // Quiz đã được nộp và đang xử lý
    Success,      // Quiz đã được chấm thành công
    Fail          // Quiz đã được xử lý nhưng thất bại
}