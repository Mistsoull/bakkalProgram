using FluentValidation;

namespace Application.Features.OnCredits.Commands.Create;

public class CreateOnCreditCommandValidator : AbstractValidator<CreateOnCreditCommand>
{
    public CreateOnCreditCommandValidator()
    {
        // Employee name required only if employee is selected (not customer)
        RuleFor(c => c.EmployeeName)
            .NotEmpty()
            .When(c => c.EmployeeId.HasValue || (!c.CustomerId.HasValue && !string.IsNullOrEmpty(c.EmployeeName)))
            .WithMessage("Çalışan seçildiğinde çalışan adı zorunludur.");

        // Customer name required only if customer is selected (not employee)  
        RuleFor(c => c.CustomerName)
            .NotEmpty()
            .When(c => c.CustomerId.HasValue || (!c.EmployeeId.HasValue && !string.IsNullOrEmpty(c.CustomerName)))
            .WithMessage("Müşteri seçildiğinde müşteri adı zorunludur.");

        // Either employee or customer must be selected
        RuleFor(c => c)
            .Must(c => c.EmployeeId.HasValue || c.CustomerId.HasValue || 
                       !string.IsNullOrEmpty(c.EmployeeName) || !string.IsNullOrEmpty(c.CustomerName))
            .WithMessage("En az bir çalışan veya müşteri seçilmelidir.");

        // Note is optional (nullable) - no validation needed
        
        // IsPaid is a boolean - always has a value (true/false), no validation needed
        
        // Total amount must be greater than 0
        RuleFor(c => c.TotalAmount)
            .GreaterThan(0)
            .WithMessage("Toplam tutar 0'dan büyük olmalıdır.");
    }
}