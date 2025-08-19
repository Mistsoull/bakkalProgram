using FluentValidation;

namespace Application.Features.OnCredits.Commands.Delete;

public class DeleteOnCreditCommandValidator : AbstractValidator<DeleteOnCreditCommand>
{
    public DeleteOnCreditCommandValidator()
    {
        RuleFor(c => c.Id).NotEmpty();
    }
}