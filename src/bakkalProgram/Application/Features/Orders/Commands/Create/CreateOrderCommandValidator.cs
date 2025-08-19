using FluentValidation;

namespace Application.Features.Orders.Commands.Create;

public class CreateOrderCommandValidator : AbstractValidator<CreateOrderCommand>
{
    public CreateOrderCommandValidator()
    {
        RuleFor(c => c.ProductName).NotEmpty();
        RuleFor(c => c.Quantity).NotEmpty();
        RuleFor(c => c.CustomerName).NotEmpty();
        RuleFor(c => c.DeliveryDate).NotEmpty();

    }
}