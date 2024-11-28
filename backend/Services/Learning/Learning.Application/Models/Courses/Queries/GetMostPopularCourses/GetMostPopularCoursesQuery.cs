using Learning.Application.Models.Courses.Dtos;

namespace Learning.Application.Models.Courses.Queries.GetMostPopularCourses;
public record GetMostPopularCoursesQuery(PaginationRequest PaginationRequest) : IQuery<GetMostPopularCourseResult>;
public record GetMostPopularCourseResult(PaginatedResult<CourseDto> CourseDtos);

