using Application.Features.ProcurementOrders.Constants;
using Application.Features.ProcurementOrders.Rules;
using Application.Services.Repositories;
using AutoMapper;
using Domain.Entities;
using MediatR;

namespace Application.Features.ProcurementOrders.Commands.Delete;

public class DeleteProcurementOrderCommand : IRequest<DeletedProcurementOrderResponse>
{
    public Guid Id { get; set; }

    public class DeleteProcurementOrderCommandHandler : IRequestHandler<DeleteProcurementOrderCommand, DeletedProcurementOrderResponse>
    {
        private readonly IMapper _mapper;
        private readonly IProcurementOrderRepository _procurementOrderRepository;
        private readonly ProcurementOrderBusinessRules _procurementOrderBusinessRules;

        public DeleteProcurementOrderCommandHandler(IMapper mapper, IProcurementOrderRepository procurementOrderRepository,
                                         ProcurementOrderBusinessRules procurementOrderBusinessRules)
        {
            _mapper = mapper;
            _procurementOrderRepository = procurementOrderRepository;
            _procurementOrderBusinessRules = procurementOrderBusinessRules;
        }

        public async Task<DeletedProcurementOrderResponse> Handle(DeleteProcurementOrderCommand request, CancellationToken cancellationToken)
        {
            ProcurementOrder? procurementOrder = await _procurementOrderRepository.GetAsync(predicate: po => po.Id == request.Id, cancellationToken: cancellationToken);
            await _procurementOrderBusinessRules.ProcurementOrderShouldExistWhenSelected(procurementOrder);

            await _procurementOrderRepository.DeleteAsync(procurementOrder!);

            DeletedProcurementOrderResponse response = _mapper.Map<DeletedProcurementOrderResponse>(procurementOrder);
            return response;
        }
    }
}