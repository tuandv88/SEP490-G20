namespace Community.Application.Interfaces;

public interface IIdentityService
{
    bool AuthorizePolicyAsync(params string[] policy);
}
