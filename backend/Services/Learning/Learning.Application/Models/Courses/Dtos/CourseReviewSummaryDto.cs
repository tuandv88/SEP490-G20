namespace Learning.Application.Models.Courses.Dtos;
public record CourseReviewSummaryDto(
    double AverageRating,
    int TotalReviews,
    PaginatedResult<CourseReviewDto> Reviews
);

