using Learning.Application.Models.Courses.Commands.ChangeCourseStatus;
using Learning.Domain.Enums;
using Learning.Domain.ValueObjects;
using Learning.Tests.Application.UnitTest.Models.Course.Helpers;
using Moq;
using NUnit.Framework;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace Learning.Tests.Application.UnitTest.Models.Course.Commands;

[TestFixture]
public class ChangeCourseStatusTests
{
    private Mock<ICourseRepository> _repositoryMock;
    private ChangeCourseStatusHandler _handler;
    private ChangeCourseStatusCommandValidator _validator;

    [SetUp]
    public void SetUp()
    {
        _repositoryMock = new Mock<ICourseRepository>();
        _handler = new ChangeCourseStatusHandler(_repositoryMock.Object);
        _validator = new ChangeCourseStatusCommandValidator();
    }

    // Validator Tests
    [Test]
    public void Validator_ShouldPass_WhenCourseStatusIsValid()
    {
        var command = ChangeCourseStatusTestData.GetValidChangeCourseStatusCommand_Published();
        var result = _validator.TestValidate(command);
        result.ShouldNotHaveAnyValidationErrors();
    }

    [Test]
    public void Validator_ShouldFail_WhenCourseStatusIsNull()
    {
        var command = ChangeCourseStatusTestData.GetInvalidChangeCourseStatusCommand_NullStatus();
        var result = _validator.TestValidate(command);
        result.ShouldHaveValidationErrorFor(x => x.CourseStatus)
              .WithErrorMessage("CourseStatus must not be null.");
    }

    [Test]
    public void Validator_ShouldFail_WhenCourseStatusIsEmpty()
    {
        var command = ChangeCourseStatusTestData.GetInvalidChangeCourseStatusCommand_EmptyStatus();
        var result = _validator.TestValidate(command);
        result.ShouldHaveValidationErrorFor(x => x.CourseStatus)
              .WithErrorMessage("CourseStatus must not be empty.");
    }

    [Test]
    public void Validator_ShouldFail_WhenCourseStatusIsInvalid()
    {
        var command = ChangeCourseStatusTestData.GetInvalidChangeCourseStatusCommand_InvalidStatus();
        var result = _validator.TestValidate(command);
        result.ShouldHaveValidationErrorFor(x => x.CourseStatus)
              .WithErrorMessage("CourseStatus must be a valid value (Draft, Published, Scheduled, Archived).");
    }

    // Handler Tests
    [Test]
    public async Task Handler_ShouldChangeCourseStatus_WhenValidRequest()
    {
        var command = ChangeCourseStatusTestData.GetValidChangeCourseStatusCommand_Published();

        _repositoryMock
            .Setup(repo => repo.GetByIdDetailAsync(It.IsAny<Guid>()))
            .ReturnsAsync(new Learning.Domain.Models.Course
            {
                Id = CourseId.Of(command.CourseId),
                CourseStatus = CourseStatus.Draft,
                Chapters = new List<Chapter>
                {
                    new Chapter { Lectures = new List<Lecture> { new Lecture(), new Lecture() } },
                    new Chapter { Lectures = new List<Lecture> { new Lecture(), new Lecture() } },
                    new Chapter { Lectures = new List<Lecture> { new Lecture(), new Lecture() } },
                }
            });

        _repositoryMock
            .Setup(repo => repo.UpdateAsync(It.IsAny<Learning.Domain.Models.Course>()))
            .Returns(Task.CompletedTask);

        _repositoryMock
            .Setup(repo => repo.SaveChangesAsync(CancellationToken.None))
            .Returns(Task.FromResult(1));

        var result = await _handler.Handle(command, CancellationToken.None);

        Assert.IsTrue(result.IsSuccess);
        Assert.AreEqual("Course status updated successfully.", result.Message);
    }

    [Test]
    public void Handler_ShouldThrowNotFoundException_WhenCourseNotFound()
    {
        var command = ChangeCourseStatusTestData.GetValidChangeCourseStatusCommand_Published();

        _repositoryMock
            .Setup(repo => repo.GetByIdDetailAsync(It.IsAny<Guid>()))
            .ReturnsAsync((Learning.Domain.Models.Course)null);

        var ex = Assert.ThrowsAsync<NotFoundException>(() => _handler.Handle(command, CancellationToken.None));
        Assert.That(ex.Message, Does.Contain($"Entity \"Course\" ({command.CourseId}) was not found."));
    }

    [Test]
    public async Task Handler_ShouldFail_WhenCourseStatusIsUnchanged()
    {
        var command = ChangeCourseStatusTestData.GetValidChangeCourseStatusCommand_Published();

        _repositoryMock
            .Setup(repo => repo.GetByIdDetailAsync(It.IsAny<Guid>()))
            .ReturnsAsync(new Learning.Domain.Models.Course
            {
                Id = CourseId.Of(command.CourseId),
                CourseStatus = CourseStatus.Published
            });

        var result = await _handler.Handle(command, CancellationToken.None);

        Assert.IsTrue(result.IsSuccess);
        Assert.AreEqual("Course status not change", result.Message);
    }

    [Test]
    public async Task Handler_ShouldFail_WhenScheduledPublishDateIsInvalid()
    {
        var command = ChangeCourseStatusTestData.GetInvalidChangeCourseStatusCommand_InvalidDate();

        _repositoryMock
            .Setup(repo => repo.GetByIdDetailAsync(It.IsAny<Guid>()))
            .ReturnsAsync(new Learning.Domain.Models.Course
            {
                Id = CourseId.Of(command.CourseId),
                CourseStatus = CourseStatus.Draft,
                Chapters = new List<Chapter>
                {
                    new Chapter { Lectures = new List<Lecture> { new Lecture(), new Lecture() } },
                    new Chapter { Lectures = new List<Lecture> { new Lecture(), new Lecture() } },
                    new Chapter { Lectures = new List<Lecture> { new Lecture(), new Lecture() } },
                }
            });

        var result = await _handler.Handle(command, CancellationToken.None);

        Assert.IsFalse(result.IsSuccess);
        Assert.AreEqual("ScheduledPublishDate is not valid.", result.Message);
    }
}
