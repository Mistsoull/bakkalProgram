using Application.Features.ProcurementOrders.Rules;
using Application.Services.Repositories;
using AutoMapper;
using Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.ProcurementOrders.Queries.GetById;

public class GetByIdProcurementOrderQuery : IRequest<GetByIdProcurementOrderResponse>
{
    public Guid Id { get; set; }

    public class GetByIdProcurementOrderQueryHandler : IRequestHandler<GetByIdProcurementOrderQuery, GetByIdProcurementOrderResponse>
    {
        private readonly IMapper _mapper;
        private readonly IProcurementOrderRepository _procurementOrderRepository;
        private readonly ProcurementOrderBusinessRules _procurementOrderBusinessRules;

        public GetByIdProcurementOrderQueryHandler(IMapper mapper, IProcurementOrderRepository procurementOrderRepository, ProcurementOrderBusinessRules procurementOrderBusinessRules)
        {
            _mapper = mapper;
            _procurementOrderRepository = procurementOrderRepository;
            _procurementOrderBusinessRules = procurementOrderBusinessRules;
        }

        public async Task<GetByIdProcurementOrderResponse> Handle(GetByIdProcurementOrderQuery request, CancellationToken cancellationToken)
        {
            ProcurementOrder? procurementOrder = await _procurementOrderRepository.GetAsync(
                predicate: po => po.Id == request.Id, 
                include: po => po.Include(p => p.Items),
                cancellationToken: cancellationToken);
            await _procurementOrderBusinessRules.ProcurementOrderShouldExistWhenSelected(procurementOrder);

            GetByIdProcurementOrderResponse response = _mapper.Map<GetByIdProcurementOrderResponse>(procurementOrder);
            return response;
        }
    }
}