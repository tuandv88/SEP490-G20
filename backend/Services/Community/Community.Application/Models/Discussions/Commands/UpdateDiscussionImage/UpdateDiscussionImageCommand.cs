using Community.Application.Models.Discussions.Dtos;

namespace Community.Application.Models.Discussions.Commands.UpdateImageDiscussion;
public record UpdateDiscussionImageResult(string PresignedUrl);
public record UpdateDiscussionImageCommand(Guid Id, ImageDto ImageDto) : ICommand<UpdateDiscussionImageResult>;

