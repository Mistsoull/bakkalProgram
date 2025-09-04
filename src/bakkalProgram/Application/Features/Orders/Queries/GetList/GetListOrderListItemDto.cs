using NArchitecture.Core.Application.Dtos;

namespace Application.Features.Orders.Queries.GetList;

public class GetListOrderListItemDto : IDto
{
    public Guid Id { get; set; }
    public string CustomerName { get; set; }
    public string? CustomerSurname { get; set; }
    public DateTime DeliveryDate { get; set; }
    public bool isPaid { get; set; }
    public bool IsDelivered { get; set; }
    public List<OrderItemDto> Items { get; set; } = new();
}

public class OrderItemDto : IDto
{
    public Guid Id { get; set; }
    public Guid? ProductId { get; set; }
    public string ProductName { get; set; }
    public int Quantity { get; set; }
    public decimal? UnitPrice { get; set; }
}