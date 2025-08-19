using FluentValidation;

namespace Application.Features.OnCredits.Commands.Update;

public class UpdateOnCreditCommandValidator : AbstractValidator<UpdateOnCreditCommand>
{
    public UpdateOnCreditCommandValidator()
    {
        RuleFor(c => c.Id).NotEmpty();
        RuleFor(c => c.EmployeeName).NotEmpty();
        RuleFor(c => c.Note).NotEmpty();
        RuleFor(c => c.IsPaid).NotEmpty();
        RuleFor(c => c.TotalAmount).NotEmpty();
    }
}