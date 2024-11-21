namespace Learning.Application.Data.Repositories;
public interface IQuestionRepository : IRepository<Question> {
    Task<int> CountByQuizAsync(QuizId quizId);
    Task<Question?> GetByIdAndQuizId(QuizId quizId, QuestionId questionId);
}

