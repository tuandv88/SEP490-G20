using Community.Application.Data.Repositories;
using Community.Application.Models.Discussions.Dtos;
using Community.Domain.Models;
using Community.Domain.ValueObjects;

namespace Community.Application.Models.Discussions.Commands.UpdateDiscussion;

public class UpdateDiscussionHandler : ICommandHandler<UpdateDiscussionCommand, UpdateDiscussionResult>
{
    private readonly IDiscussionRepository _discussionRepository;
    private readonly ICategoryRepository _categoryRepository;

    public UpdateDiscussionHandler(IDiscussionRepository discussionRepository, ICategoryRepository categoryRepository)
    {
        _discussionRepository = discussionRepository;
        _categoryRepository = categoryRepository;
    }

    public async Task<UpdateDiscussionResult> Handle(UpdateDiscussionCommand request, CancellationToken cancellationToken)
    {
        var category = await _categoryRepository.GetByIdAsync(request.UpdateDiscussionDto.CategoryId);

        if (category == null)
        {
            throw new NotFoundException("Category not found.", request.UpdateDiscussionDto.CategoryId);
        }

        var discussion = await _discussionRepository.GetByIdAsync(request.UpdateDiscussionDto.Id);

        if (discussion == null)
        {
            throw new NotFoundException("Discussion not found.", request.UpdateDiscussionDto.Id);
        }

        UpdateDiscussionWithNewValues(discussion, request.UpdateDiscussionDto);

        await _discussionRepository.UpdateAsync(discussion);
        await _discussionRepository.SaveChangesAsync(cancellationToken);

        return new UpdateDiscussionResult(true);
    }

    private void UpdateDiscussionWithNewValues(Discussion discussion, UpdateDiscussionDto updateDiscussionDto)
    {
        var userId = UserId.Of(updateDiscussionDto.UserId);
        var categoryId = CategoryId.Of(updateDiscussionDto.CategoryId);

        discussion.Update(
            userId: userId,
            categoryId: categoryId,
            title: updateDiscussionDto.Title,
            description: updateDiscussionDto.Description,
            isActive: updateDiscussionDto.IsActive,
            tags: updateDiscussionDto.Tags,
            closed: updateDiscussionDto.Closed,
            pinned: updateDiscussionDto.Pinned,
            viewCount: updateDiscussionDto.ViewCount
        );
    }
}
