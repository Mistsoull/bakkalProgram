using Application.Services.Repositories;
using AutoMapper;
using Domain.Entities;
using NArchitecture.Core.Application.Requests;
using NArchitecture.Core.Application.Responses;
using NArchitecture.Core.Persistence.Paging;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.ProcurementOrders.Queries.GetList;

public class GetListProcurementOrderQuery : IRequest<GetListResponse<GetListProcurementOrderListItemDto>>
{
    public PageRequest PageRequest { get; set; }

    public class GetListProcurementOrderQueryHandler : IRequestHandler<GetListProcurementOrderQuery, GetListResponse<GetListProcurementOrderListItemDto>>
    {
        private readonly IProcurementOrderRepository _procurementOrderRepository;
        private readonly IMapper _mapper;

        public GetListProcurementOrderQueryHandler(IProcurementOrderRepository procurementOrderRepository, IMapper mapper)
        {
            _procurementOrderRepository = procurementOrderRepository;
            _mapper = mapper;
        }

        public async Task<GetListResponse<GetListProcurementOrderListItemDto>> Handle(GetListProcurementOrderQuery request, CancellationToken cancellationToken)
        {
            IPaginate<ProcurementOrder> procurementOrders = await _procurementOrderRepository.GetListAsync(
                include: po => po.Include(p => p.Items),
                index: request.PageRequest.PageIndex,
                size: request.PageRequest.PageSize,
                cancellationToken: cancellationToken
            );

            GetListResponse<GetListProcurementOrderListItemDto> response = _mapper.Map<GetListResponse<GetListProcurementOrderListItemDto>>(procurementOrders);
            return response;
        }
    }
}