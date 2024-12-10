using Learning.Application.Models.Chapters.Commands.CreateChapter;
using Learning.Application.Models.Chapters.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Learning.Application.UnitTests.Models.Chapters.Helpers
{
    public static class CreateChapterTestData
    {
        public static CreateChapterCommand GetValidCreateChapterCommand()
        {
            return new CreateChapterCommand
            {
                CourseId = Guid.NewGuid(),
                CreateChapterDto = new CreateChapterDto(
                    Title: "Valid Title",
                    Description: "Valid Description",
                    IsActive: true // Giá trị mặc định
                )
            };
        }

        public static CreateChapterCommand GetInvalidCreateChapterCommand_NullTitle()
        {
            return new CreateChapterCommand
            {
                CourseId = Guid.NewGuid(),
                CreateChapterDto = new CreateChapterDto(
                    Title: null, // Null title
                    Description: "Valid Description",
                    IsActive: true
                )
            };
        }

        public static CreateChapterCommand GetInvalidCreateChapterCommand_EmptyTitle()
        {
            return new CreateChapterCommand
            {
                CourseId = Guid.NewGuid(),
                CreateChapterDto = new CreateChapterDto(
                    Title: "", // Empty title
                    Description: "Valid Description",
                    IsActive: true
                )
            };
        }

        public static CreateChapterCommand GetInvalidCreateChapterCommand_NullDescription()
        {
            return new CreateChapterCommand
            {
                CourseId = Guid.NewGuid(),
                CreateChapterDto = new CreateChapterDto(
                    Title: "Valid Title",
                    Description: null, // Null description
                    IsActive: true
                )
            };
        }
    }


}
