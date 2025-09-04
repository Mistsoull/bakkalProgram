using Application.Features.ProcurementOrders.Dtos;
using Application.Features.ProcurementOrders.Rules;
using Application.Services.Repositories;
using AutoMapper;
using Domain.Entities;
using MediatR;

namespace Application.Features.ProcurementOrders.Commands.Create;

public class CreateProcurementOrderCommand : IRequest<CreatedProcurementOrderResponse>
{
    public required string SupplierName { get; set; }
    public DateTime OrderDate { get; set; } = DateTime.Now;
    public DateTime? ExpectedDeliveryDate { get; set; }
    public string? Notes { get; set; }
    public Guid? SupplierId { get; set; }
    public required List<CreateProcurementOrderItemDto> Items { get; set; }

    public class CreateProcurementOrderCommandHandler : IRequestHandler<CreateProcurementOrderCommand, CreatedProcurementOrderResponse>
    {
        private readonly IMapper _mapper;
        private readonly IProcurementOrderRepository _procurementOrderRepository;
        private readonly ProcurementOrderBusinessRules _procurementOrderBusinessRules;

        public CreateProcurementOrderCommandHandler(IMapper mapper, IProcurementOrderRepository procurementOrderRepository,
                                         ProcurementOrderBusinessRules procurementOrderBusinessRules)
        {
            _mapper = mapper;
            _procurementOrderRepository = procurementOrderRepository;
            _procurementOrderBusinessRules = procurementOrderBusinessRules;
        }

        public async Task<CreatedProcurementOrderResponse> Handle(CreateProcurementOrderCommand request, CancellationToken cancellationToken)
        {
            // Yeni ProcurementOrder oluştur
            ProcurementOrder procurementOrder = new ProcurementOrder(
                request.SupplierName,
                request.Notes,
                request.SupplierId,
                request.ExpectedDeliveryDate,
                request.OrderDate
            );

            // Items'ları ekle
            foreach (var itemDto in request.Items)
            {
                procurementOrder.AddItem(
                    itemDto.ProductName,
                    itemDto.Quantity,
                    itemDto.UnitPrice ?? 0, // Eğer birim fiyat yoksa 0 kullan
                    itemDto.Notes,
                    itemDto.ProductId
                );
            }

            await _procurementOrderRepository.AddAsync(procurementOrder);

            CreatedProcurementOrderResponse response = _mapper.Map<CreatedProcurementOrderResponse>(procurementOrder);
            return response;
        }
    }
}