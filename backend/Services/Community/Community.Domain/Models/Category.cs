namespace Community.Domain.Models
{
    public class Category : Aggregate<CategoryId>
    {
        public List<Discussion> Discussions = new();
        public string Name { get; set; } = default!;         // Tên chuyên mục (ví dụ: Interview, Career)
        public string Description { get; set; } = default!;  // Mô tả chuyên mục
        public bool IsActive { get; set; }                   // Trạng thái hoạt động của chuyên mục

        // Phương thức tạo mới một Category
        public static Category Create(CategoryId categoryId, string name, string description, bool isActive)
        {
            var category = new Category
            {
                Id = categoryId,
                Name = name,
                Description = description,
                IsActive = isActive
            };

            category.AddDomainEvent(new CategoryCreatedEvent(category));
            return category;
        }

        // Phương thức thêm thảo luận vào Category
        public void AddDiscussion(Discussion discussion)
        {
            Discussions.Add(discussion);
        }

        // Phương thức cập nhật thông tin Category
        public void Update(string name, string description, bool isActive)
        {
            Name = name;
            Description = description;
            IsActive = isActive;

            // TODO: Add a domain event for updating Category if needed
        }
    }
}



