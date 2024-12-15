
using Learning.Application.Models.Quizs.Dtos;

namespace Learning.Application.Models.Quizs.Commands.UpdateQuiz;
public class UpdateQuizHandler(IQuizRepository repository) : ICommandHandler<UpdateQuizCommand, UpdateQuizResult> {
    public async Task<UpdateQuizResult> Handle(UpdateQuizCommand request, CancellationToken cancellationToken) {

        var quiz = await repository.GetByIdAsync(request.QuizId);
        if (quiz == null) {
            throw new NotFoundException(nameof(Quiz), request.QuizId);
        }
        UpdateQuiz(quiz, request.Quiz);
        await repository.UpdateAsync(quiz);
        await repository.SaveChangesAsync(cancellationToken);

        return new UpdateQuizResult(true);
    }

    public void UpdateQuiz(Quiz quiz, UpdateQuizDto quizDto) {
        quiz.Update(
            isActive: quizDto.IsActive,
            isRandomized: quizDto.IsRandomized,
            title: quizDto.Title,
            description: quizDto.Description,
            passingMark: quizDto.PassingMark,
            timeLimit: quizDto.TimeLimit,
            hasTimeLimit: quizDto.HasTimeLimit,
            attemptLimit: quizDto.AttemptLimit,
            hasAttemptLimit: quizDto.HasAttemptLimit,
            quizType: (QuizType)Enum.Parse(typeof(QuizType), quizDto.QuizType)
            );

    }
}

