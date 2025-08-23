using Application.Services.Orders;
using AutoMapper;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.Features.Orders.Queries.GetListGetTodaysOrdersList
{
    public class GetTodaysOrdersQuery : IRequest<List<GetTodaysOrdersListItemDto>>
    {
        public DateTime Date { get; set; }
        public class GetTodaysOrdersQueryHandler : IRequestHandler<GetTodaysOrdersQuery, List<GetTodaysOrdersListItemDto>>
        {
            private readonly IOrderService _orderService;
            private readonly IMapper _mapper;

            public GetTodaysOrdersQueryHandler(IOrderService orderService, IMapper mapper)
            {
                _orderService = orderService;
                _mapper = mapper;
            }

            public async Task<List<GetTodaysOrdersListItemDto>> Handle(GetTodaysOrdersQuery request, CancellationToken cancellationToken)
            {
                var orders = await _orderService.GetTodaysOrdersAsync(request.Date);
                var ordersDto = _mapper.Map<List<GetTodaysOrdersListItemDto>>(orders);
                return ordersDto;

                
            }
        }
    }
}