using Learning.Application.Models.Files.Commands.CreateFile;
using Learning.Application.Models.Files.Dtos;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Learning.Application.UnitTests.Models.Files.Helpers
{
    public static class CreateFileTestData
    {
        public static CreateFileCommand GetValidCreateFileCommand()
        {
            return new CreateFileCommand(
                LectureId: Guid.NewGuid(),
                CreateFileDto: GetValidDocumentFileDto()
            );
        }

        public static CreateFileCommand GetInvalidFileTypeCommand()
        {
            return new CreateFileCommand(
                LectureId: Guid.NewGuid(),
                CreateFileDto: new CreateFileDto(
                    File: new Mock<IFormFile>().Object,
                    FileType: "INVALID_TYPE",
                    Duration: null
                )
            );
        }

        public static CreateFileCommand GetValidVideoFileCommand()
        {
            return new CreateFileCommand(
                LectureId: Guid.NewGuid(),
                CreateFileDto: GetValidVideoFileDto()
            );
        }

        public static CreateFileCommand GetValidVideoFileWithDurationCommand()
        {
            return new CreateFileCommand(
                LectureId: Guid.NewGuid(),
                CreateFileDto: new CreateFileDto(
                    File: new Mock<IFormFile>().Object,
                    FileType: "VIDEO",
                    Duration: "300"
                )
            );
        }

        public static Lecture GetValidLecture()
        {
            return new Lecture
            {
                Id = LectureId.Of(Guid.NewGuid()),
                Title = "Sample Lecture"
            };
        }

        private static CreateFileDto GetValidDocumentFileDto()
        {
            return new CreateFileDto(
                File: new Mock<IFormFile>().Object,
                FileType: "DOCUMENT",
                Duration: null
            );
        }

        private static CreateFileDto GetValidVideoFileDto()
        {
            return new CreateFileDto(
                File: new Mock<IFormFile>().Object,
                FileType: "VIDEO",
                Duration: "300"
            );
        }
    }
}
