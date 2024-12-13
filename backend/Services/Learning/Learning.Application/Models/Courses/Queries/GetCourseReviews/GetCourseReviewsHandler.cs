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
        
        var starRatings = await courseReviewsQuery
            .GroupBy(ue => ue.Rating)
            .Select(g => new { Star = g.Key, Count = g.Count() })
            .ToDictionaryAsync(g => g.Star, g => g.Count, cancellationToken);
        
        //check xem nếu có mức sao nào chưa có thì để mặc định là 0
        var completeStarRatings = Enumerable.Range(1, 5).ToDictionary(star => star, star => starRatings.GetValueOrDefault(star, 0));
        
        var userEnrollments = allData.OrderByDescending(ue => ue.LastModified)
                                    .Where(ue => ue.CourseId.Equals(CourseId.Of(request.CourseId)) && ue.Rating > 0)
                                    .Skip(pageSize * (pageIndex - 1))
                                    .Take(pageSize)
                                    .ToList();
        
        var averageRating = userEnrollments.Any(e => e.Rating > 0)
            ? Math.Round(userEnrollments.Where(e => e.Rating > 0).Average(e => e.Rating), 1)
            : 0;
        var courseReviews = userEnrollments.Select(ue => new CourseReviewDto(ue.UserId.Value, ue.Feedback, ue.Rating, ue.LastModified!.Value)).ToList();
        var courseReviewSummary = new CourseReviewSummaryDto(averageRating, totalReviews, completeStarRatings,
            new PaginatedResult<CourseReviewDto>(pageIndex, pageSize, totalReviews, courseReviews));

        return new GetCourseReviewsResult(courseReviewSummary);
    }
}

