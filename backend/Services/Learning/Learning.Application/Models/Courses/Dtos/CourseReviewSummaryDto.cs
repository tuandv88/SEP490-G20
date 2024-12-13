namespace Learning.Application.Models.Courses.Dtos;
public record CourseReviewSummaryDto(
    double AverageRating,
    int TotalReviews,
    Dictionary<int, int> StarRatings,
    PaginatedResult<CourseReviewDto> Reviews
);
