using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using User.Application.Data.Repositories;
using User.Application.Models.LearningPaths.Dtos;
using User.Application.Models.PathSteps.Dtos;
using BuildingBlocks.CQRS;
using BuildingBlocks.Exceptions;
using System.Linq;

namespace User.Application.Models.LearningPaths.Queries.GetLearningPathByUserId
{
    public class GetLearningPathByUserIdHandler : IQueryHandler<GetLearningPathByUserIdQuery, GetLearningPathByUserIdResult>
    {
        private readonly ILearningPathRepository _learningPathRepository;

        public GetLearningPathByUserIdHandler(ILearningPathRepository learningPathRepository)
        {
            _learningPathRepository = learningPathRepository;
        }

        public async Task<GetLearningPathByUserIdResult> Handle(GetLearningPathByUserIdQuery request, CancellationToken cancellationToken)
        {
            // Lấy danh sách LearningPaths từ repository bằng UserId, bao gồm cả PathSteps
            var learningPaths = await _learningPathRepository.GetByUserIdAsync(request.UserId);

            // Chuyển đổi danh sách LearningPaths và PathSteps thành LearningPathWithPathStepsDto
            var learningPathDtos = learningPaths.Select(lp => new LearningPathWithPathStepsDto(
                lp.Id.Value,
                lp.UserId.Value,
                lp.PathName,
                lp.StartDate,
                lp.EndDate,
                lp.Status.ToString(),
                lp.PathSteps.Select(ps => new PathStepDto(
                    ps.Id.Value,
                    ps.LearningPathId.Value,
                    ps.CourseId.Value,
                    ps.StepOrder,
                    ps.Status,
                    ps.EnrollmentDate,
                    ps.CompletionDate,
                    ps.ExpectedCompletionDate
                )).ToList()
            )).ToList();

            return new GetLearningPathByUserIdResult(learningPathDtos);
        }
    }
}
