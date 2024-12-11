using Learning.Application.Models.Courses.Dtos;

namespace Learning.Application.Models.Courses.Queries.GetCoursesWithParticipation;

public record GetCoursesWithParticipationQuery(PaginationRequest PaginationRequest, string[]? CourseIds, GetCoursesWithParticipationFilter Filter) : IQuery<GetCoursesWithParticipationResult>;
public record GetCoursesWithParticipationResult(PaginatedResult<CourseWithParticipationDto> Courses);
public record GetCoursesWithParticipationFilter(string? SearchString);
public class GetCoursesWithParticipationValidator : AbstractValidator<GetCoursesWithParticipationQuery> {
    public GetCoursesWithParticipationValidator() {
        RuleFor(query => query.CourseIds)
            .Must(ids => ids == null || ids.Length == 0 || ids.All(id => Guid.TryParse(id, out _)))
            .WithMessage("Each CourseId must be a valid GUID if provided.");
    }
}