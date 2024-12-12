namespace Community.Application.Models.Flags.Dtos;

public record CreateFlagDto(
    Guid IdDiscussion, // ID của flag
    string ViolationLevel = "None",
    string Reason = ""
    );
