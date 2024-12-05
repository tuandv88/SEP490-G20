using BuildingBlocks.CQRS;
using MediatR;
using Microsoft.AspNetCore.Http;

namespace Payment.Application.Integrations.Paypals.Commands.ApproveOrder;
public record ApproveOrderCommand(IHeaderDictionary Headers, string Body) : ICommand<Unit>;

