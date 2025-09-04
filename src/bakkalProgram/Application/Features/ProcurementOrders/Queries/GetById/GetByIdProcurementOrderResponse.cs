using Application.Features.ProcurementOrders.Dtos;
using NArchitecture.Core.Application.Responses;

namespace Application.Features.ProcurementOrders.Queries.GetById;

public class GetByIdProcurementOrderResponse : IResponse
{
    public Guid Id { get; set; }
    public string SupplierName { get; set; } = string.Empty;
    public decimal TotalAmount { get; set; }
    public DateTime OrderDate { get; set; }
    public DateTime? ExpectedDeliveryDate { get; set; }
    public bool IsReceived { get; set; }
    public bool IsPaid { get; set; }
    public string? Notes { get; set; }
    public Guid? SupplierId { get; set; }
    public List<ProcurementOrderItemDto> Items { get; set; } = new List<ProcurementOrderItemDto>();
}