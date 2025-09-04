using FluentValidation;

namespace Application.Features.ProcurementOrders.Commands.Update;

public class UpdateProcurementOrderCommandValidator : AbstractValidator<UpdateProcurementOrderCommand>
{
    public UpdateProcurementOrderCommandValidator()
    {
        RuleFor(c => c.Id).NotEmpty();
        RuleFor(c => c.SupplierName).NotEmpty();
        RuleFor(c => c.ProductName).NotEmpty();
        RuleFor(c => c.Amount).NotEmpty();
        RuleFor(c => c.OrderDate).NotEmpty();
        RuleFor(c => c.IsPaid).NotEmpty();
    }
}