namespace Learning.Application.Models.Lectures.Dtos;
public record LecturePreviewDto {
    public Guid Id { get; set; }
    public string Title { get; set; }
    public string? Summary { get; set; }
    public int OrderIndex { get; set; }
    public bool IsFree { get; set; }
    public string? VideoUrl { get; set; }
};

