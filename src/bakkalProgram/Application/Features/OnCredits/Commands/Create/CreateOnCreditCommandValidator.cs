using FluentValidation;

namespace Application.Features.OnCredits.Commands.Create;

public class CreateOnCreditCommandValidator : AbstractValidator<CreateOnCreditCommand>
{
    public CreateOnCreditCommandValidator()
    {
        RuleFor(c => c.EmployeeName).NotEmpty();
        RuleFor(c => c.Note).NotEmpty();
        RuleFor(c => c.IsPaid).NotEmpty();
        RuleFor(c => c.TotalAmount).NotEmpty();
    }
}