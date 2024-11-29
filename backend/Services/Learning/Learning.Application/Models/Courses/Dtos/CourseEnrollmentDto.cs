namespace Learning.Application.Models.Courses.Dtos;
public record CourseEnrollmentDto(
    Guid CourseId,
    string? Title,
    int EnrollmentCount   
);

public record MonthlyCourseEnrollmentDto(
    int Year,
    int Month,
    List<CourseEnrollmentDto> Courses
);