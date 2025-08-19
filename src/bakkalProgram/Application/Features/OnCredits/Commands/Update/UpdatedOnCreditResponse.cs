using NArchitecture.Core.Application.Responses;

namespace Application.Features.OnCredits.Commands.Update;

public class UpdatedOnCreditResponse : IResponse
{
    public Guid Id { get; set; }
    public string EmployeeName { get; set; }
    public string Note { get; set; }
    public bool IsPaid { get; set; }
    public double TotalAmount { get; set; }

}