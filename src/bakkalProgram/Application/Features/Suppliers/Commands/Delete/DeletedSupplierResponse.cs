using NArchitecture.Core.Application.Responses;

namespace Application.Features.Suppliers.Commands.Delete;

public class DeletedSupplierResponse : IResponse
{
    public Guid Id { get; set; }
}