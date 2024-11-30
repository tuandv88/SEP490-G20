using Learning.Application.Models.Courses.Dtos;

namespace Learning.Application.Models.Courses.Queries.GetCourses;
public record GetCoursesQuery(PaginationRequest PaginationRequest, GetCourseFilter Filter) : IQuery<GetCoursesResult>;
public record GetCoursesResult(PaginatedResult<CourseDto> CourseDtos);
public record GetCourseFilter(string? SearchString, string? Level, string? Status);
public class GetCoursesValidator : AbstractValidator<GetCoursesQuery> {
    public GetCoursesValidator() {
        RuleFor(x => x.PaginationRequest.PageIndex)
            .GreaterThanOrEqualTo(1)
            .WithMessage("PageIndex must be greater than or equal to 1.");
        RuleFor(x => x.PaginationRequest.PageSize)
            .LessThanOrEqualTo(20)
            .WithMessage("PageSize must be less than or equal to 20.");
    }
}