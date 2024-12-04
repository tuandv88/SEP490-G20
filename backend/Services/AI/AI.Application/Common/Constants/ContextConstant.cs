namespace AI.Application.Common.Constants;
public static class ContextConstant {
    public static class User {
        public const string FullName = "full_name";
    }
    public static class Learning {
        public const string LectureId = "lecture_id";
        public const string ProblemId = "problem_id";
    }
    public static class Community {
        public const string ConnectionId = "connection_id";
    }
    public static class Rag {

        public const string EmptyAnswer = "custom_rag_empty_answer_str";

        public const string Prompt = "custom_rag_prompt_str";

        public const string FactTemplate = "custom_rag_fact_template_str";

        public const string MaxTokens = "custom_rag_max_tokens_int";

        public const string Temperature = "custom_rag_temperature_float";

        public const string NucleusSampling = "custom_rag_nucleus_sampling_float";
    }
    public static class Pathway {
        public const string Answer = "answers";
    }
    public static class ContentModeration {
        public const string Discussion = "discussion";
        public const string ImageUrl = "image";
    }
}


