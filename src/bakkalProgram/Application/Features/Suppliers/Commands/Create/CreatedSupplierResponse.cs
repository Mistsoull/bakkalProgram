using NArchitecture.Core.Application.Responses;

namespace Application.Features.Suppliers.Commands.Create;

public class CreatedSupplierResponse : IResponse
{
    public Guid Id { get; set; }
    public string NameSurname { get; set; }
    public string CompanyName { get; set; }
    public string PhoneNumber { get; set; }
    public string Note { get; set; }
}