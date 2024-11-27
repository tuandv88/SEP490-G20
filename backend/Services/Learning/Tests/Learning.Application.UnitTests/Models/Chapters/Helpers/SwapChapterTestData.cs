using Learning.Application.Models.Chapters.Commands.SwapChapter;

namespace Learning.Application.UnitTests.Models.Chapters.Commands.SwapChapter
{
    public static class SwapChapterTestData
    {
        public static SwapChapterCommand GetValidSwapChapterCommand()
        {
            return new SwapChapterCommand(Guid.NewGuid(), Guid.NewGuid());
        }

        public static Course GetValidCourse()
        {
            return new Course
            {
                Id = CourseId.Of(Guid.NewGuid()),
            };
        }

        public static (Chapter chapter1, Chapter chapter2) GetValidChapters(Guid courseId)
        {
            var chapter1 = new Chapter
            {
                Id = ChapterId.Of(Guid.NewGuid()),
                CourseId = CourseId.Of(courseId),
                OrderIndex = 1
            };

            var chapter2 = new Chapter
            {
                Id = ChapterId.Of(Guid.NewGuid()),
                CourseId = CourseId.Of(courseId),
                OrderIndex = 2
            };

            return (chapter1, chapter2);
        }

        public static Chapter GetChapter(Guid chapterId, Guid? courseId = null, int orderIndex = 1)
        {
            return new Chapter
            {
                Id = ChapterId.Of(chapterId),
                CourseId = CourseId.Of(courseId ?? Guid.NewGuid()),
                OrderIndex = orderIndex
            };
        }
    }
}
