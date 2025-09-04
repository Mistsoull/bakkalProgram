using FluentValidation;

namespace Application.Features.ProcurementOrders.Commands.Delete;

public class DeleteProcurementOrderCommandValidator : AbstractValidator<DeleteProcurementOrderCommand>
{
    public DeleteProcurementOrderCommandValidator()
    {
        RuleFor(c => c.Id).NotEmpty();
    }
}