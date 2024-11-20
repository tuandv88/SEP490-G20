using System;
using User.Application.Models.PathSteps.Dtos;
using User.Domain.Enums;

namespace User.Application.Extensions
{
    public static class PathStepsExtensions
    {
        public static PathStepDto ToPathStepDto(this PathStep pathStep)
        {
            return new PathStepDto(
                Id: pathStep.Id.Value,
                LearningPathId: pathStep.LearningPathId.Value,
                CourseId: pathStep.CourseId.Value,
                StepOrder: pathStep.StepOrder,
                Status: pathStep.Status,
                EnrollmentDate: pathStep.EnrollmentDate,
                CompletionDate: pathStep.CompletionDate,
                ExpectedCompletionDate: pathStep.ExpectedCompletionDate
            );
        }
    }
}
