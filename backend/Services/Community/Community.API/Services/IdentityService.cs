using Community.Application.Commons;
using Community.Application.Interfaces;

namespace Community.API.Services;

public class IdentityService(IUserContextService userContext, IApplicationDbContext dbContext) : IIdentityService
{
    public bool AuthorizePolicyAsync(params string[] policies)
    {
        var userRole = userContext.User.Role;
        foreach (var policy in policies)
        {
            if (CheckRolePolicy(userRole, policy))
            {
                return true;
            }
        }
        return false;
    }
    private bool CheckRolePolicy(string userRole, string policy)
    {
        var allowedRoles = PoliciesType.ToListRole();
        if (allowedRoles.Contains(policy) && userRole == policy)
        {
            return true;
        }
        return false;
    }

}
