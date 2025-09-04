using NArchitecture.Core.Application.Dtos;

namespace Application.Features.Suppliers.Queries.GetList;

public class GetListSupplierListItemDto : IDto
{
    public Guid Id { get; set; }
    public string NameSurname { get; set; }
    public string CompanyName { get; set; }
    public string PhoneNumber { get; set; }
    public string Note { get; set; }
}