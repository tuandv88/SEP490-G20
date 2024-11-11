using Community.Application.Models.Categories.Dtos;

namespace Community.Application.Models.Categories.Commands.UpdateCategory;

public record UpdateCategoryCommand(UpdateCategoryDto UpdateCategoryDto) : ICommand<UpdateCategoryResult>;
public record UpdateCategoryResult(bool IsSuccess, string Message);

public class UpdateCategoryCommandValidator : AbstractValidator<UpdateCategoryCommand>
{
    public UpdateCategoryCommandValidator()
    {
        RuleFor(x => x.UpdateCategoryDto.Id)
            .NotEmpty().WithMessage("Category ID must not be empty.");

        RuleFor(x => x.UpdateCategoryDto.Name)
            .NotEmpty().WithMessage("Category name must not be empty.");

        RuleFor(x => x.UpdateCategoryDto.Description)
            .NotEmpty().WithMessage("Description must not be empty.");

        RuleFor(x => x.UpdateCategoryDto.IsActive)
            .NotNull().WithMessage("IsActive status must not be null.");
    }
}