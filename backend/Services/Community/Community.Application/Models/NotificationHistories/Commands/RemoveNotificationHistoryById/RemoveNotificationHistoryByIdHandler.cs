using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Community.Application.Models.NotificationHistories.Commands.RemoveNotificationHistoryById;

public class RemoveNotificationHistoryByIdHandler : ICommandHandler<RemoveNotificationHistoryByIdCommand, RemoveNotificationHistoryByIdResult>
{
    private readonly INotificationHistoryRepository _notificationHistoryRepository;

    public RemoveNotificationHistoryByIdHandler(INotificationHistoryRepository notificationHistoryRepository)
    {
        _notificationHistoryRepository = notificationHistoryRepository;
    }

    public async Task<RemoveNotificationHistoryByIdResult> Handle(RemoveNotificationHistoryByIdCommand request, CancellationToken cancellationToken)
    {
        var notificationHistory = await _notificationHistoryRepository.GetByIdAsync(request.Id);

        if (notificationHistory == null)
        {
            throw new NotFoundException("NotificationHistory not found.", request.Id);
        }

        await _notificationHistoryRepository.DeleteByIdAsync(request.Id);
        await _notificationHistoryRepository.SaveChangesAsync(cancellationToken);

        return new RemoveNotificationHistoryByIdResult(true);
    }
}

