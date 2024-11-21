using Community.Application.Models.NotificationTypes.Dtos;
using Community.Domain.ValueObjects;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Community.Application.Models.NotificationTypes.Commands.CreateNotificationType;

public class CreateNotificationTypeHandler : ICommandHandler<CreateNotificationTypeCommand, CreateNotificationTypeResult>
{
    private readonly INotificationTypeRepository _notificationTypeRepository;

    public CreateNotificationTypeHandler(INotificationTypeRepository notificationTypeRepository)
    {
        _notificationTypeRepository = notificationTypeRepository;
    }

    public async Task<CreateNotificationTypeResult> Handle(CreateNotificationTypeCommand request, CancellationToken cancellationToken)
    {
        try
        {
            var notificationType = await CreateNewNotificationType(request.CreateNotificationTypeDto);

            await _notificationTypeRepository.AddAsync(notificationType);
            await _notificationTypeRepository.SaveChangesAsync(cancellationToken);

            return new CreateNotificationTypeResult(notificationType.Id.Value, true);
        }
        catch (Exception)
        {
            return new CreateNotificationTypeResult(null, false);
        }
    }

    private async Task<NotificationType> CreateNewNotificationType(CreateNotificationTypeDto createNotificationTypeDto)
    {
        return NotificationType.Create(
            id: NotificationTypeId.Of(Guid.NewGuid()),
            createNotificationTypeDto.Name,
            createNotificationTypeDto.Description,
            createNotificationTypeDto.CanSendEmail,
            createNotificationTypeDto.CanSendWebsite,
            createNotificationTypeDto.Priority
        );
    }
}
