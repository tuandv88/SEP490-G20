
namespace Learning.Application.Models.Chapters.Commands.DeleteChapter;
public class DeleteChapterHandler : ICommandHandler<DeleteChapterCommand, Unit> {
    public Task<Unit> Handle(DeleteChapterCommand request, CancellationToken cancellationToken) {
        throw new NotImplementedException();
    }
}

