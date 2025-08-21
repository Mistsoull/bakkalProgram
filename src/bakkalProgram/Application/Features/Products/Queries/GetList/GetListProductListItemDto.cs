using NArchitecture.Core.Application.Dtos;

namespace Application.Features.Products.Queries.GetList;

public class GetListProductListItemDto : IDto
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public double Price { get; set; }
    public Guid CategoryId { get; set; }
    public string CategoryName { get; set; }

}