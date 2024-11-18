using Community.Application.Models.Categories.Dtos;

namespace Community.Application.Models.Categories.Commands.CreateCategory;

public record CreateCategoryCommand(CreateCategoryDto CreateCategoryDto) : ICommand<CreateCategoryResult>;
public record CreateCategoryResult(Guid? Id, bool IsSuccess, string Message);

public class CreateCategoryCommandValidator : AbstractValidator<CreateCategoryCommand>
{
    public CreateCategoryCommandValidator()
    {
        RuleFor(x => x.CreateCategoryDto.Name)
            .NotEmpty().WithMessage("Category name must not be empty.");

        RuleFor(x => x.CreateCategoryDto.Description)
            .NotEmpty().WithMessage("Description must not be empty.");

        RuleFor(x => x.CreateCategoryDto.IsActive)
            .NotNull().WithMessage("IsActive status must not be null.");
    }
}