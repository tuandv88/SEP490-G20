using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Learning.Application.Models.Videos.Dtos;
public record CreateVideoDto(IFormFile File, double Duration);

