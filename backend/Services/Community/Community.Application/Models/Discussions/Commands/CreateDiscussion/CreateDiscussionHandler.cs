﻿using Community.Application.Data.Repositories;
using Community.Application.Interfaces;
using Community.Application.Models.Discussions.Dtos;
using Community.Domain.Models;
using Community.Domain.ValueObjects;

namespace Community.Application.Models.Discussions.Commands.CreateDiscussion;

public class CreateDiscussionHandler : ICommandHandler<CreateDiscussionCommand, CreateDiscussionResult>
{
    private readonly IDiscussionRepository _discussionRepository;
    private readonly IUserDiscussionRepository _userDiscussionRepository;
    private readonly ICategoryRepository _categoryRepository;
    private readonly IFilesService _filesService;
    private readonly IBase64Converter _base64Converter;
    private readonly IUserContextService _userContextService;

    public CreateDiscussionHandler(IDiscussionRepository discussionRepository, IUserDiscussionRepository userDiscussionRepository,ICategoryRepository categoryRepository, IFilesService filesService, IBase64Converter base64Converter, IUserContextService userContextService)
    {
        _discussionRepository = discussionRepository;
        _userDiscussionRepository = userDiscussionRepository;
        _categoryRepository = categoryRepository;
        _filesService = filesService;
        _base64Converter = base64Converter;
        _userContextService = userContextService;
    }

    public async Task<CreateDiscussionResult> Handle(CreateDiscussionCommand request, CancellationToken cancellationToken)
    {
        // Lấy UserId từ UserContextService
        var currentUserId = _userContextService.User.Id;

        if (currentUserId == null)
        {
            throw new UnauthorizedAccessException("User is not authenticated.");
        }

        var userId = UserId.Of(currentUserId);


        var category = await _categoryRepository.GetByIdAsync(request.CreateDiscussionDto.CategoryId);

        if(category == null)
        {
            throw new NotFoundException("Category not found.", request.CreateDiscussionDto.CategoryId);
        }

        var discussion = await CreateNewDiscussion(userId, request.CreateDiscussionDto);
        await _discussionRepository.AddAsync(discussion);

        var userDiscussion = UserDiscussion.Create(userId, DiscussionId.Of(discussion.Id.Value), notificationsEnabled: true, isFollowing: true);
        await _userDiscussionRepository.AddAsync(userDiscussion);

        await _discussionRepository.SaveChangesAsync(cancellationToken);
        await _userDiscussionRepository.SaveChangesAsync(cancellationToken);

        return new CreateDiscussionResult(discussion.Id.Value);
    }

    private async Task<Discussion> CreateNewDiscussion(UserId userIdCurrent, CreateDiscussionDto createDiscussionDto)
    {

        var categoryId = CategoryId.Of(createDiscussionDto.CategoryId);

        // Xử lý ảnh nếu có
        string? imageUrl = null;

        if (createDiscussionDto.Image != null)
        {
            var bucket = StorageConstants.BUCKET;
            var prefix = StorageConstants.IMAGE_COMMUNITY_PATH;
            var originFileName = createDiscussionDto.Image.FileName;
            var base64Image = createDiscussionDto.Image.Base64Image;
            var contentType = createDiscussionDto.Image.ContentType;

            var fileName = await _filesService.UploadFileAsync(
                _base64Converter.ConvertToMemoryStream(base64Image),
                originFileName,
                contentType,
                bucket,
                prefix);

            imageUrl = $"{prefix}/{fileName}";
        }


        return Discussion.Create(
            discussionId: DiscussionId.Of(Guid.NewGuid()),
            userId: userIdCurrent,
            categoryId: categoryId,
            title: createDiscussionDto.Title,
            description: createDiscussionDto.Description,
            tags: createDiscussionDto.Tags,
            isActive: false,
            imageUrl: imageUrl
        );
    }

}
