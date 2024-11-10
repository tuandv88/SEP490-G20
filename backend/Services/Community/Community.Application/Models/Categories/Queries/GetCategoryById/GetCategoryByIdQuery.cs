using Community.Application.Models.Categories.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Community.Application.Models.Categories.Queries.GetCategoryById
{

    public record GetCategoryByIdResult(CategoryDto CategoryDto);

    public record GetCategoryByIdQuery(Guid Id) : IQuery<GetCategoryByIdResult>;


}
