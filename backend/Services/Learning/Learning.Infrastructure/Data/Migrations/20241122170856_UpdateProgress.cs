using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Learning.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class UpdateProgress : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Notes",
                table: "LecturesProgress");

            migrationBuilder.AlterColumn<DateTime>(
                name: "EnrollmentDate",
                table: "UserCourses",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(2024, 11, 22, 17, 8, 53, 861, DateTimeKind.Utc).AddTicks(5130),
                oldClrType: typeof(DateTime),
                oldType: "timestamp with time zone",
                oldDefaultValue: new DateTime(2024, 11, 21, 23, 33, 34, 814, DateTimeKind.Utc).AddTicks(6844));

            migrationBuilder.AlterColumn<DateTime>(
                name: "SubmissionDate",
                table: "QuizSubmissions",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(2024, 11, 22, 17, 8, 53, 855, DateTimeKind.Utc).AddTicks(8732),
                oldClrType: typeof(DateTime),
                oldType: "timestamp with time zone",
                oldDefaultValue: new DateTime(2024, 11, 21, 23, 33, 34, 808, DateTimeKind.Utc).AddTicks(3837));

            migrationBuilder.AlterColumn<DateTime>(
                name: "StartTime",
                table: "QuizSubmissions",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(2024, 11, 22, 17, 8, 53, 855, DateTimeKind.Utc).AddTicks(7949),
                oldClrType: typeof(DateTime),
                oldType: "timestamp with time zone",
                oldDefaultValue: new DateTime(2024, 11, 21, 23, 33, 34, 808, DateTimeKind.Utc).AddTicks(2972));

            migrationBuilder.AlterColumn<DateTime>(
                name: "SubmissionDate",
                table: "ProblemSubmissions",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(2024, 11, 22, 17, 8, 53, 842, DateTimeKind.Utc).AddTicks(2579),
                oldClrType: typeof(DateTime),
                oldType: "timestamp with time zone",
                oldDefaultValue: new DateTime(2024, 11, 21, 23, 33, 34, 794, DateTimeKind.Utc).AddTicks(7299));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<DateTime>(
                name: "EnrollmentDate",
                table: "UserCourses",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(2024, 11, 21, 23, 33, 34, 814, DateTimeKind.Utc).AddTicks(6844),
                oldClrType: typeof(DateTime),
                oldType: "timestamp with time zone",
                oldDefaultValue: new DateTime(2024, 11, 22, 17, 8, 53, 861, DateTimeKind.Utc).AddTicks(5130));

            migrationBuilder.AlterColumn<DateTime>(
                name: "SubmissionDate",
                table: "QuizSubmissions",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(2024, 11, 21, 23, 33, 34, 808, DateTimeKind.Utc).AddTicks(3837),
                oldClrType: typeof(DateTime),
                oldType: "timestamp with time zone",
                oldDefaultValue: new DateTime(2024, 11, 22, 17, 8, 53, 855, DateTimeKind.Utc).AddTicks(8732));

            migrationBuilder.AlterColumn<DateTime>(
                name: "StartTime",
                table: "QuizSubmissions",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(2024, 11, 21, 23, 33, 34, 808, DateTimeKind.Utc).AddTicks(2972),
                oldClrType: typeof(DateTime),
                oldType: "timestamp with time zone",
                oldDefaultValue: new DateTime(2024, 11, 22, 17, 8, 53, 855, DateTimeKind.Utc).AddTicks(7949));

            migrationBuilder.AlterColumn<DateTime>(
                name: "SubmissionDate",
                table: "ProblemSubmissions",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(2024, 11, 21, 23, 33, 34, 794, DateTimeKind.Utc).AddTicks(7299),
                oldClrType: typeof(DateTime),
                oldType: "timestamp with time zone",
                oldDefaultValue: new DateTime(2024, 11, 22, 17, 8, 53, 842, DateTimeKind.Utc).AddTicks(2579));

            migrationBuilder.AddColumn<string>(
                name: "Notes",
                table: "LecturesProgress",
                type: "text",
                maxLength: 2147483647,
                nullable: false,
                defaultValue: "");
        }
    }
}
