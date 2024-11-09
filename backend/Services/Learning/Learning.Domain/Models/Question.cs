namespace Learning.Domain.Models;
public class Question : Aggregate<QuestionId> {
    public QuizId QuizId { get; set; } = default!;
    public List<QuestionOption> QuestionOptions = new();
    public ProblemId? ProblemId { get; set; } = default!;
    public bool IsActive { get; set; }
    public string Content { get; set; } = default!;
    public QuestionType QuestionType = QuestionType.MultipleChoice;
    public QuestionLevel QuestionLevel { get; set; } = QuestionLevel.EASY;
    public int Mark { get; set; } = 1;
    public int OrderIndex { get; set; }

    public static Question Create(QuestionId questionId, QuizId quizId, ProblemId? problemId, bool isActive, string content, QuestionType questionType, QuestionLevel questionLevel, int mark, int orderIndex) {
        return new Question() {
            Id = questionId,
            QuizId = quizId,
            ProblemId = problemId,
            IsActive = isActive,
            Content = content,
            QuestionType = questionType,
            QuestionLevel = questionLevel,
            Mark = mark,
            OrderIndex = orderIndex
        };
    }
    public void AddQuestionOption(QuestionOption questionOption) {
        QuestionOptions.Add(questionOption);
    }
    public void AddQuestionOption(List<QuestionOption> questionOptions) {
        QuestionOptions.AddRange(questionOptions);
    }
}

