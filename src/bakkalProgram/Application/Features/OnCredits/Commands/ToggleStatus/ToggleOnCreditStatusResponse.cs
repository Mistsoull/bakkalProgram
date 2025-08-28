using NArchitecture.Core.Application.Responses;

namespace Application.Features.OnCredits.Commands.ToggleStatus;

public class ToggleOnCreditStatusResponse : IResponse
{
    public Guid Id { get; set; }
    public bool IsPaid { get; set; }
    public DateTime UpdatedDate { get; set; }
}
