using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Learning.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class UpdateFiled : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<DateTime>(
                name: "EnrollmentDate",
                table: "UserCourses",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(2024, 11, 21, 1, 43, 31, 665, DateTimeKind.Utc).AddTicks(6332),
                oldClrType: typeof(DateTime),
                oldType: "timestamp with time zone",
                oldDefaultValue: new DateTime(2024, 11, 21, 1, 27, 21, 673, DateTimeKind.Utc).AddTicks(9650));

            migrationBuilder.AlterColumn<DateTime>(
                name: "SubmissionDate",
                table: "QuizSubmissions",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(2024, 11, 21, 1, 43, 31, 658, DateTimeKind.Utc).AddTicks(2893),
                oldClrType: typeof(DateTime),
                oldType: "timestamp with time zone",
                oldDefaultValue: new DateTime(2024, 11, 21, 1, 27, 21, 669, DateTimeKind.Utc).AddTicks(4604));

            migrationBuilder.AlterColumn<DateTime>(
                name: "StartTime",
                table: "QuizSubmissions",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(2024, 11, 21, 1, 43, 31, 658, DateTimeKind.Utc).AddTicks(2154),
                oldClrType: typeof(DateTime),
                oldType: "timestamp with time zone",
                oldDefaultValue: new DateTime(2024, 11, 21, 1, 27, 21, 669, DateTimeKind.Utc).AddTicks(3963));

            migrationBuilder.AlterColumn<string>(
                name: "Answers",
                table: "QuizSubmissions",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AlterColumn<DateTime>(
                name: "SubmissionDate",
                table: "ProblemSubmissions",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(2024, 11, 21, 1, 43, 31, 638, DateTimeKind.Utc).AddTicks(2638),
                oldClrType: typeof(DateTime),
                oldType: "timestamp with time zone",
                oldDefaultValue: new DateTime(2024, 11, 21, 1, 27, 21, 659, DateTimeKind.Utc).AddTicks(4017));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<DateTime>(
                name: "EnrollmentDate",
                table: "UserCourses",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(2024, 11, 21, 1, 27, 21, 673, DateTimeKind.Utc).AddTicks(9650),
                oldClrType: typeof(DateTime),
                oldType: "timestamp with time zone",
                oldDefaultValue: new DateTime(2024, 11, 21, 1, 43, 31, 665, DateTimeKind.Utc).AddTicks(6332));

            migrationBuilder.AlterColumn<DateTime>(
                name: "SubmissionDate",
                table: "QuizSubmissions",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(2024, 11, 21, 1, 27, 21, 669, DateTimeKind.Utc).AddTicks(4604),
                oldClrType: typeof(DateTime),
                oldType: "timestamp with time zone",
                oldDefaultValue: new DateTime(2024, 11, 21, 1, 43, 31, 658, DateTimeKind.Utc).AddTicks(2893));

            migrationBuilder.AlterColumn<DateTime>(
                name: "StartTime",
                table: "QuizSubmissions",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(2024, 11, 21, 1, 27, 21, 669, DateTimeKind.Utc).AddTicks(3963),
                oldClrType: typeof(DateTime),
                oldType: "timestamp with time zone",
                oldDefaultValue: new DateTime(2024, 11, 21, 1, 43, 31, 658, DateTimeKind.Utc).AddTicks(2154));

            migrationBuilder.AlterColumn<string>(
                name: "Answers",
                table: "QuizSubmissions",
                type: "text",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "SubmissionDate",
                table: "ProblemSubmissions",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(2024, 11, 21, 1, 27, 21, 659, DateTimeKind.Utc).AddTicks(4017),
                oldClrType: typeof(DateTime),
                oldType: "timestamp with time zone",
                oldDefaultValue: new DateTime(2024, 11, 21, 1, 43, 31, 638, DateTimeKind.Utc).AddTicks(2638));
        }
    }
}
