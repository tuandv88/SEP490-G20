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

}

