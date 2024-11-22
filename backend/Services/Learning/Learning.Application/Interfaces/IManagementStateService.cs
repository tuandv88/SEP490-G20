namespace Learning.Application.Interfaces;
public interface IManagementStateService { 
    Task ChangeQuizSubmissionStatus(QuizSubmissionId Id, QuizSubmissionStatus status);
}

