using Community.Application.Models.Categories.Commands.UpdateCategory;

namespace Community.API.Endpoints.Categories
{
    public class UpdateCategoryEndpoint : ICarterModule
    {
        public void AddRoutes(IEndpointRouteBuilder app)
        {
            app.MapPut("/categories", async (UpdateCategoryDto updateCategoryDto, ISender sender) =>
            {
                var command = new UpdateCategoryCommand(updateCategoryDto);
                var result = await sender.Send(command);

                if (result.IsSuccess)
                {
                    return Results.Ok(new { Message = result.Message });
                }
                else
                {
                    return Results.BadRequest(new { Message = result.Message });
                }
            })
            .WithName("UpdateCategory")
            .Produces(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status400BadRequest)
            .WithSummary("Update an existing category by its ID.");
        }
    }
}
