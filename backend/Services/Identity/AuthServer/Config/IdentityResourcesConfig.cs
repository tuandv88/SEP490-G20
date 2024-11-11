using IdentityServer4.Models;

namespace AuthServer.Config
{
    public class IdentityResourcesConfig
    {
        public static IEnumerable<IdentityResource> GetIdentityResources =>
         new List<IdentityResource>
         {
              // user quản lý nhứng gì này ~ chuẩn của identity ít nhất phải có 2 thằng này
                new IdentityResources.OpenId(),
                new IdentityResources.Profile(),
                new IdentityResources.Email(),
                new IdentityResource(
                    "roles",
                    "Your role(s) Application",
                    new List<string>() { "role"})
             //vd:
             // new IdentityResources.Email(),
             // new IdentityResources.Phone()
         };

    }
}
