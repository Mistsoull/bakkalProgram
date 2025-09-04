using NArchitecture.Core.Application.Responses;
using Application.Features.Orders.Queries.GetList;

namespace Application.Features.Orders.Queries.GetById;

public class GetByIdOrderResponse : IResponse
{
    public Guid Id { get; set; }
    
    // Obsolete single product fields (for backward compatibility)
    [Obsolete("Use Items collection instead")]
    public string? ProductName { get; set; }
    [Obsolete("Use Items collection instead")]
    public int Quantity { get; set; }
    
    // New multi-item support
    public ICollection<OrderItemDto> Items { get; set; } = new List<OrderItemDto>();
    
    public required string CustomerName { get; set; }
    public string? CustomerSurname { get; set; }
    public DateTime DeliveryDate { get; set; }
    public bool IsDelivered { get; set; }
    public bool IsPaid { get; set; }
}