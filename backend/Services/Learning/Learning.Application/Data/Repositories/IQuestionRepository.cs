namespace Learning.Application.Data.Repositories;
public interface IQuestionRepository : IRepository<Question> {
    Task<int> CountByQuizAsync(QuizId quizId);
}

