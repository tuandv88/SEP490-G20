using Community.Application.Models.NotificationHistories.Commands.RemoveNotificationHistoryById;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Community.Application.Models.NotificationTypes.Commands.RemoveNotificationTypeById;

public class RemoveNotificationTypeByIdHandler : ICommandHandler<RemoveNotificationTypeByIdCommand, RemoveNotificationTypeByIdResult>
{
    private readonly INotificationTypeRepository _notificationTypeRepository;

    public RemoveNotificationTypeByIdHandler(INotificationTypeRepository notificationTypeRepository)
    {
        _notificationTypeRepository = notificationTypeRepository;
    }

    public async Task<RemoveNotificationTypeByIdResult> Handle(RemoveNotificationTypeByIdCommand request, CancellationToken cancellationToken)
    {
        var notificationType = await _notificationTypeRepository.GetByIdAsync(request.Id);

        if (notificationType == null)
        {
            throw new NotFoundException("notification Type not found.", request.Id);
        }

        await _notificationTypeRepository.DeleteByIdAsync(request.Id);
        await _notificationTypeRepository.SaveChangesAsync(cancellationToken);

        return new RemoveNotificationTypeByIdResult(true);
    }
}