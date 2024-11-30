using Learning.Application.Models.Courses.Dtos;

namespace Learning.Application.Models.Courses.Queries.GetStatistics.GetMostPopularCourseWithEnrollments;
public class GetMostPopularCourseWithEnrollmentsHandler(ICourseRepository courseRepository, IUserEnrollmentRepository userEnrollmentRepository) : IQueryHandler<GetMostPopularCourseWithEnrollmentsQuery, GetMostPopularCourseWithEnrollmentsResult> {
    public async Task<GetMostPopularCourseWithEnrollmentsResult> Handle(GetMostPopularCourseWithEnrollmentsQuery request, CancellationToken cancellationToken) {
        var pageIndex = request.PaginationRequest.PageIndex;
        var pageSize = request.PaginationRequest.PageSize;

        var courseEnrollmentStatsQuery = userEnrollmentRepository.GetAllAsQueryable()
            .GroupBy(ue => ue.CourseId)
            .Select(g => new {
                CourseId = g.Key,
                EnrollmentCount = g.Count()
            });

        var coursesQuery = courseRepository.GetAllAsQueryable()
            .Where(course => courseEnrollmentStatsQuery.Any(stat => stat.CourseId == course.Id));

        var coursesWithEnrollments = await coursesQuery
            .Join(courseEnrollmentStatsQuery, course => course.Id, enrollmentStat => enrollmentStat.CourseId, (course, enrollmentStat) => new {
                course.Id,
                course.Title,
                course.Price,
                enrollmentStat.EnrollmentCount
            })
            .OrderByDescending(c => c.EnrollmentCount) 
            .Skip((pageIndex - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);

        var courseWithEnrollmentDtos = coursesWithEnrollments.Select(c => new CourseWithEnrollmentDto(
            CourseId: c.Id.Value,
            Title: c.Title,
            EnrollmentCount: c.EnrollmentCount,
            Price: c.Price
        )).ToList();

        var totalCount = await courseEnrollmentStatsQuery.CountAsync(cancellationToken);

        return new GetMostPopularCourseWithEnrollmentsResult(
            new PaginatedResult<CourseWithEnrollmentDto>(pageIndex, pageSize, totalCount, courseWithEnrollmentDtos)
        );

    }
}

