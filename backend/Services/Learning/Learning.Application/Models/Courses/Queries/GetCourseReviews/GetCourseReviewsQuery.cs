using Learning.Application.Models.Courses.Dtos;

namespace Learning.Application.Models.Courses.Queries.GetCourseReviews;
public record GetCourseReviewsQuery(PaginationRequest PaginationRequest, Guid CourseId) : IQuery<GetCourseReviewsResult>;
public record GetCourseReviewsResult(CourseReviewSummaryDto CourseReviews);
