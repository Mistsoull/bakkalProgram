using FluentValidation;

namespace Application.Features.Customers.Commands.Update;

public class UpdateCustomerCommandValidator : AbstractValidator<UpdateCustomerCommand>
{
    public UpdateCustomerCommandValidator()
    {
        RuleFor(c => c.Id).NotEmpty();
        RuleFor(c => c.Name).NotEmpty();
        RuleFor(c => c.Surname).NotEmpty();
        RuleFor(c => c.PhoneNumber).NotEmpty();
        RuleFor(c => c.Note).NotEmpty();
    }
}