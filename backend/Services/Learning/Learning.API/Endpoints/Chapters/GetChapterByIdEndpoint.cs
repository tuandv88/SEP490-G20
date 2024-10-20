using Learning.Application.Models.Chapters.Queries.GetChapterById;
using Learning.Application.Models.Courses.Queries.GetCourseById;

namespace Learning.API.Endpoints.Chapters {
    public class GetChapterByIdEndpoint : ICarterModule {
        public void AddRoutes(IEndpointRouteBuilder app) {
            app.MapGet("/courses/{CourseId}/chapters/{ChapterId}", async (Guid CourseId, Guid ChapterId, ISender sender) => {
                var result = await sender.Send(new GetChapterByIdQuery(CourseId, ChapterId));

                var response = result.Adapt<GetCourseByIdResponse>();

                return Results.Ok(result);

            })
            .WithName("GetChapterById")
            .Produces<GetCourseResponse>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status400BadRequest)
            .ProducesProblem(StatusCodes.Status404NotFound)
            .WithSummary("Get chapter by Id");
        }
    }
}
