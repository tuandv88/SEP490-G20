using MediatR;
using User.Application.Data.Repositories;
using User.Application.Models.Dtos;
using User.Domain.ValueObjects;

namespace User.Application.Models.PointHistories.Commands.CreatePointHistory
{
    public class CreatePointHistoryHandler : IRequestHandler<CreatePointHistoryCommand, CreatePointHistoryResult>
    {
        private readonly IPointHistoryRepository pointHistoryRepository;

        public CreatePointHistoryHandler(IPointHistoryRepository pointHistoryRepository)
        {
            this.pointHistoryRepository = pointHistoryRepository;
        }

        public async Task<CreatePointHistoryResult> Handle(CreatePointHistoryCommand request, CancellationToken cancellationToken)
        {
            // Kiểm tra nếu UserId có tồn tại hay không
            // var user = await userRepository.GetByIdAsync(request.UserId);
            // if (user == null)
            // {
            //     throw new NotFoundException("User", request.UserId);
            // }

            // Tạo PointHistory mới từ CreatePointHistoryDto
            var pointHistory = CreateNewPointHistory(request.UserId, request.CreatePointHistoryDto);

            // Lưu PointHistory vào cơ sở dữ liệu
            await pointHistoryRepository.AddAsync(pointHistory);
            await pointHistoryRepository.SaveChangesAsync(cancellationToken);

            return new CreatePointHistoryResult(pointHistory.Id.Value);
        }

        private PointHistory CreateNewPointHistory(Guid userId, CreatePointHistoryDto createPointHistoryDto)
        {
            // Tạo PointHistory mới
            var pointHistory = PointHistory.Create(
                pointHistoryId: PointHistoryId.Of(Guid.NewGuid()), // Tạo một PointHistoryId mới
                userId: UserId.Of(userId),
                point: createPointHistoryDto.Points,
                changeType: createPointHistoryDto.ChangeType,
                source: createPointHistoryDto.Source,
                dateReceived: DateTime.UtcNow,
                lastUpdated: DateTime.UtcNow
            );

            return pointHistory;
        }
    }
}
