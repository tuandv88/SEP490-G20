namespace AI.Application.Common.Constants;
public static class TagConstant {
    public static class Import {
        public const string Document = "document";
        public const string Web = "web";
        public const string Text = "text";
    }
    public static class Key {
        public const string Type = "type";
        public const string MimeType = "mime_type";
        public const string Url = "url";
        public const string Learning = "learning";
    }
    public static class Learning{
        public static class Course {
            public const string Name = "learning_course";
            public const string CourseId = "course_id";
        }
        public static class Chapter {
            public const string Name = "learning_chapter";
            public const string ChapterId = "chapter_id";
        }
        public static class Lecture {
            public const string Name = "learning_lecture";
            public const string LectureId = "lecture_id";
        }
    }
}

