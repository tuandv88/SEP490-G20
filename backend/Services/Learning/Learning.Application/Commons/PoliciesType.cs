namespace Learning.Application.Commons;
public static class PoliciesType {
    //Role
    public const string Administrator = "admin";
    public const string Moderator = "moderator";
    public const string Learner = "learner";

    //Policies custom
    public const string CourseParticipation = "course_participation";

    public static List<string> ToListRole() {
        return new List<string>{
            Administrator,
            Moderator,
            Learner
        };
    }
}

