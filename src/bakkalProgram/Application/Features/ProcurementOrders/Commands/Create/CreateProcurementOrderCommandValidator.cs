using FluentValidation;

namespace Application.Features.ProcurementOrders.Commands.Create;

public class CreateProcurementOrderCommandValidator : AbstractValidator<CreateProcurementOrderCommand>
{
    public CreateProcurementOrderCommandValidator()
    {
        RuleFor(c => c.SupplierName).NotEmpty().MaximumLength(200);
        RuleFor(c => c.Items).NotEmpty().WithMessage("En az bir ürün eklemelisiniz");
        
        RuleForEach(c => c.Items).ChildRules(item =>
        {
            item.RuleFor(i => i.ProductName).NotEmpty().MaximumLength(200);
            item.RuleFor(i => i.Quantity).GreaterThan(0).WithMessage("Miktar 0'dan büyük olmalıdır");
            // UnitPrice validation tamamen kaldırıldı
            item.RuleFor(i => i.Notes).MaximumLength(500);
        });
        
        RuleFor(c => c.Notes).MaximumLength(1000);
    }
}