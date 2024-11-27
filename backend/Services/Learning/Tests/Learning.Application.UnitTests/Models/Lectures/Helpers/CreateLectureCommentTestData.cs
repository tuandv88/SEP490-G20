using Learning.Application.Models.Lectures.Commands.CreateLectureComment;
using Learning.Application.Models.Lectures.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Learning.Application.UnitTests.Models.Lectures.Helpers
{
    public static class CreateLectureCommentTestData
    {
        // Tạo command hợp lệ với nội dung comment
        public static CreateLectureCommentCommand GetValidCreateLectureCommentCommand()
        {
            return new CreateLectureCommentCommand(
                CourseId: Guid.NewGuid(),
                LectureId: Guid.NewGuid(),
                Comment: new CreateLectureCommentDto("This is a valid comment.")
            );
        }

        // Tạo command với nội dung comment là null
        public static CreateLectureCommentCommand GetCommandWithNullContent()
        {
            return new CreateLectureCommentCommand(
                CourseId: Guid.NewGuid(),
                LectureId: Guid.NewGuid(),
                Comment: new CreateLectureCommentDto(null)
            );
        }

        // Tạo command với nội dung comment là chuỗi rỗng
        public static CreateLectureCommentCommand GetCommandWithEmptyContent()
        {
            return new CreateLectureCommentCommand(
                CourseId: Guid.NewGuid(),
                LectureId: Guid.NewGuid(),
                Comment: new CreateLectureCommentDto("")
            );
        }

        // Tạo Course có chứa Lecture với ID nhất định
        public static Course GetCourseWithLecture(Guid courseId, Guid lectureId)
        {
            return new Course
            {
                Id = CourseId.Of(courseId),
                Chapters = new List<Chapter>
                {
                    new Chapter
                    {
                        Lectures = new List<Lecture>
                        {
                            new Lecture
                            {
                                Id = LectureId.Of(lectureId)
                            }
                        }
                    }
                }
            };
        }

        // Tạo Course không có Lecture
        public static Course GetCourseWithoutLecture(Guid courseId)
        {
            return new Course
            {
                Id = CourseId.Of(courseId),
                Chapters = new List<Chapter>
                {
                    new Chapter
                    {
                        Lectures = new List<Lecture>() // Không có lecture nào
                    }
                }
            };
        }

        // Tạo UserCourse hợp lệ
        public static UserCourse GetValidUserCourse()
        {
            return new UserCourse
            {
                UserId = UserId.Of(Guid.NewGuid()),
                CourseId = CourseId.Of(Guid.NewGuid())
            };
        }

        // Tạo UserCourse không hợp lệ (người dùng không tham gia khóa học)
        public static UserCourse GetInvalidUserCourse()
        {
            return null;
        }
    }
}
