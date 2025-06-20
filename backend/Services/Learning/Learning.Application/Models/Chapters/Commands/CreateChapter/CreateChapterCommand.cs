﻿using Learning.Application.Models.Chapters.Dtos;
using Microsoft.AspNetCore.Authorization;

namespace Learning.Application.Models.Chapters.Commands.CreateChapter;

[Authorize($"{PoliciesType.Administrator}")]
public record CreateChapterCommand : ICommand<CreateChapterResult> {
    public required Guid CourseId;
    public required CreateChapterDto CreateChapterDto;
}
public record CreateChapterResult(Guid Id);

public class CreateChapterCommandValidator : AbstractValidator<CreateChapterCommand> {
    public CreateChapterCommandValidator() {
        RuleFor(x => x.CreateChapterDto.Title)
            .NotNull()
            .NotEmpty().WithMessage("Title is required.");

        RuleFor(x => x.CreateChapterDto.Description)
            .NotNull()
            .NotEmpty().WithMessage("Description is required.");
    }
}
