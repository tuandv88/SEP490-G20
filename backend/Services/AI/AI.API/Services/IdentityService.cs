﻿using AI.Application.Common.Constants;
using AI.Application.Data;
using AI.Application.Interfaces;

namespace AI.API.Services;
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
        if (policy == PoliciesType.CourseParticipation) {
            return CheckCourseParticipation(userRole);
        }

        return false;
    }
    private bool CheckCourseParticipation(string userRole) {

        return true;
    }
}

