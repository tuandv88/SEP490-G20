using Carter;
using Mapster;
using MediatR;

namespace Payment.API.Endpoints;
public record CreateOrderRequest();
public class CreateOrderEndpoint : ICarterModule {
    public void AddRoutes(IEndpointRouteBuilder app) {

        //app.MapPost("/orders", async (CreateOrderRequest request, ISender sender) => {
        //    var command = request.Adapt<CreateCourseCommand>();

        //    var result = await sender.Send(command);

        //    var response = result.Adapt<CreateCourseResponse>();

        //    return Results.Created($"/courses/{response.Id}", response);
        //})
        //.WithName("CreateCourse")
        //.Produces<CreateCourseResponse>(StatusCodes.Status201Created)
        //.ProducesProblem(StatusCodes.Status400BadRequest)
        //.WithSummary("Create course");
    }
}


