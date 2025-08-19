using FluentValidation;

namespace Application.Features.Orders.Commands.Update;

public class UpdateOrderCommandValidator : AbstractValidator<UpdateOrderCommand>
{
    public UpdateOrderCommandValidator()
    {
        RuleFor(c => c.Id).NotEmpty();
        RuleFor(c => c.ProductName).NotEmpty();
        RuleFor(c => c.Quantity).NotEmpty();
        RuleFor(c => c.CustomerName).NotEmpty();
        RuleFor(c => c.DeliveryDate).NotEmpty();
        RuleFor(c => c.IsDelivered).NotEmpty();
    }
}