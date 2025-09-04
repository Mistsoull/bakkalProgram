using Application.Features.ProcurementOrders.Rules;
using Application.Services.Repositories;
using AutoMapper;
using Domain.Entities;
using MediatR;

namespace Application.Features.ProcurementOrders.Commands.Update;

public class UpdateProcurementOrderCommand : IRequest<UpdatedProcurementOrderResponse>
{
    public Guid Id { get; set; }
    public required string SupplierName { get; set; }
    public required string ProductName { get; set; }
    public required string Amount { get; set; }
    public required DateTime OrderDate { get; set; }
    public required bool IsPaid { get; set; }
    public string? Notes { get; set; }
    public Guid? SupplierId { get; set; }

    public class UpdateProcurementOrderCommandHandler : IRequestHandler<UpdateProcurementOrderCommand, UpdatedProcurementOrderResponse>
    {
        private readonly IMapper _mapper;
        private readonly IProcurementOrderRepository _procurementOrderRepository;
        private readonly ProcurementOrderBusinessRules _procurementOrderBusinessRules;

        public UpdateProcurementOrderCommandHandler(IMapper mapper, IProcurementOrderRepository procurementOrderRepository,
                                         ProcurementOrderBusinessRules procurementOrderBusinessRules)
        {
            _mapper = mapper;
            _procurementOrderRepository = procurementOrderRepository;
            _procurementOrderBusinessRules = procurementOrderBusinessRules;
        }

        public async Task<UpdatedProcurementOrderResponse> Handle(UpdateProcurementOrderCommand request, CancellationToken cancellationToken)
        {
            ProcurementOrder? procurementOrder = await _procurementOrderRepository.GetAsync(predicate: po => po.Id == request.Id, cancellationToken: cancellationToken);
            await _procurementOrderBusinessRules.ProcurementOrderShouldExistWhenSelected(procurementOrder);
            procurementOrder = _mapper.Map(request, procurementOrder);

            await _procurementOrderRepository.UpdateAsync(procurementOrder!);

            UpdatedProcurementOrderResponse response = _mapper.Map<UpdatedProcurementOrderResponse>(procurementOrder);
            return response;
        }
    }
}