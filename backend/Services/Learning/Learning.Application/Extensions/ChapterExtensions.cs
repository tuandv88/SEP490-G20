using Learning.Application.Models.Chapters.Dtos;
using Learning.Application.Models.Lectures.Dtos;

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

    public static ChapterDetailDto ToChapterDetailDto(this Chapter chapter) {
        return new ChapterDetailDto(
            ChapterDto: chapter.ToChapterDto(),
            LectureDtos: chapter.Lectures
            .OrderBy(l => l.OrderIndex)
            .Select(l => l.ToLectureDto()).ToList()
            );
    }
}

