using FluentValidation;

namespace Application.Features.Employees.Commands.Create;

public class CreateEmployeeCommandValidator : AbstractValidator<CreateEmployeeCommand>
{
    public CreateEmployeeCommandValidator()
    {
        RuleFor(c => c.Name).NotEmpty();
        RuleFor(c => c.Surname).NotEmpty();
        RuleFor(c => c.PhoneNumber).NotEmpty();
    }
}