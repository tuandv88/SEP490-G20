using Learning.Application.Commons;
using Learning.Application.Data;
using Learning.Application.Interfaces;

namespace Learning.API.Services;
public class IdentityService(IUserContextService userContext, IApplicationDbContext dbContext) : IIdentityService {
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
        if (policy == PoliciesType.CourseParticipation) {
            return CheckCourseParticipation(userRole);
        }

        return false;
    }
    private bool CheckCourseParticipation(string userRole) {

        return true;
    }
}

