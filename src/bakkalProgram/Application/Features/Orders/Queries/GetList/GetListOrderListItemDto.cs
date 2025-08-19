using NArchitecture.Core.Application.Dtos;

namespace Application.Features.Orders.Queries.GetList;

public class GetListOrderListItemDto : IDto
{
    public Guid Id { get; set; }
    public string ProductName { get; set; }
    public int Quantity { get; set; }
    public string CustomerName { get; set; }
    public DateTime DeliveryDate { get; set; }
    public bool IsDelivered { get; set; }
}