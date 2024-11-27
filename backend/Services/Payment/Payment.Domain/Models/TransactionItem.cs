namespace Payment.Domain.Models;
public class TransactionItem : Entity<TransactionItemId> {
    public TransactionId TransactionId { get; set; } = default!;
    public string ProductId { get; set; } = default!;
    public ProductType ProductType { get; set; } = ProductType.Course;
    public string ProductName { get; set; } = string.Empty;
    public string ProductDescription { get; set; } = string.Empty;
    public int Quantity { get; set; } = 1;
    public double UnitPrice { get; set; } //giá của sản phẩm 
}

