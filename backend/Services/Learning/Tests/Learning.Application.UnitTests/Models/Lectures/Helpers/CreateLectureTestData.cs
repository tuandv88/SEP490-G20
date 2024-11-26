using Learning.Application.Models.Lectures.Commands.CreateLecture;
using Learning.Application.Models.Lectures.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Learning.Application.UnitTests.Models.Lectures.Helpers
{
    public static class CreateLectureTestData
    {
        public static CreateLectureCommand GetValidCreateLectureCommand()
        {
            return new CreateLectureCommand
            {
                ChapterId = Guid.NewGuid(),
                CreateLectureDto = new CreateLectureDto(
                    Title: "Valid Lecture",
                    Summary: "This is a valid lecture summary.",
                    TimeEstimation: 30,
                    LectureType: "Lesson",
                    Point: 10,
                    IsFree: true
                )
            };
        }

        public static CreateLectureCommand GetInvalidLectureTypeCommand()
        {
            return new CreateLectureCommand
            {
                ChapterId = Guid.NewGuid(),
                CreateLectureDto = new CreateLectureDto(
                    Title: "Invalid Lecture",
                    Summary: "This lecture has an invalid type.",
                    TimeEstimation: 30,
                    LectureType: "InvalidType",
                    Point: 10,
                    IsFree: true
                )
            };
        }

        public static Chapter GetValidChapter()
        {
            return new Chapter
            {
                Id = ChapterId.Of(Guid.NewGuid()),
                Title = "Valid Chapter",
                Lectures = new List<Lecture>()
            };
        }


        public static CreateLectureCommand GetCreateLectureCommandWithNullTitle()
        {
            return new CreateLectureCommand
            {
                ChapterId = Guid.NewGuid(),
                CreateLectureDto = new CreateLectureDto(
                    Title: null, // Title bị null
                    Summary: "Valid Summary",
                    TimeEstimation: 30,
                    LectureType: "Lesson",
                    Point: 10,
                    IsFree: true
                )
            };
        }

        public static CreateLectureCommand GetCreateLectureCommandWithZeroTimeEstimation()
        {
            return new CreateLectureCommand
            {
                ChapterId = Guid.NewGuid(),
                CreateLectureDto = new CreateLectureDto(
                    Title: "Valid Title",
                    Summary: "Valid Summary",
                    TimeEstimation: 0, // TimeEstimation bằng 0
                    LectureType: "Lesson",
                    Point: 10,
                    IsFree: true
                )
            };
        }
    }
}
