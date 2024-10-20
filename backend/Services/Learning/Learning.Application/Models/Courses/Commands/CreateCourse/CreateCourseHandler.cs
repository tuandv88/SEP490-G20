using Learning.Application.Data.Repositories;
using Learning.Application.Models.Courses.Dtos;
using Learning.Domain.Enums;
using Learning.Domain.ValueObjects;

namespace Learning.Application.Models.Courses.Commands.CreateCourse;
public class CreateCourseHandler(ICourseRepository repository) : ICommandHandler<CreateCourseCommand, CreateCourseResult>
{
    public async Task<CreateCourseResult> Handle(CreateCourseCommand request, CancellationToken cancellationToken)
    {

        var course = CreateNewCourse(request.CreateCourseDto);
        await repository.AddAsync(course);
        await repository.SaveChangesAsync(cancellationToken);

        return new CreateCourseResult(course.Id.Value);
    }

    private Course CreateNewCourse(CreateCourseDto createCourseDto)
    {
        var courseStatus = Enum.TryParse<CourseStatus>(createCourseDto.CourseStatus, out var status)
            ? status
            : throw new ArgumentOutOfRangeException(nameof(createCourseDto.CourseStatus), $"Value '{createCourseDto.CourseStatus}' is not valid for CourseStatus.");

        var courseLevel = Enum.TryParse<CourseLevel>(createCourseDto.CourseLevel, out var level)
            ? level
            : throw new ArgumentOutOfRangeException(nameof(createCourseDto.CourseLevel), $"Value '{createCourseDto.CourseLevel}' is not valid for CourseLevel.");

        DateTime? scheduledPublishDate = null;
        if (!string.IsNullOrWhiteSpace(createCourseDto.ScheduledPublishDate))
        {
            if (DateTime.TryParse(createCourseDto.ScheduledPublishDate, out var publishDate))
            {
                scheduledPublishDate = publishDate.ToUniversalTime();
            }
            else
            {
                throw new FormatException($"ScheduledPublishDate '{createCourseDto.ScheduledPublishDate}' is not in a valid DateTime format.");
            }
        }
        return Course.Create(
            courseId: CourseId.Of(Guid.NewGuid()),
            title: createCourseDto.Title,
            description: createCourseDto.Description,
            headline: createCourseDto.Headline,
            courseStatus: courseStatus,
            timeEstimation: createCourseDto.TimeEstimation,
            prerequisites: createCourseDto.Prerequisites,
            objectives: createCourseDto.Objectives,
            targetAudiences: createCourseDto.TargetAudiences,
            scheduledPublishDate: scheduledPublishDate,
            imageUrl: createCourseDto.ImageUrl,
            orderIndex: createCourseDto.OrderIndex,
            courseLevel: courseLevel,
            price: createCourseDto.Price
        );
    }
}

