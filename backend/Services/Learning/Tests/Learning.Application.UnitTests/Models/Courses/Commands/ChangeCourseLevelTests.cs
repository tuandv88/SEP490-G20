using Learning.Application.Models.Courses.Commands.ChangeCourseLevel;
using Learning.Application.Models.Courses.Dtos;
using Learning.Domain.Enums;
using Learning.Domain.ValueObjects;
using Moq;
using NUnit.Framework;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace Learning.Tests.Application.UnitTest.Models.Course.Commands;

[TestFixture]
public class ChangeCourseLevelTests
{
    private Mock<ICourseRepository> _repositoryMock;
    private ChangeCourseLevelHandler _handler;
    private ChangeCourseLevelCommandValidator _validator;

    [SetUp]
    public void SetUp()
    {
        _repositoryMock = new Mock<ICourseRepository>();
        _handler = new ChangeCourseLevelHandler(_repositoryMock.Object);
        _validator = new ChangeCourseLevelCommandValidator();
    }

    // Validator Tests
    [Test]
    public void Validator_ShouldPass_WhenCourseLevelIsValid()
    {
        var command = new ChangeCourseLevelCommand(Guid.NewGuid(), "Advanced");
        var result = _validator.TestValidate(command);
        result.ShouldNotHaveAnyValidationErrors();
    }

    [Test]
    public void Validator_ShouldFail_WhenCourseLevelIsNull()
    {
        var command = new ChangeCourseLevelCommand(Guid.NewGuid(), null);
        var result = _validator.TestValidate(command);
        result.ShouldHaveValidationErrorFor(x => x.CourseLevel)
              .WithErrorMessage("CourseLevel must not be null.");
    }

    [Test]
    public void Validator_ShouldFail_WhenCourseLevelIsEmpty()
    {
        var command = new ChangeCourseLevelCommand(Guid.NewGuid(), "");
        var result = _validator.TestValidate(command);
        result.ShouldHaveValidationErrorFor(x => x.CourseLevel)
              .WithErrorMessage("CourseLevel must not be empty.");
    }

    [Test]
    public void Validator_ShouldFail_WhenCourseLevelIsInvalid()
    {
        var command = new ChangeCourseLevelCommand(Guid.NewGuid(), "InvalidLevel");
        var result = _validator.TestValidate(command);
        result.ShouldHaveValidationErrorFor(x => x.CourseLevel)
              .WithErrorMessage("CourseLevel must be a valid value (Basic, Intermediate, Advanced, Expert).");
    }

    // Handler Tests
    [Test]
    public async Task Handler_ShouldChangeCourseLevel_WhenValidRequest()
    {
        var courseId = Guid.NewGuid();
        var command = new ChangeCourseLevelCommand(courseId, "Advanced");

        _repositoryMock
            .Setup(repo => repo.GetByIdAsync(It.IsAny<Guid>())) // Expecting Guid
            .ReturnsAsync(new Learning.Domain.Models.Course { Id = CourseId.Of(courseId), CourseLevel = CourseLevel.Basic });

        _repositoryMock
            .Setup(repo => repo.CountByLevelAsync(It.IsAny<CourseLevel>()))
            .ReturnsAsync(0);

        _repositoryMock
            .Setup(repo => repo.UpdateAsync(It.IsAny<Learning.Domain.Models.Course>()))
            .Returns(Task.CompletedTask);

        _repositoryMock
            .Setup(repo => repo.GetByCourseLevelAsync(It.IsAny<CourseLevel>()))
            .ReturnsAsync(new List<Learning.Domain.Models.Course>());

        _repositoryMock
            .Setup(repo => repo.SaveChangesAsync(CancellationToken.None))
            .Returns(Task.FromResult(1));

        var result = await _handler.Handle(command, CancellationToken.None);

        Assert.IsTrue(result.IsSuccess);
        Assert.AreEqual("Course level and order index updated successfully.", result.Message);
    }

    [Test]
    public async Task Handler_ShouldReturnFailure_WhenCourseLevelIsUnchanged()
    {
        var courseId = Guid.NewGuid();
        var command = new ChangeCourseLevelCommand(courseId, "Advanced");

        _repositoryMock
            .Setup(repo => repo.GetByIdAsync(It.IsAny<Guid>())) // Expecting Guid
            .ReturnsAsync(new Learning.Domain.Models.Course { Id = CourseId.Of(courseId), CourseLevel = CourseLevel.Advanced });

        var result = await _handler.Handle(command, CancellationToken.None);

        Assert.IsFalse(result.IsSuccess);
        Assert.AreEqual("Course level is already set to the specified value.", result.Message);
    }

    [Test]
    public void Handler_ShouldThrowNotFoundException_WhenCourseNotFound()
    {
        var courseId = Guid.NewGuid();
        var command = new ChangeCourseLevelCommand(courseId, "Advanced");

        _repositoryMock
            .Setup(repo => repo.GetByIdAsync(It.IsAny<Guid>())) // Expecting Guid
            .ReturnsAsync((Learning.Domain.Models.Course)null);  // Simulating course not found

        var ex = Assert.ThrowsAsync<NotFoundException>(() => _handler.Handle(command, CancellationToken.None));
        Assert.That(ex.Message, Does.Contain($"Entity \"Course\" ({courseId}) was not found."));
    }

    [Test]
    public async Task Handler_ShouldNotChangeCourse_WhenCourseLevelIsInvalid()
    {
        var courseId = Guid.NewGuid();
        var command = new ChangeCourseLevelCommand(courseId, "InvalidLevel");

        // Mock the repository to return a valid course
        _repositoryMock
            .Setup(repo => repo.GetByIdAsync(It.IsAny<Guid>()))
            .ReturnsAsync(new Learning.Domain.Models.Course { Id = CourseId.Of(courseId), CourseLevel = CourseLevel.Basic });

        // Mock other repository methods
        _repositoryMock
            .Setup(repo => repo.CountByLevelAsync(It.IsAny<CourseLevel>()))
            .ReturnsAsync(0);

        _repositoryMock
            .Setup(repo => repo.SaveChangesAsync(CancellationToken.None))
            .Returns(Task.FromResult(1));

        // Act
        var result = await _handler.Handle(command, CancellationToken.None);

        // Assert
        Assert.IsFalse(result.IsSuccess, "Handler should not succeed when CourseLevel is invalid.");
        Assert.AreEqual("Course level is already set to the specified value.", result.Message,
            "Handler should not make changes for an invalid CourseLevel.");
    }


    [Test]
    public void Handler_ShouldUpdateOrderIndexes_WhenCoursesExistInOldLevel()
    {
        var courseId = Guid.NewGuid();
        var command = new ChangeCourseLevelCommand(courseId, "Advanced");

        _repositoryMock
            .Setup(repo => repo.GetByIdAsync(It.IsAny<Guid>()))
            .ReturnsAsync(new Learning.Domain.Models.Course { Id = CourseId.Of(courseId), CourseLevel = CourseLevel.Basic });

        _repositoryMock
            .Setup(repo => repo.GetByCourseLevelAsync(CourseLevel.Basic))
            .ReturnsAsync(new List<Learning.Domain.Models.Course>
            {
                new Learning.Domain.Models.Course { Id = CourseId.Of(Guid.NewGuid()), OrderIndex = 1 },
                new Learning.Domain.Models.Course { Id = CourseId.Of(Guid.NewGuid()), OrderIndex = 2 }
            });

        _repositoryMock
            .Setup(repo => repo.CountByLevelAsync(It.IsAny<CourseLevel>()))
            .ReturnsAsync(0);

        _repositoryMock
            .Setup(repo => repo.SaveChangesAsync(CancellationToken.None))
            .Returns(Task.FromResult(1));

        var result = _handler.Handle(command, CancellationToken.None).Result;

        Assert.IsTrue(result.IsSuccess);
        Assert.AreEqual("Course level and order index updated successfully.", result.Message);
    }
}
