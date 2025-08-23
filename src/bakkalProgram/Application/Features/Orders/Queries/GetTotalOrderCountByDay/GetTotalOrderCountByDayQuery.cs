using Application.Services.Orders;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.Features.Orders.Queries.GetTotalOrderCountByDay
{
    public class GetTotalOrderCountByDayQuery : IRequest<GetTotalOrderCountByDayResponse>
    {
        public DateTime Date { get; set; }

        public class GetTotalOrderCountByDayQueryHandler : IRequestHandler<GetTotalOrderCountByDayQuery, GetTotalOrderCountByDayResponse>
        {
            private readonly IOrderService _orderService;

            public GetTotalOrderCountByDayQueryHandler(IOrderService orderService)
            {
                _orderService = orderService;
            }

            public async Task<GetTotalOrderCountByDayResponse> Handle(GetTotalOrderCountByDayQuery request, CancellationToken cancellationToken)
            {
                int totalOrderCount = await _orderService.GetTotalOrderCountByDayAsync(request.Date);

                return new GetTotalOrderCountByDayResponse
                {
                    TotalOrderCount = totalOrderCount
                };
            }
        }
    }
}