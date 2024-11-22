using Learning.Application.Models.Courses.Dtos;

namespace Learning.Application.Models.Courses.Queries.GetStatusEnrollment;
public record GetEnrollmentInfoQuery(Guid CourseId): IQuery<GetEnrollmentInfoResult>;
public record GetEnrollmentInfoResult(UserEnrollmentDto? EnrollmentInfo);