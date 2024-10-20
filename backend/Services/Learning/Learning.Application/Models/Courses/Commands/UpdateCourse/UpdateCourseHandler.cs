using Learning.Application.Data.Repositories;
using Learning.Application.Models.Courses.Dtos;
using Learning.Domain.Enums;

namespace Learning.Application.Models.Courses.Commands.UpdateCourse;

public class UpdateCourseHandler(ICourseRepository repository) : ICommandHandler<UpdateCourseCommand, UpdateCourseResult>
{
    public async Task<UpdateCourseResult> Handle(UpdateCourseCommand request, CancellationToken cancellationToken)
    {

        var course = await repository.GetByIdAsync(request.UpdateCourseDto.Id);

        if (course == null)
        {
            throw new NotFoundException("Course", request.UpdateCourseDto.Id);

        }
        UpdateCourseWithNewValues(course, request.UpdateCourseDto);
        await repository.UpdateAsync(course);
        await repository.SaveChangesAsync(cancellationToken);

        return new UpdateCourseResult(true);
    }
    private void UpdateCourseWithNewValues(Course course, UpdateCourseDto updateCourseDto)
    {
        var courseStatus = Enum.TryParse<CourseStatus>(updateCourseDto.CourseStatus, out var status)
        ? status
        : throw new ArgumentOutOfRangeException(nameof(updateCourseDto.CourseStatus), $"Value '{updateCourseDto.CourseStatus}' is not valid for CourseStatus.");

        var courseLevel = Enum.TryParse<CourseLevel>(updateCourseDto.CourseLevel, out var level)
        ? level
        : throw new ArgumentOutOfRangeException(nameof(updateCourseDto.CourseLevel), $"Value '{updateCourseDto.CourseLevel}' is not valid for CourseLevel.");

        DateTime? scheduledPublishDate = null;
        if (!string.IsNullOrWhiteSpace(updateCourseDto.ScheduledPublishDate))
        {
            if (DateTime.TryParse(updateCourseDto.ScheduledPublishDate, out var publishDate))
            {
                scheduledPublishDate = publishDate.ToUniversalTime();
            }
            else
            {
                throw new FormatException($"ScheduledPublishDate '{updateCourseDto.ScheduledPublishDate}' is not in a valid DateTime format.");
            }
        }
        course.Update(
            title: updateCourseDto.Title,
            description: updateCourseDto.Description,
            headline: updateCourseDto.Headline,
            courseStatus: courseStatus,
            timeEstimation: updateCourseDto.TimeEstimation,
            prerequisites: updateCourseDto.Prerequisites,
            objectives: updateCourseDto.Objectives,
            targetAudiences: updateCourseDto.TargetAudiences,
            scheduledPublishDate: scheduledPublishDate,
            imageUrl: updateCourseDto.ImageUrl,
            orderIndex: updateCourseDto.OrderIndex,
            courseLevel: courseLevel,
            price: updateCourseDto.Price
        );
    }
}

