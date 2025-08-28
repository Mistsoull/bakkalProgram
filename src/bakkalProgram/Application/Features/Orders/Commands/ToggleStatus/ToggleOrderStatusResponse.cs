using NArchitecture.Core.Application.Responses;

namespace Application.Features.Orders.Commands.ToggleStatus;

public class ToggleOrderStatusResponse : IResponse
{
    public Guid Id { get; set; }
    public string ProductName { get; set; }
    public int Quantity { get; set; }
    public string CustomerName { get; set; }
    public string? CustomerSurname { get; set; }
    public DateTime DeliveryDate { get; set; }
    public bool IsDelivered { get; set; }
    public bool IsPaid { get; set; }
}
