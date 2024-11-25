using Learning.Application.Models.Files.Commands.DeleteFile;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Learning.Application.UnitTests.Models.Files.Helpers
{
    public static class DeleteFileTestData
    {
        public static DeleteFileCommand GetValidDeleteFileCommand()
        {
            return new DeleteFileCommand(
                LectureId: Guid.NewGuid(),
                FileId: Guid.NewGuid()
            );
        }

        public static Lecture GetLectureWithFile(Guid lectureId, Guid fileId)
        {
            return new Lecture
            {
                Id = LectureId.Of(lectureId),
                Title = "Sample Lecture",
                Files = new List<Domain.Models.File>
        {
            new Domain.Models.File
            {
                Id = FileId.Of(fileId), // FileId khớp với command
                Url = "https://storage.bucket/sample-file.pdf", // Đường dẫn URL
                FileName = "sample-file.pdf"
            }
        }
            };
        }

        public static Lecture GetLectureWithoutFile(Guid lectureId)
        {
            return new Lecture
            {
                Id = LectureId.Of(lectureId),
                Title = "Sample Lecture",
                Files = new List<Domain.Models.File>() // Không có file nào
            };
        }
    }

}
