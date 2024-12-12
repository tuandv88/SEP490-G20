namespace Community.Application.Models.Flags.Dtos;
public record UpdateFlagDto(
    Guid Id, // ID của flag
    string ViolationLevel = "None",
    string Reason = ""
);
