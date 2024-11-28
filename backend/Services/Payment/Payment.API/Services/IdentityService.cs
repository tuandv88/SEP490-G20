using Payment.Application.Commons;
using Payment.Application.Interfaces;

namespace Payment.API.Services;
public class IdentityService(IUserContextService userContext) : IIdentityService {
    public bool AuthorizePolicyAsync(params string[] policies) {
        var userRole = userContext.User.Role;
        foreach (var policy in policies) {
            if (CheckRolePolicy(userRole, policy)) {
                return true;
            }
        }
        foreach (var policy in policies) {
            if (CheckCustomPolicy(userRole, policy)) {
                return true;
            }
        }
        return false;
    }
    private bool CheckRolePolicy(string userRole, string policy) {
        var allowedRoles = PoliciesType.ToListRole();
        if (allowedRoles.Contains(policy) && userRole == policy) {
            return true;
        }
        return false;
    }

    private bool CheckCustomPolicy(string userRole, string policy) {

        return false;
    }
}



