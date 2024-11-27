using Community.Application.Interfaces;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;

namespace Community.Application.Commons;

public class AuthorizationBehavior<TRequest, TResponse>(IHttpContextAccessor _httpContextAccessor, IIdentityService identityService)
 : IPipelineBehavior<TRequest, TResponse> where TRequest : notnull
{
    public async Task<TResponse> Handle(TRequest request, RequestHandlerDelegate<TResponse> next, CancellationToken cancellationToken)
    {
        var httpContext = _httpContextAccessor.HttpContext;
        if (httpContext == null)
        {
            return await next();
        }

        var authorizeAttributes = request.GetType().GetCustomAttributes<AuthorizeAttribute>();

        if (authorizeAttributes.Any())
        {
            var userClaims = _httpContextAccessor.HttpContext?.User.Claims;
            if (userClaims == null || !userClaims.Any())
            {
                throw new UnauthorizedAccessException();
            }

            var authorizeAttributesWithPolicies = authorizeAttributes.Where(a => !string.IsNullOrWhiteSpace(a.Policy));
            if (authorizeAttributesWithPolicies.Any())
            {
                var policies = authorizeAttributesWithPolicies.Select(a => a.Policy!.Split(',')).SelectMany(policy => policy).ToArray();
                if (policies.Any() && !identityService.AuthorizePolicyAsync(policies))
                {
                    throw new UnauthorizedAccessException("User does not meet policy requirements.");
                }
            }
        }
        return await next();
    }
}

