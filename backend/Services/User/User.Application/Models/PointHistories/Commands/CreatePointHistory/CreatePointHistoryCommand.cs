using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using User.Application.Models.Dtos;


namespace User.Application.Models.PointHistories.Commands.CreatePointHistory
{
    public record CreatePointHistoryResult(Guid Id);
    public record CreatePointHistoryCommand : IRequest<CreatePointHistoryResult>
    {
        public required Guid UserId { get; set; }
        public required CreatePointHistoryDto CreatePointHistoryDto { get; set; }
    }

   
}
