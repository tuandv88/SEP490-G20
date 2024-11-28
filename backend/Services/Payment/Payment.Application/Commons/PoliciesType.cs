namespace Payment.Application.Commons;
public static class PoliciesType {
    //Role
    public const string Administrator = "admin";
    public const string Moderator = "moderator";
    public const string Learner = "learner";

    public static List<string> ToListRole() {
        return new List<string>{
            Administrator,
            Moderator,
            Learner
        };
    }
}


