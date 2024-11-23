using Learning.Application.Models.Lectures.Dtos;

namespace Learning.Application.Models.Lectures.Queries.GetLectureComment;
public class GetLectureCommentHandler(ILectureCommentRepository lectureCommentRepository, ILectureRepository lectureRepository) : IQueryHandler<GetLectureCommentQuery, GetLectureCommentResult> {
    public async Task<GetLectureCommentResult> Handle(GetLectureCommentQuery request, CancellationToken cancellationToken) {

        var lecture = await lectureRepository.GetByIdAsync(request.LectureId);
        if(lecture == null) { 
            throw new NotFoundException(nameof(Lecture), request.LectureId);
        }
        var allData = lectureCommentRepository.GetAllAsQueryable();

        var pageIndex = request.PaginationRequest.PageIndex;
        var pageSize = request.PaginationRequest.PageSize;

        var totalCount = allData.Count();
        var comments = allData.Where(c => c.LectureId.Equals(LectureId.Of(request.LectureId)))
                            .OrderByDescending(c => c.CreatedAt)
                            .Skip(pageSize * (pageIndex - 1))
                            .Take(pageSize)
                            .ToList();
        var commentDto = comments.Select(c => new LectureCommentDto(c.Id.Value, c.UserId.Value, c.Content, c.LastModified)).ToList();

        return new GetLectureCommentResult(
          new PaginatedResult<LectureCommentDto>(pageIndex, pageSize, totalCount, commentDto));
    }
}

