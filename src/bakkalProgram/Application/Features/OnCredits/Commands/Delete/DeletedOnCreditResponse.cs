using NArchitecture.Core.Application.Responses;

namespace Application.Features.OnCredits.Commands.Delete;

public class DeletedOnCreditResponse : IResponse
{
    public Guid Id { get; set; }
}