using Amazon.Auth.AccessControlPolicy;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using System.Reflection;
using System.Security.Claims;

namespace Learning.Application.Commons;
public class AuthorizationBehaviour<TRequest, TResponse>(IHttpContextAccessor _httpContextAccessor, IIdentityService identityService)
 : IPipelineBehavior<TRequest, TResponse> where TRequest : notnull {
    public async Task<TResponse> Handle(TRequest request, RequestHandlerDelegate<TResponse> next, CancellationToken cancellationToken) {


        var authorizeAttributes = request.GetType().GetCustomAttributes<AuthorizeAttribute>();

        if (authorizeAttributes.Any()) {
            var userClaims = _httpContextAccessor.HttpContext?.User.Claims;
            if (userClaims == null || !userClaims.Any()) {
                throw new UnauthorizedAccessException();
            }

            var authorizeAttributesWithPolicies = authorizeAttributes.Where(a => !string.IsNullOrWhiteSpace(a.Policy));
            if (authorizeAttributesWithPolicies.Any()) {
                var policies = authorizeAttributesWithPolicies.Select(a => a.Policy!.Split(',')).SelectMany(policy => policy).ToArray();
                identityService.AuthorizePolicyAsync(policies);
            }
        }
        return await next();
    }
}


