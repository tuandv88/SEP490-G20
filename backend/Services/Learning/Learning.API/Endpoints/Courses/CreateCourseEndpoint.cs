namespace Learning.API.Endpoints.Courses;
//public record CreateCourseRequest();
//public record CreateCourseResponse();
//public class CreateCourseEndpoint : ICarterModule {
//    public void AddRoutes(IEndpointRouteBuilder app) {

//        app.MapPost("/course", async (CreateCourseRequest request, ISender sender) => {
//            var command = request.Adapt<CreateSubmissionCommand>();

//            var result = await sender.Send(command);

//            var response = result.Adapt<CreateCourseResponse>();

//            return Results.Created($"/api/v1/course/{response}", response);
//        })
//        .WithName("CreateCourse")
//        .Produces<CreateCourseResponse>(StatusCodes.Status201Created)
//        .ProducesProblem(StatusCodes.Status400BadRequest)
//        .WithSummary("Create course");
//    }
//}

