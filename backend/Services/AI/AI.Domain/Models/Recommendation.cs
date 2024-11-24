using AI.Domain.Abstractions;
using AI.Domain.ValueObjects;

namespace AI.Domain.Models;
public class Recommendation : Entity<RecommendationId> {
    public UserId UserId { get; set; } = default!;
    public string Name { get; set; } = default!;
    public string Data { get; set; } = default!; // dữ liệu đề xuất
    public string Source {  get; set; } = default!; // nguồn đề xuất
    public string Reason {  get; set; } = default!;
    public DateTime StartDate {  get; set; } = default!;
    public DateTime EndDate { get; set; } = default!;

    public static Recommendation Create(RecommendationId Id, UserId userId, string name, string data, string source, string reason, DateTime startDate, DateTime endDate) {
        return new Recommendation {
            Id = Id,
            UserId = userId,
            Name = name,
            Data = data,
            Source = source,
            Reason = reason,
            StartDate = startDate,
            EndDate = endDate
        };
    }

}

