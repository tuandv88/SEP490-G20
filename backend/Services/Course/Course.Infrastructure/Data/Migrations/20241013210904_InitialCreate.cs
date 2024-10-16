using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Course.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Courses",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Title = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false),
                    Description = table.Column<string>(type: "text", maxLength: 2147483647, nullable: false),
                    Headline = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false),
                    CourseStatus = table.Column<string>(type: "text", nullable: false, defaultValue: "Draft"),
                    TimeEstimation = table.Column<double>(type: "double precision", nullable: false),
                    Prerequisites = table.Column<string>(type: "text", maxLength: 2147483647, nullable: false),
                    Objectives = table.Column<string>(type: "text", maxLength: 2147483647, nullable: false),
                    TargetAudiences = table.Column<string>(type: "text", maxLength: 2147483647, nullable: false),
                    ScheduledPublishDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    ImageUrl = table.Column<string>(type: "text", nullable: false),
                    OrderIndex = table.Column<int>(type: "integer", nullable: false),
                    CourseLevel = table.Column<string>(type: "text", nullable: false, defaultValue: "Basic"),
                    Price = table.Column<double>(type: "double precision", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CreatedBy = table.Column<string>(type: "text", nullable: true),
                    LastModified = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    LastModifiedBy = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Courses", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Lessons",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CreatedBy = table.Column<string>(type: "text", nullable: true),
                    LastModified = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    LastModifiedBy = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Lessons", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Problems",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Title = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false),
                    Description = table.Column<string>(type: "text", maxLength: 2147483647, nullable: false),
                    ProblemType = table.Column<string>(type: "text", nullable: false, defaultValue: "Practice"),
                    DifficultyType = table.Column<string>(type: "text", nullable: false, defaultValue: "Easy"),
                    CpuTimeLimit = table.Column<float>(type: "real", nullable: false),
                    CpuExtraTime = table.Column<float>(type: "real", nullable: false),
                    MemoryLimit = table.Column<float>(type: "real", nullable: false),
                    EnableNetwork = table.Column<bool>(type: "boolean", nullable: false),
                    StackLimit = table.Column<int>(type: "integer", nullable: false),
                    MaxThread = table.Column<int>(type: "integer", nullable: false),
                    MaxFileSize = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CreatedBy = table.Column<string>(type: "text", nullable: true),
                    LastModified = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    LastModifiedBy = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Problems", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Quizs",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    IsRandomized = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    Title = table.Column<string>(type: "text", maxLength: 2147483647, nullable: false),
                    Description = table.Column<string>(type: "text", maxLength: 2147483647, nullable: false),
                    PassingMark = table.Column<int>(type: "integer", nullable: false),
                    TimeLimit = table.Column<double>(type: "double precision", nullable: false),
                    HasTimeLimit = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    AttemptLimit = table.Column<int>(type: "integer", nullable: false, defaultValue: 1),
                    HasAttemptLimit = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CreatedBy = table.Column<string>(type: "text", nullable: true),
                    LastModified = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    LastModifiedBy = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Quizs", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Chapters",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    CourseId = table.Column<Guid>(type: "uuid", nullable: false),
                    Title = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false),
                    Description = table.Column<string>(type: "text", maxLength: 2147483647, nullable: false),
                    TimeEstimation = table.Column<double>(type: "double precision", nullable: false),
                    OrderIndex = table.Column<int>(type: "integer", nullable: false),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CreatedBy = table.Column<string>(type: "text", nullable: true),
                    LastModified = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    LastModifiedBy = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Chapters", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Chapters_Courses_CourseId",
                        column: x => x.CourseId,
                        principalTable: "Courses",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "DiscountCodes",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    CourseId = table.Column<Guid>(type: "uuid", nullable: false),
                    Code = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Percentage = table.Column<double>(type: "double precision", nullable: false),
                    ExpirationDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    MaxQuantity = table.Column<int>(type: "integer", nullable: false),
                    UsedQuantity = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CreatedBy = table.Column<string>(type: "text", nullable: true),
                    LastModified = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    LastModifiedBy = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DiscountCodes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_DiscountCodes_Courses_CourseId",
                        column: x => x.CourseId,
                        principalTable: "Courses",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Documents",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    LessonId = table.Column<Guid>(type: "uuid", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CreatedBy = table.Column<string>(type: "text", nullable: true),
                    LastModified = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    LastModifiedBy = table.Column<string>(type: "text", nullable: true),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    FileName = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Url = table.Column<string>(type: "text", nullable: false),
                    Format = table.Column<string>(type: "text", nullable: false),
                    FileSize = table.Column<double>(type: "double precision", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Documents", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Documents_Lessons_LessonId",
                        column: x => x.LessonId,
                        principalTable: "Lessons",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Videos",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    LessonId = table.Column<Guid>(type: "uuid", nullable: false),
                    Duration = table.Column<double>(type: "double precision", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CreatedBy = table.Column<string>(type: "text", nullable: true),
                    LastModified = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    LastModifiedBy = table.Column<string>(type: "text", nullable: true),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    FileName = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Url = table.Column<string>(type: "text", nullable: false),
                    Format = table.Column<string>(type: "text", nullable: false),
                    FileSize = table.Column<double>(type: "double precision", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Videos", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Videos_Lessons_LessonId",
                        column: x => x.LessonId,
                        principalTable: "Lessons",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ProblemSolutions",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    ProblemId = table.Column<Guid>(type: "uuid", nullable: false),
                    FileName = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    Template = table.Column<string>(type: "text", maxLength: 2147483647, nullable: false),
                    SolutionCode = table.Column<string>(type: "text", maxLength: 2147483647, nullable: false),
                    Description = table.Column<string>(type: "text", maxLength: 2147483647, nullable: false),
                    LanguageCode = table.Column<string>(type: "text", nullable: false, defaultValue: "Java"),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CreatedBy = table.Column<string>(type: "text", nullable: true),
                    LastModified = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    LastModifiedBy = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProblemSolutions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ProblemSolutions_Problems_ProblemId",
                        column: x => x.ProblemId,
                        principalTable: "Problems",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Question",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    QuizId = table.Column<Guid>(type: "uuid", nullable: false),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    Content = table.Column<string>(type: "text", nullable: false),
                    Mark = table.Column<int>(type: "integer", nullable: false),
                    OrderIndex = table.Column<int>(type: "integer", nullable: false),
                    QuestionType = table.Column<string>(type: "text", nullable: false, defaultValue: "MultipleChoice"),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CreatedBy = table.Column<string>(type: "text", nullable: true),
                    LastModified = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    LastModifiedBy = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Question", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Question_Quizs_QuizId",
                        column: x => x.QuizId,
                        principalTable: "Quizs",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Lectures",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    ChapterId = table.Column<Guid>(type: "uuid", nullable: false),
                    LessonId = table.Column<Guid>(type: "uuid", nullable: false),
                    ProblemId = table.Column<Guid>(type: "uuid", nullable: false),
                    QuizId = table.Column<Guid>(type: "uuid", nullable: false),
                    Title = table.Column<string>(type: "text", nullable: false),
                    TimeEstimation = table.Column<double>(type: "double precision", nullable: false),
                    LectureType = table.Column<string>(type: "text", nullable: false, defaultValue: "Lesson"),
                    OrderIndex = table.Column<int>(type: "integer", nullable: false),
                    Point = table.Column<int>(type: "integer", nullable: false),
                    IsFree = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CreatedBy = table.Column<string>(type: "text", nullable: true),
                    LastModified = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    LastModifiedBy = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Lectures", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Lectures_Chapters_ChapterId",
                        column: x => x.ChapterId,
                        principalTable: "Chapters",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Lectures_Lessons_LessonId",
                        column: x => x.LessonId,
                        principalTable: "Lessons",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Lectures_Problems_ProblemId",
                        column: x => x.ProblemId,
                        principalTable: "Problems",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Lectures_Quizs_QuizId",
                        column: x => x.QuizId,
                        principalTable: "Quizs",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ProblemTestCases",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    ProblemSolutionId = table.Column<Guid>(type: "uuid", nullable: false),
                    Input = table.Column<string>(type: "text", maxLength: 2147483647, nullable: false),
                    ExpectedOutput = table.Column<string>(type: "text", maxLength: 2147483647, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CreatedBy = table.Column<string>(type: "text", nullable: true),
                    LastModified = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    LastModifiedBy = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProblemTestCases", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ProblemTestCases_ProblemSolutions_ProblemSolutionId",
                        column: x => x.ProblemSolutionId,
                        principalTable: "ProblemSolutions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "QuestionOption",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    QuestionId = table.Column<Guid>(type: "uuid", nullable: false),
                    Content = table.Column<string>(type: "text", maxLength: 2147483647, nullable: false),
                    IsCorrect = table.Column<bool>(type: "boolean", nullable: false),
                    OrderIndex = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CreatedBy = table.Column<string>(type: "text", nullable: true),
                    LastModified = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    LastModifiedBy = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_QuestionOption", x => x.Id);
                    table.ForeignKey(
                        name: "FK_QuestionOption_Question_QuestionId",
                        column: x => x.QuestionId,
                        principalTable: "Question",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Chapters_CourseId",
                table: "Chapters",
                column: "CourseId");

            migrationBuilder.CreateIndex(
                name: "IX_DiscountCodes_CourseId",
                table: "DiscountCodes",
                column: "CourseId");

            migrationBuilder.CreateIndex(
                name: "IX_Documents_LessonId",
                table: "Documents",
                column: "LessonId");

            migrationBuilder.CreateIndex(
                name: "IX_Lectures_ChapterId",
                table: "Lectures",
                column: "ChapterId");

            migrationBuilder.CreateIndex(
                name: "IX_Lectures_LessonId",
                table: "Lectures",
                column: "LessonId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Lectures_ProblemId",
                table: "Lectures",
                column: "ProblemId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Lectures_QuizId",
                table: "Lectures",
                column: "QuizId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ProblemSolutions_ProblemId",
                table: "ProblemSolutions",
                column: "ProblemId");

            migrationBuilder.CreateIndex(
                name: "IX_ProblemTestCases_ProblemSolutionId",
                table: "ProblemTestCases",
                column: "ProblemSolutionId");

            migrationBuilder.CreateIndex(
                name: "IX_Question_QuizId",
                table: "Question",
                column: "QuizId");

            migrationBuilder.CreateIndex(
                name: "IX_QuestionOption_QuestionId",
                table: "QuestionOption",
                column: "QuestionId");

            migrationBuilder.CreateIndex(
                name: "IX_Videos_LessonId",
                table: "Videos",
                column: "LessonId",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "DiscountCodes");

            migrationBuilder.DropTable(
                name: "Documents");

            migrationBuilder.DropTable(
                name: "Lectures");

            migrationBuilder.DropTable(
                name: "ProblemTestCases");

            migrationBuilder.DropTable(
                name: "QuestionOption");

            migrationBuilder.DropTable(
                name: "Videos");

            migrationBuilder.DropTable(
                name: "Chapters");

            migrationBuilder.DropTable(
                name: "ProblemSolutions");

            migrationBuilder.DropTable(
                name: "Question");

            migrationBuilder.DropTable(
                name: "Lessons");

            migrationBuilder.DropTable(
                name: "Courses");

            migrationBuilder.DropTable(
                name: "Problems");

            migrationBuilder.DropTable(
                name: "Quizs");
        }
    }
}
