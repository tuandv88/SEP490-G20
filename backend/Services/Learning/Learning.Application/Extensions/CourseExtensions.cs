using Learning.Application.Models.Courses.Dtos;
using Learning.Domain.Enums;

namespace Learning.Application.Extensions;
public static class CourseExtensions {
    public static List<CourseDto> ToCourseDtoList(this List<Domain.Models.Course> courses) {
        return courses.Select(c => new CourseDto(
            Id: c.Id.Value,
            Title: c.Title,
            Description: c.Description,
            Headline: c.Headline,
            CourseStatus: c.CourseStatus.ToString(),
            TimeEstimation: c.TimeEstimation,
            Prerequisites: c.Prerequisites,
            Objectives: c.Objectives,
            TargetAudiences: c.TargetAudiences,
            ScheduledPublishDate: c.ScheduledPublishDate,
            ImageUrl: c.ImageUrl,
            OrderIndex: c.OrderIndex,
            CourseLevel: c.CourseLevel.ToString(),
            Price: c.Price
            )).ToList();
    }

    public static CourseDto ToCourseDto(this Domain.Models.Course course) {
        return new CourseDto(
            Id: course.Id.Value,
            Title: course.Title,
            Description: course.Description,
            Headline: course.Headline,
            CourseStatus: course.CourseStatus.ToString(),
            TimeEstimation: course.TimeEstimation,
            Prerequisites: course.Prerequisites,
            Objectives: course.Objectives,
            TargetAudiences: course.TargetAudiences,
            ScheduledPublishDate: course.ScheduledPublishDate,
            ImageUrl: course.ImageUrl,
            OrderIndex: course.OrderIndex,
            CourseLevel: course.CourseLevel.ToString(),
            Price: course.Price
            );
    }
}

