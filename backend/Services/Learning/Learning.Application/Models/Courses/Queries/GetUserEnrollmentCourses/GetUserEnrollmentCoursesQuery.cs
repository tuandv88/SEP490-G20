using Learning.Application.Models.Courses.Dtos;
using Microsoft.AspNetCore.Authorization;

namespace Learning.Application.Models.Courses.Queries.GetUserEnrollmentCourses;

[Authorize]
public record GetUserEnrollmentCoursesQuery(PaginationRequest PaginationRequest, string[]? CourseIds) : IQuery<GetUserEnrollmentCoursesResult>;
public record GetUserEnrollmentCoursesResult(PaginatedResult<UserEnrollmentDetailsDto> CourseDtos);

public class GetUserEnrollmentCoursesQueryValidator : AbstractValidator<GetUserEnrollmentCoursesQuery> {
    public GetUserEnrollmentCoursesQueryValidator() {
        RuleFor(query => query.CourseIds)
            .Must(ids => ids == null || ids.Length == 0 || ids.All(id => Guid.TryParse(id, out _)))
            .WithMessage("Each CourseId must be a valid GUID if provided.");
    }
}