namespace Learning.Application.IntegrationTests.Models.Problems.Commands;

using Learning.Application.Models.Problems.Commands.DeleteProblem;
using FluentAssertions;
using NUnit.Framework;
using System;
using BuildingBlocks.Exceptions;

public class DeleteProblemTests : BaseTestFixture {
    [Test]
    public async Task ShouldRequireAuthorization() {
        // Arrange
        var command = new DeleteProblemCommand(Guid.NewGuid());

        // Act & Assert
        await FluentActions.Invoking(() => SendAsync(command))
            .Should().ThrowAsync<UnauthorizedAccessException>();
    }

    [Test]
    public async Task ShouldReturnNotFoundWhenProblemDoesNotExist() {
        // Arrange
        var problemId = Guid.NewGuid();
        var command = new DeleteProblemCommand(problemId);

        // Act & Assert
        await FluentActions.Invoking(() => SendAsync(command))
            .Should().ThrowAsync<NotFoundException>()
            .WithMessage($"Entity \"{nameof(Problem)}\" ({problemId}) was not found.");
    }

    [Test]
    public async Task ShouldDeleteProblemSuccessfully() {
        // Arrange
        var user = await RunAsAdministratorAsync();


        var problem = await FirstAsync<Problem>();
        if (problem == null) {
            return;
        }

        var command = new DeleteProblemCommand(problem.Id.Value);

        // Act
        await SendAsync(command);

        // Assert
        var deletedProblem = await FindAsync<Problem>(problem.Id);
        deletedProblem.Should().BeNull();
    }
}
