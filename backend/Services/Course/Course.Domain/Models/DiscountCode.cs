namespace Course.Domain.Models;
public class DiscountCode : Entity<DiscountCodeId>{
    public CourseId CourseId { get; set; } = default!;
    public string Code { get; set; } = default!;
    public double Percentage { get; set; } 
    public DateTime ExpirationDate { get; set; }
    public bool IsActive { get; set; } = true;
    public int MaxQuantity { get; set; } // Số lượng mã tối đa có thể phát hành
    public int UsedQuantity { get; set; } = 0; // Số lượng mã đã sử dụng
}

