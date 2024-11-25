using NUnit.Framework;
using Moq;
using Learning.Application.Models.Courses.Commands.UpdateCourseImage;
using Learning.Application.Interfaces;
using System;
using System.Threading;
using System.Threading.Tasks;
using BuidingBlocks.Storage.Models;
using Learning.Tests.Application.UnitTest.Models.Course.Helpers;

namespace Learning.Tests.Application.UnitTest.Models.Course.Commands;

[TestFixture]
public class UpdateCourseImageTests
{
    private Mock<ICourseRepository> _repositoryMock;
    private Mock<IFilesService> _filesServiceMock;
    private Mock<IBase64Converter> _base64ConverterMock;
    private UpdateCourseImageHandler _handler;

    [SetUp]
    public void SetUp()
    {
        _repositoryMock = new Mock<ICourseRepository>();
        _filesServiceMock = new Mock<IFilesService>();
        _base64ConverterMock = new Mock<IBase64Converter>();

        _handler = new UpdateCourseImageHandler(
            _repositoryMock.Object,
            _filesServiceMock.Object,
            _base64ConverterMock.Object
        );
    }

    // Test 1: Xử lý thành công
    [Test]
    public async Task Handler_ShouldUpdateImageSuccessfully_WhenValidRequest()
    {
        // Arrange
        var command = UpdateCourseImageTestData.GetValidUpdateCourseImageCommand();

        var mockCourse = new Learning.Domain.Models.Course { ImageUrl = "oldImage.png" };
        _repositoryMock
            .Setup(repo => repo.GetByIdAsync(command.CourseId))
            .ReturnsAsync(mockCourse);

        _filesServiceMock
            .Setup(service => service.UploadFileAsync(It.IsAny<MemoryStream>(), It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>()))
            .ReturnsAsync("uploaded/newImage.png");

        _filesServiceMock
            .Setup(service => service.GetFileAsync(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<int>()))
            .ReturnsAsync(new S3ObjectDto
            {
                PresignedUrl = "http://fakeurl.com/newImage.png"
            });

        _filesServiceMock
            .Setup(service => service.DeleteFileAsync(It.IsAny<string>(), It.IsAny<string>()))
            .Returns(Task.CompletedTask);

        // Act
        var result = await _handler.Handle(command, CancellationToken.None);

        // Assert
        Assert.NotNull(result);
        Assert.AreEqual("http://fakeurl.com/newImage.png", result.PresignedUrl);
        _repositoryMock.Verify(repo => repo.UpdateAsync(mockCourse), Times.Once);
        _repositoryMock.Verify(repo => repo.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
    }

    // Test 3: Lỗi khi không tìm thấy Course
    [Test]
    public void Handler_ShouldThrowNotFoundException_WhenCourseDoesNotExist()
    {
        // Arrange
        var command = UpdateCourseImageTestData.GetValidUpdateCourseImageCommand();

        _repositoryMock
            .Setup(repo => repo.GetByIdAsync(command.CourseId))
            .ReturnsAsync((Learning.Domain.Models.Course)null);

        // Act & Assert
        var ex = Assert.ThrowsAsync<NotFoundException>(() => _handler.Handle(command, CancellationToken.None));
        Assert.That(ex.Message, Does.Contain("Course"));
    }

    // Test 4: Lỗi khi FileName rỗng
    [Test]
    public void Handler_ShouldThrowArgumentException_WhenFileNameIsEmpty()
    {
        // Arrange
        var command = UpdateCourseImageTestData.GetInvalidUpdateCourseImageCommand_EmptyFileName();

        var mockCourse = new Learning.Domain.Models.Course { ImageUrl = "oldImage.png" };
        _repositoryMock
            .Setup(repo => repo.GetByIdAsync(command.CourseId))
            .ReturnsAsync(mockCourse);

        _filesServiceMock
            .Setup(service => service.UploadFileAsync(It.IsAny<MemoryStream>(), It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>()))
            .Throws(new ArgumentException("FileName must not be empty"));

        // Act & Assert
        var ex = Assert.ThrowsAsync<ArgumentException>(() => _handler.Handle(command, CancellationToken.None));
        Assert.That(ex.Message, Does.Contain("FileName must not be empty"));
    }


    // Test 5: Lỗi khi Base64Image không hợp lệ
    [Test]
    public void Handler_ShouldThrowArgumentException_WhenBase64IsInvalid()
    {
        // Arrange
        var command = UpdateCourseImageTestData.GetInvalidUpdateCourseImageCommand_InvalidBase64();

        var mockCourse = new Learning.Domain.Models.Course { ImageUrl = "oldImage.png" };
        _repositoryMock
            .Setup(repo => repo.GetByIdAsync(command.CourseId))
            .ReturnsAsync(mockCourse);

        _base64ConverterMock
            .Setup(converter => converter.ConvertToMemoryStream(It.IsAny<string>()))
            .Throws(new ArgumentException("Invalid Base64"));

        // Act & Assert
        var ex = Assert.ThrowsAsync<ArgumentException>(() => _handler.Handle(command, CancellationToken.None));
        Assert.That(ex.Message, Does.Contain("Invalid Base64"));
    }
}
