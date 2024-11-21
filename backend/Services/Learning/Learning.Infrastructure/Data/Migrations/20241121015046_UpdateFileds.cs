using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Learning.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class UpdateFileds : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<DateTime>(
                name: "EnrollmentDate",
                table: "UserCourses",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(2024, 11, 21, 1, 50, 45, 196, DateTimeKind.Utc).AddTicks(1335),
                oldClrType: typeof(DateTime),
                oldType: "timestamp with time zone",
                oldDefaultValue: new DateTime(2024, 11, 21, 1, 43, 31, 665, DateTimeKind.Utc).AddTicks(6332));

            migrationBuilder.AlterColumn<DateTime>(
                name: "SubmissionDate",
                table: "QuizSubmissions",
                type: "timestamp with time zone",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "timestamp with time zone",
                oldDefaultValue: new DateTime(2024, 11, 21, 1, 43, 31, 658, DateTimeKind.Utc).AddTicks(2893));

            migrationBuilder.AlterColumn<string>(
                name: "Status",
                table: "QuizSubmissions",
                type: "text",
                nullable: false,
                defaultValue: "InProgress",
                oldClrType: typeof(string),
                oldType: "text",
                oldDefaultValue: "Processing");

            migrationBuilder.AlterColumn<DateTime>(
                name: "StartTime",
                table: "QuizSubmissions",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(2024, 11, 21, 1, 50, 45, 188, DateTimeKind.Utc).AddTicks(5434),
                oldClrType: typeof(DateTime),
                oldType: "timestamp with time zone",
                oldDefaultValue: new DateTime(2024, 11, 21, 1, 43, 31, 658, DateTimeKind.Utc).AddTicks(2154));

            migrationBuilder.AlterColumn<DateTime>(
                name: "SubmissionDate",
                table: "ProblemSubmissions",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(2024, 11, 21, 1, 50, 45, 172, DateTimeKind.Utc).AddTicks(4331),
                oldClrType: typeof(DateTime),
                oldType: "timestamp with time zone",
                oldDefaultValue: new DateTime(2024, 11, 21, 1, 43, 31, 638, DateTimeKind.Utc).AddTicks(2638));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<DateTime>(
                name: "EnrollmentDate",
                table: "UserCourses",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(2024, 11, 21, 1, 43, 31, 665, DateTimeKind.Utc).AddTicks(6332),
                oldClrType: typeof(DateTime),
                oldType: "timestamp with time zone",
                oldDefaultValue: new DateTime(2024, 11, 21, 1, 50, 45, 196, DateTimeKind.Utc).AddTicks(1335));

            migrationBuilder.AlterColumn<DateTime>(
                name: "SubmissionDate",
                table: "QuizSubmissions",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(2024, 11, 21, 1, 43, 31, 658, DateTimeKind.Utc).AddTicks(2893),
                oldClrType: typeof(DateTime),
                oldType: "timestamp with time zone");

            migrationBuilder.AlterColumn<string>(
                name: "Status",
                table: "QuizSubmissions",
                type: "text",
                nullable: false,
                defaultValue: "Processing",
                oldClrType: typeof(string),
                oldType: "text",
                oldDefaultValue: "InProgress");

            migrationBuilder.AlterColumn<DateTime>(
                name: "StartTime",
                table: "QuizSubmissions",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(2024, 11, 21, 1, 43, 31, 658, DateTimeKind.Utc).AddTicks(2154),
                oldClrType: typeof(DateTime),
                oldType: "timestamp with time zone",
                oldDefaultValue: new DateTime(2024, 11, 21, 1, 50, 45, 188, DateTimeKind.Utc).AddTicks(5434));

            migrationBuilder.AlterColumn<DateTime>(
                name: "SubmissionDate",
                table: "ProblemSubmissions",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(2024, 11, 21, 1, 43, 31, 638, DateTimeKind.Utc).AddTicks(2638),
                oldClrType: typeof(DateTime),
                oldType: "timestamp with time zone",
                oldDefaultValue: new DateTime(2024, 11, 21, 1, 50, 45, 172, DateTimeKind.Utc).AddTicks(4331));
        }
    }
}
