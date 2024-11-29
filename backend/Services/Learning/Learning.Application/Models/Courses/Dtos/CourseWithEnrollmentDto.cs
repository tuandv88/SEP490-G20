namespace Learning.Application.Models.Courses.Dtos;
public record CourseWithEnrollmentDto(
    Guid CourseId,
    string Title,
    int EnrollmentCount,
    double Price
);
