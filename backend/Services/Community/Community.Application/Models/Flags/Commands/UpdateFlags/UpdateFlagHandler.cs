using Community.Application.Models.Flags.Dtos;

namespace Community.Application.Models.Flags.Commands.UpdateFlags;

public class UpdateFlagHandler : ICommandHandler<UpdateFlagCommand, UpdateFlagResult>
{
    private readonly IFlagRepository _flagRepository;

    public UpdateFlagHandler(IFlagRepository flagRepository)
    {
        _flagRepository = flagRepository;
    }

    public async Task<UpdateFlagResult> Handle(UpdateFlagCommand request, CancellationToken cancellationToken)
    {
        var flag = await _flagRepository.GetByIdAsync(request.UpdateFlagDto.Id);

        if (flag == null)
        {
            throw new NotFoundException("Flag not found.", request.UpdateFlagDto.Id);
        }

        UpdateFlagWithNewValues(flag, request.UpdateFlagDto);

        await _flagRepository.UpdateAsync(flag);
        await _flagRepository.SaveChangesAsync(cancellationToken);

        return new UpdateFlagResult(true);
    }

    private void UpdateFlagWithNewValues(Flag flag, UpdateFlagDto updateFlagDto)
    {
        if (!Enum.TryParse<ViolationLevel>(updateFlagDto.ViolationLevel, true, out var violationLevel))
        {
            throw new ArgumentException($"Invalid ViolationLevel value: {updateFlagDto.ViolationLevel} - (High/Medium/Low/None)");
        }


        flag.Update(
            violationLevel,
            updateFlagDto.Reason,
            flaggedDate:DateTime.UtcNow
        );
    }
}