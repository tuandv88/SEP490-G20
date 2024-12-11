using BuildingBlocks.CQRS;
using Microsoft.AspNetCore.Authorization;

namespace Payment.Application.Transactions.Queries.GetItemPaymentEligibility;

[Authorize]
public record GetItemPaymentEligibilityQuery(string ProductId) : IQuery<GetItemPaymentEligibilityResult>;
public record GetItemPaymentEligibilityResult(bool IsAccepted);