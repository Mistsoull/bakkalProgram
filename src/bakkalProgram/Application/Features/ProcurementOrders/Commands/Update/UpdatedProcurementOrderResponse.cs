using NArchitecture.Core.Application.Responses;

namespace Application.Features.ProcurementOrders.Commands.Update;

public class UpdatedProcurementOrderResponse : IResponse
{
    public Guid Id { get; set; }
    public string SupplierName { get; set; }
    public string ProductName { get; set; }
    public string Amount { get; set; }
    public DateTime OrderDate { get; set; }
    public bool IsPaid { get; set; }
    public string? Notes { get; set; }
    public Guid? SupplierId { get; set; }
}