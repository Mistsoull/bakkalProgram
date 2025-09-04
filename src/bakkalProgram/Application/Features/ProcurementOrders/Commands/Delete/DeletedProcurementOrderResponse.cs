using NArchitecture.Core.Application.Responses;

namespace Application.Features.ProcurementOrders.Commands.Delete;

public class DeletedProcurementOrderResponse : IResponse
{
    public Guid Id { get; set; }
}