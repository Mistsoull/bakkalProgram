using NArchitecture.Core.Application.Responses;

namespace Application.Features.Orders.Commands.Create;

public class CreatedOrderResponse : IResponse
{
    public Guid Id { get; set; }
    public required string ProductName { get; set; }
    public int Quantity { get; set; }
    public required string CustomerName { get; set; }
    public string? CustomerSurname { get; set; }
    public DateTime DeliveryDate { get; set; }
    public bool isPaid { get; set; }
    public bool IsDelivered { get; set; }

}