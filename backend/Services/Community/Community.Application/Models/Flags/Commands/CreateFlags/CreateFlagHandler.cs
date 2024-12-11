using Community.Application.Models.Flags.Dtos;
using Community.Domain.ValueObjects;

namespace Community.Application.Models.Flags.Commands.CreateFlags;

public class CreateFlagHandler : ICommandHandler<CreateFlagCommand, CreateFlagResult>
{
    private readonly IFlagRepository _flagRepository;
    private readonly IDiscussionRepository _discussionRepository;

    public CreateFlagHandler(IFlagRepository flagRepository, IDiscussionRepository discussionRepository)
    {
        _flagRepository = flagRepository;
        _discussionRepository = discussionRepository;
    }

    public async Task<CreateFlagResult> Handle(CreateFlagCommand request, CancellationToken cancellationToken)
    {
        var discussion = await _discussionRepository.GetByIdAsync(request.CreateFlagDto.IdDiscussion);

        if (discussion == null)
        {
            throw new NotFoundException("Discussion not found.", request.CreateFlagDto.IdDiscussion);
        }

        if(discussion?.FlagId != null)
        {
            throw new NotFoundException("Discussion post has flag please update flag.");
        }

        Flag flagNew = CreateFlagWithNewValues(request.CreateFlagDto);

        if (flagNew == null)
        {
            throw new NotFoundException("Flag Create not found.");
        }

        await _flagRepository.AddAsync(flagNew);
        await _flagRepository.SaveChangesAsync(cancellationToken);

        discussion.FlagId = flagNew.Id;
        await _discussionRepository.UpdateAsync(discussion);
        await _discussionRepository.SaveChangesAsync(cancellationToken);

        return new CreateFlagResult(true);
    }

    private Flag CreateFlagWithNewValues(CreateFlagDto createFlagDto)
    {
        if (!Enum.TryParse<ViolationLevel>(createFlagDto.ViolationLevel, true, out var violationLevel))
        {
            throw new ArgumentException($"Invalid ViolationLevel value: {createFlagDto.ViolationLevel} - (High/Medium/Low/None)");
        }


        Flag flagNew = Flag.Create(id: FlagId.Of(Guid.NewGuid()),
            discussionId: DiscussionId.Of(createFlagDto.IdDiscussion),
            violationLevel: violationLevel,
            reason: createFlagDto.Reason,
            flaggedDate: DateTime.UtcNow
            );

        return flagNew;
    }
}
