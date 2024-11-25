using Learning.Application.Models.Chapters.Commands.UpdateChapter;
using Learning.Application.Models.Chapters.Dtos;
using System;

namespace Learning.Application.UnitTests.Models.Chapters.Helpers
{
    public static class UpdateChapterTestData
    {
        public static UpdateChapterCommand GetValidUpdateChapterCommand()
        {
            return new UpdateChapterCommand(
                ChapterId: Guid.NewGuid(),
                CourseId: Guid.NewGuid(),
                UpdateChapterDto: new UpdateChapterDto(
                    Title: "Valid Title",
                    Description: "Valid Description",
                    TimeEstimation: 20,
                    IsActive: true
                )
            );
        }

        public static UpdateChapterCommand GetInvalidUpdateChapterCommand_NullTitle()
        {
            return new UpdateChapterCommand(
                ChapterId: Guid.NewGuid(),
                CourseId: Guid.NewGuid(),
                UpdateChapterDto: new UpdateChapterDto(
                    Title: null, // Null title
                    Description: "Valid Description",
                    TimeEstimation: 10,
                    IsActive: true
                )
            );
        }

        public static UpdateChapterCommand GetInvalidUpdateChapterCommand_EmptyTitle()
        {
            return new UpdateChapterCommand(
                ChapterId: Guid.NewGuid(),
                CourseId: Guid.NewGuid(),
                UpdateChapterDto: new UpdateChapterDto(
                    Title: "", // Empty title
                    Description: "Valid Description",
                    TimeEstimation: 10,
                    IsActive: true
                )
            );
        }

        public static UpdateChapterCommand GetInvalidUpdateChapterCommand_NegativeTimeEstimation()
        {
            return new UpdateChapterCommand(
                ChapterId: Guid.NewGuid(),
                CourseId: Guid.NewGuid(),
                UpdateChapterDto: new UpdateChapterDto(
                    Title: "Valid Title",
                    Description: "Valid Description",
                    TimeEstimation: -5, // Negative time estimation
                    IsActive: true
                )
            );
        }

        public static UpdateChapterCommand GetInvalidUpdateChapterCommand_NullDescription()
        {
            return new UpdateChapterCommand(
                ChapterId: Guid.NewGuid(),
                CourseId: Guid.NewGuid(),
                UpdateChapterDto: new UpdateChapterDto(
                    Title: "Valid Title",
                    Description: null, // Null description
                    TimeEstimation: 15,
                    IsActive: true
                )
            );
        }
    }
}
