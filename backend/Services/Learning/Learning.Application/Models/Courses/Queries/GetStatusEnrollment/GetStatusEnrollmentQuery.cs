using Microsoft.AspNetCore.Authorization;

namespace Learning.Application.Models.Courses.Queries.GetStatusEnrollment;
public record GetStatusEnrollmentQuery(Guid CourseId): IQuery<GetStatusEnrollmentResult>;
public record GetStatusEnrollmentResult(bool IsEnrolled);

