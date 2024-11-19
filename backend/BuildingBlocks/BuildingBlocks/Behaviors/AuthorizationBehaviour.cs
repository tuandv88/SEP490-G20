using BuildingBlocks.Exceptions;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using System.Reflection;
using System.Security.Claims;
namespace BuildingBlocks.Behaviors;
public class AuthorizationBehaviour<TRequest, TResponse>(IHttpContextAccessor _httpContextAccessor)
    : IPipelineBehavior<TRequest, TResponse> where TRequest : notnull {
    public async Task<TResponse> Handle(TRequest request, RequestHandlerDelegate<TResponse> next, CancellationToken cancellationToken) {


        var authorizeAttributes = request.GetType().GetCustomAttributes<AuthorizeAttribute>();

        if (authorizeAttributes.Any()) {
            var userClaims = _httpContextAccessor.HttpContext?.User.Claims;
            if (userClaims == null || !userClaims.Any()) {
                throw new UnauthorizedAccessException();
            }
            // check role qua claims
            var authorizeAttributesWithRoles = authorizeAttributes.Where(a => !string.IsNullOrWhiteSpace(a.Roles));
            if (authorizeAttributesWithRoles.Any()) {
                var roles = authorizeAttributesWithRoles.Select(a => a.Roles.Split(',')).SelectMany(role => role).ToList();
                var userRoles = userClaims.Where(c => c.Type == ClaimTypes.Role).Select(c => c.Value).ToList();

                if (!userRoles.Intersect(roles).Any()) {
                    throw new ForbiddenAccessException();
                }
            }
            // check policy (khả năng không cần)
            //var authorizeAttributesWithPolicies = authorizeAttributes.Where(a => !string.IsNullOrWhiteSpace(a.Policy));
            //if (authorizeAttributesWithPolicies.Any()) {

            //    foreach (var policy in authorizeAttributesWithPolicies.Select(a => a.Policy)) {
            //        // Check policy
            //    }
            //}
        }
        return await next();
    }
}