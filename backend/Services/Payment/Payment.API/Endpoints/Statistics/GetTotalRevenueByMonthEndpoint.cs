using Payment.Application.Transactions.Dtos;
using Payment.Application.Transactions.Queries.Statistics.GetTotalRevenueByMonth;

namespace Payment.API.Endpoints.Statistics;

public record GetTotalRevenueByMonthRequest(DateTime StartDate, DateTime EndDate);
public record GetTotalRevenueByMonthResponse(List<RevenueByMonthDto> Revenues);
public class GetTotalRevenueByMonthEndpoint: ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGet("/revenue/monthly", async ([AsParameters] GetTotalRevenueByMonthRequest request,ISender sender) =>
            {
                var result = await sender.Send(new GetTotalRevenueByMonthQuery(request.StartDate, request.EndDate));

                var response = result.Adapt<GetTotalRevenueByMonthResponse>();

                return Results.Ok(response);
            })
            .WithName("GetTotalRevenueByMonth")
            .Produces<GetTotalRevenueByMonthResponse>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status400BadRequest)
            .ProducesProblem(StatusCodes.Status404NotFound)
            .WithSummary("Get Total Revenue By Month");
    }
}