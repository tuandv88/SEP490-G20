using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Community.Application.Models.Categories.Commands.RemoveCategoryById;
public record RemoveCategoryByIdResult(bool IsSuccess);
public record RemoveCategoryByIdCommand(Guid Id) : ICommand<RemoveCategoryByIdResult>;
