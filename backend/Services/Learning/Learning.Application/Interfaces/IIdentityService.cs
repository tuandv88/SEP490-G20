namespace Learning.Application.Interfaces;
public interface IIdentityService {
    bool AuthorizePolicyAsync(params string[] policy);
}

