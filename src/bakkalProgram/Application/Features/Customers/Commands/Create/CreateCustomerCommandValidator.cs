using FluentValidation;

namespace Application.Features.Customers.Commands.Create;

public class CreateCustomerCommandValidator : AbstractValidator<CreateCustomerCommand>
{
    public CreateCustomerCommandValidator()
    {
        RuleFor(c => c.Name).NotEmpty();
        RuleFor(c => c.Surname).NotEmpty();
        RuleFor(c => c.PhoneNumber).NotEmpty();
        RuleFor(c => c.Note).NotEmpty();
    }
}