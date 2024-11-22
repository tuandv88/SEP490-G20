namespace Learning.Application.Models.Courses.Commands.CreateEnrollmentCourse;
public class EnrollmentCourseHandler(IUserCourseRepository userCourseRepository, ICourseRepository courseRepository, IUserContextService userContext) : ICommandHandler<CreateEnrollmentCourseCommand, CreateEnrollmentCourseResult>
{
    public async Task<CreateEnrollmentCourseResult> Handle(CreateEnrollmentCourseCommand request, CancellationToken cancellationToken)
    {
        var userId = userContext.User.Id;
        var course = await courseRepository.GetByIdAsync(request.CourseId);
        if (course == null)
        {
            throw new NotFoundException(nameof(Course), request.CourseId);
        }
        var userCourse = await userCourseRepository.GetByUserIdAndCourseIdAsync(userId, course.Id.Value);
        if (userCourse != null)
        {
            return new CreateEnrollmentCourseResult(true);
        }
        //Khóa học phải free và phải được published
        if (course.Price != 0 || course.CourseStatus != CourseStatus.Published)
        {
            return new CreateEnrollmentCourseResult(false);
        }

        var newUserCourse = UserCourse.Create(
                UserCourseId.Of(Guid.NewGuid()),
                UserId.Of(userId),
                course.Id,
                DateTime.UtcNow
                );

        course.AddUserCourse(newUserCourse);
        await userCourseRepository.AddAsync(newUserCourse);
        await userCourseRepository.SaveChangesAsync(cancellationToken);

        return new CreateEnrollmentCourseResult(true);
    }

}

