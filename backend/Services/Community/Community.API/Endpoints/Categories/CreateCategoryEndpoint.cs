using Community.Application.Models.Categories.Commands.CreateCategory;

namespace Community.API.Endpoints.Categories
{
    public class CreateCategoryEndpoint : ICarterModule
    {
        public void AddRoutes(IEndpointRouteBuilder app)
        {
            app.MapPost("/categories", async (CreateCategoryDto createCategoryDto, ISender sender) =>
            {
                var command = new CreateCategoryCommand(createCategoryDto);

                var result = await sender.Send(command);

                if (result.IsSuccess)
                {
                    return Results.Ok(new { Message = result.Message, CategoryId = result.Id });
                }
                else
                {
                    return Results.BadRequest(new { Message = result.Message });
                }
            })
            .WithName("CreateCategory")
            .Produces(StatusCodes.Status201Created)
            .ProducesProblem(StatusCodes.Status400BadRequest)
            .WithSummary("Create a new category.");
        }
    }
}
