namespace Learning.Application.Interfaces;
public interface IQuizSubmissionStateService {
    Task ChangeStatus(QuizSubmissionId Id, QuizSubmissionStatus status);
}

