using NArchitecture.Core.Application.Responses;

namespace Application.Features.OnCredits.Commands.Create;

public class CreatedOnCreditResponse : IResponse
{
    public Guid Id { get; set; }
    public string EmployeeName { get; set; }
    public string Note { get; set; }
    public bool IsPaid { get; set; }
    public double TotalAmount { get; set; }

}