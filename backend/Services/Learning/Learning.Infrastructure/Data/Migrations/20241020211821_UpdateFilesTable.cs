using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Learning.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class UpdateFilesTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_File_Lectures_LectureId",
                table: "File");

            migrationBuilder.DropPrimaryKey(
                name: "PK_File",
                table: "File");

            migrationBuilder.RenameTable(
                name: "File",
                newName: "Files");

            migrationBuilder.RenameIndex(
                name: "IX_File_LectureId",
                table: "Files",
                newName: "IX_Files_LectureId");

            migrationBuilder.AlterColumn<DateTime>(
                name: "EnrollmentDate",
                table: "UserCourses",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(2024, 10, 20, 21, 18, 19, 394, DateTimeKind.Utc).AddTicks(2464),
                oldClrType: typeof(DateTime),
                oldType: "timestamp with time zone",
                oldDefaultValue: new DateTime(2024, 10, 20, 15, 43, 4, 177, DateTimeKind.Utc).AddTicks(4557));

            migrationBuilder.AlterColumn<DateTime>(
                name: "SubmissionDate",
                table: "QuizSubmissions",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(2024, 10, 20, 21, 18, 19, 384, DateTimeKind.Utc).AddTicks(1072),
                oldClrType: typeof(DateTime),
                oldType: "timestamp with time zone",
                oldDefaultValue: new DateTime(2024, 10, 20, 15, 43, 4, 171, DateTimeKind.Utc).AddTicks(9922));

            migrationBuilder.AlterColumn<DateTime>(
                name: "SubmissionDate",
                table: "ProblemSubmissions",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(2024, 10, 20, 21, 18, 19, 362, DateTimeKind.Utc).AddTicks(5709),
                oldClrType: typeof(DateTime),
                oldType: "timestamp with time zone",
                oldDefaultValue: new DateTime(2024, 10, 20, 15, 43, 4, 160, DateTimeKind.Utc).AddTicks(9562));

            migrationBuilder.AddPrimaryKey(
                name: "PK_Files",
                table: "Files",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Files_Lectures_LectureId",
                table: "Files",
                column: "LectureId",
                principalTable: "Lectures",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Files_Lectures_LectureId",
                table: "Files");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Files",
                table: "Files");

            migrationBuilder.RenameTable(
                name: "Files",
                newName: "File");

            migrationBuilder.RenameIndex(
                name: "IX_Files_LectureId",
                table: "File",
                newName: "IX_File_LectureId");

            migrationBuilder.AlterColumn<DateTime>(
                name: "EnrollmentDate",
                table: "UserCourses",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(2024, 10, 20, 15, 43, 4, 177, DateTimeKind.Utc).AddTicks(4557),
                oldClrType: typeof(DateTime),
                oldType: "timestamp with time zone",
                oldDefaultValue: new DateTime(2024, 10, 20, 21, 18, 19, 394, DateTimeKind.Utc).AddTicks(2464));

            migrationBuilder.AlterColumn<DateTime>(
                name: "SubmissionDate",
                table: "QuizSubmissions",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(2024, 10, 20, 15, 43, 4, 171, DateTimeKind.Utc).AddTicks(9922),
                oldClrType: typeof(DateTime),
                oldType: "timestamp with time zone",
                oldDefaultValue: new DateTime(2024, 10, 20, 21, 18, 19, 384, DateTimeKind.Utc).AddTicks(1072));

            migrationBuilder.AlterColumn<DateTime>(
                name: "SubmissionDate",
                table: "ProblemSubmissions",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(2024, 10, 20, 15, 43, 4, 160, DateTimeKind.Utc).AddTicks(9562),
                oldClrType: typeof(DateTime),
                oldType: "timestamp with time zone",
                oldDefaultValue: new DateTime(2024, 10, 20, 21, 18, 19, 362, DateTimeKind.Utc).AddTicks(5709));

            migrationBuilder.AddPrimaryKey(
                name: "PK_File",
                table: "File",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_File_Lectures_LectureId",
                table: "File",
                column: "LectureId",
                principalTable: "Lectures",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
