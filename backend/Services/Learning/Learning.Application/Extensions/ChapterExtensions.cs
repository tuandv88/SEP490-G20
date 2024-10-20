using Learning.Application.Models.Chapters.Dtos;

namespace Learning.Application.Extensions;
public static class ChapterExtensions {
    public static ChapterDto ToChapterDto(this Chapter chapter) {
        return new ChapterDto(
            Id: chapter.Id.Value,
            Title: chapter.Title,
            Description: chapter.Description,
            TimeEstimation: chapter.TimeEstimation,
            OrderIndex: chapter.OrderIndex,
            IsActive: chapter.IsActive
            );
    }
}

