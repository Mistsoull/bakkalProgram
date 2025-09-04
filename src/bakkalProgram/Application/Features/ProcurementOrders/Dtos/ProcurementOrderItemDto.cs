namespace Application.Features.ProcurementOrders.Dtos;

public class ProcurementOrderItemDto
{
    public string ProductName { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }
    public decimal TotalPrice { get; set; }
    public string? Notes { get; set; }
    public Guid? ProductId { get; set; }
}

public class CreateProcurementOrderItemDto
{
    public string ProductName { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public decimal? UnitPrice { get; set; } // Artık nullable ve opsiyonel
    public string? Notes { get; set; }
    public Guid? ProductId { get; set; }
}
