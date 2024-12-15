using Learning.Application.Models.Quizs.Dtos;

namespace Learning.Application.Models.Quizs.Commands.CreateQuiz;
public class CreateQuizHandler(IQuizRepository quizRepository, ILectureRepository lectureRepository) : ICommandHandler<CreateQuizCommand, CreateQuizResult> {
    public async Task<CreateQuizResult> Handle(CreateQuizCommand request, CancellationToken cancellationToken) {
        Lecture? lecture = null;
        if (request.LectureId.HasValue) {
            lecture = await lectureRepository.GetByIdAsync(request.LectureId.Value);
            if (lecture == null) {
                throw new NotFoundException("Lecture", request.LectureId.Value);
            }
            if (lecture.QuizId != null) {
                throw new ConflictException("Lecture has quiz.");
            }
            if (lecture.LectureType != LectureType.Quiz)
            {
                throw new ConflictException("LectureType must be quiz");
            }
        }

        var quiz = CreateNewQuiz(request.CreateQuizDto);
        if (lecture != null) {
            lecture.QuizId = quiz.Id;
            await lectureRepository.UpdateAsync(lecture);
        }
        await quizRepository.AddAsync(quiz);
        await quizRepository.SaveChangesAsync(cancellationToken);

        return new CreateQuizResult(quiz.Id.Value);
    }

    private Quiz CreateNewQuiz(CreateQuizDto createQuizDto) {
        var quiz = Quiz.Create(
                    quizId: QuizId.Of(Guid.NewGuid()),
                    isActive: createQuizDto.IsActive,
                    isRandomized: createQuizDto.IsRandomized,
                    title: createQuizDto.Title,
                    description: createQuizDto.Description,
                    passingMark: createQuizDto.PassingMark,
                    timeLimit: createQuizDto.TimeLimit,
                    hasTimeLimit: createQuizDto.HasTimeLimit,
                    attemptLimit: createQuizDto.AttemptLimit,
                    hasAttemptLimit: createQuizDto.HasAttemptLimit,
                    quizType: (QuizType)Enum.Parse(typeof(QuizType), createQuizDto.QuizType)
                    );
        return quiz;
    }
}

