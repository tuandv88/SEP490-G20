using IdentityServer4.Models;

namespace AuthServer.Config
{
    public class IdentityResourcesConfig
    {
        public static IEnumerable<IdentityResource> GetIdentityResources =>
         new IdentityResource[]
         {
              // user quản lý nhứng gì này ~ chuẩn của identity ít nhất phải có 2 thằng này
                new IdentityResources.OpenId(),
                new IdentityResources.Profile(),
                new IdentityResources.Email()
             //vd:
             // new IdentityResources.Email(),
             // new IdentityResources.Phone()
         };

    }
}
