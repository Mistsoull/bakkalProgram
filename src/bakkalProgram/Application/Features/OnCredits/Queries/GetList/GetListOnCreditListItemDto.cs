using NArchitecture.Core.Application.Dtos;

namespace Application.Features.OnCredits.Queries.GetList;

public class GetListOnCreditListItemDto : IDto
{
    public Guid Id { get; set; }
    public string EmployeeName { get; set; }
    public string Note { get; set; }
    public bool IsPaid { get; set; }
    public double TotalAmount { get; set; }
}