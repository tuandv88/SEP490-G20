using Learning.Application.Models.Courses.Dtos;

namespace Learning.Application.Models.Courses.Queries.GetCourseReviews;
public class GetCourseReviewsHandler(IUserEnrollmentRepository repository) : IQueryHandler<GetCourseReviewsQuery, GetCourseReviewsResult> {
    public async Task<GetCourseReviewsResult> Handle(GetCourseReviewsQuery request, CancellationToken cancellationToken) {

        var pageIndex = request.PaginationRequest.PageIndex;
        var pageSize = request.PaginationRequest.PageSize;

        var allData = repository.GetAllAsQueryable();

        var courseReviewsQuery = allData
            .Where(ue => ue.CourseId.Equals(CourseId.Of(request.CourseId)) && ue.Rating > 0);
        var totalReviews = await courseReviewsQuery.CountAsync(cancellationToken);
        
        var userEnrollments = allData.OrderByDescending(ue => ue.LastModified)
                                    .Where(ue => ue.CourseId.Equals(CourseId.Of(request.CourseId)) && ue.Rating > 0)
                                    .Skip(pageSize * (pageIndex - 1))
                                    .Take(pageSize)
                                    .ToList();

        var totalRating = userEnrollments.Where(ue => ue.Rating > 0).Sum(u => u.Rating);
        var averageRating = totalReviews > 0
            ? Math.Round((double)totalRating / (totalReviews * 5), 1) * 5 
            : 0;
        var courseReviews = userEnrollments.Select(ue => new CourseReviewDto(ue.UserId.Value, ue.Feedback, ue.Rating, ue.LastModified!.Value)).ToList();
        var courseReviewSumary = new CourseReviewSummaryDto(averageRating, totalReviews, 
            new PaginatedResult<CourseReviewDto>(pageIndex, pageSize, totalReviews, courseReviews));

        return new GetCourseReviewsResult(courseReviewSumary);
    }
}

