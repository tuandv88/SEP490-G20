namespace Learning.Application.IntegrationTests.Models.Problems.Commands;

using Learning.Application.Models.Problems.Commands.ChangeProblemStatus;
using FluentAssertions;
using NUnit.Framework;
using System;
using BuildingBlocks.Exceptions;

public class ChangeProblemStatusTests : BaseTestFixture {
    [Test]
    public async Task ShouldRequireAuthorization() {
        // Arrange
        RunHttpContext();

        var command = new ChangeProblemStatusCommand(Guid.NewGuid());

        // Act & Assert
        await FluentActions.Invoking(() => SendAsync(command))
            .Should().ThrowAsync<UnauthorizedAccessException>();
    }

    [Test]
    public async Task ShouldReturnNotFoundWhenProblemDoesNotExist() {
        await RunAsAdministratorAsync();
        // Arrange
        var problemId = Guid.NewGuid();
        var command = new ChangeProblemStatusCommand(problemId);

        // Act & Assert
        await FluentActions.Invoking(() => SendAsync(command))
            .Should().ThrowAsync<NotFoundException>()
              .WithMessage($"Entity \"{nameof(Problem)}\" ({problemId}) was not found.");
    }

    [Test]
    public async Task ShouldChangeProblemStatusSuccessfully() {
        // Arrange
        var user = await RunAsAdministratorAsync();

        var problem = await FirstAsync<Problem>();
        if(problem == null ) {
            return;
        }
        var oldStatus = problem.IsActive;
        var command = new ChangeProblemStatusCommand(problem.Id.Value);

        // Act
        var result = await SendAsync(command);

        var problemChange = await FindAsync<Problem>(problem.Id);

        // Assert
        result.IsSuccess.Should().BeTrue();
        problemChange.Should().NotBeNull();
        problemChange!.IsActive.Should().Be(!oldStatus);
        problemChange.CreatedBy.Should().Be(user.UserName);
    }
}
