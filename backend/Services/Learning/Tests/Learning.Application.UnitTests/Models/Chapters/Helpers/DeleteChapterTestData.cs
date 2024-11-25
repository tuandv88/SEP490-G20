using Learning.Application.Models.Chapters.Commands.DeleteChapter;

namespace Learning.Application.UnitTests.Models.Chapters.Helpers
{
    public static class DeleteChapterTestData
    {
        public static DeleteChapterCommand GetValidDeleteChapterCommand()
        {
            return new DeleteChapterCommand(
                CourseId: Guid.NewGuid(),
                ChapterId: Guid.NewGuid()
            );
        }

        public static DeleteChapterCommand GetInvalidDeleteChapterCommand_InvalidCourse()
        {
            return new DeleteChapterCommand(
                CourseId: Guid.NewGuid(),
                ChapterId: Guid.NewGuid()
            );
        }

        public static DeleteChapterCommand GetInvalidDeleteChapterCommand_InvalidChapter()
        {
            var courseId = Guid.NewGuid();
            return new DeleteChapterCommand(
                CourseId: courseId,
                ChapterId: Guid.NewGuid() // Không có chapter khớp trong course
            );
        }
    }
}
