using NArchitecture.Core.Application.Responses;

namespace Application.Features.Suppliers.Queries.GetById;

public class GetByIdSupplierResponse : IResponse
{
    public Guid Id { get; set; }
    public string NameSurname { get; set; }
    public string CompanyName { get; set; }
    public string PhoneNumber { get; set; }
    public string Note { get; set; }
}