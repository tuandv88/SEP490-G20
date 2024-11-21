namespace User.Infrastructure.Constants
{
    public static class CacheKey
    {
        public const string POINT_HISTORY = "PointHistory_{0}";
        public const string POINT_HISTORY_BY_USER_ID = "PointHistoryByUserId_{0}";

        public const string PATH_STEPS = "PathSteps";
        public const string PATH_STEP = "PathStep_{0}";
        public const string PATH_STEPS_BY_LEARNING_PATH_ID = "PathStepsByLearningPathId_{0}";

        public const string LEARNING_PATHS = "LearningPaths";
        public const string LEARNING_PATH = "LearningPath_{0}";
        public const string LEARNING_PATHS_BY_USER_ID = "LearningPathsByUserId_{0}";

        public const string USER_GOALS = "UserGoals";
        public const string USER_GOAL = "UserGoal_{0}";
        public const string USER_GOALS_BY_USER_ID = "UserGoalsByUserId_{0}";
    }
}
