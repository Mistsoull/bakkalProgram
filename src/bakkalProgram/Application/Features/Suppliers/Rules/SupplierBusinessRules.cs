using Application.Features.Suppliers.Constants;
using Application.Services.Repositories;
using NArchitecture.Core.Application.Rules;
using NArchitecture.Core.CrossCuttingConcerns.Exception.Types;
using NArchitecture.Core.Localization.Abstraction;
using Domain.Entities;

namespace Application.Features.Suppliers.Rules;

public class SupplierBusinessRules : BaseBusinessRules
{
    private readonly ISupplierRepository _supplierRepository;
    private readonly ILocalizationService _localizationService;

    public SupplierBusinessRules(ISupplierRepository supplierRepository, ILocalizationService localizationService)
    {
        _supplierRepository = supplierRepository;
        _localizationService = localizationService;
    }

    private async Task throwBusinessException(string messageKey)
    {
        string message = await _localizationService.GetLocalizedAsync(messageKey, SuppliersBusinessMessages.SectionName);
        throw new BusinessException(message);
    }

    public async Task SupplierShouldExistWhenSelected(Supplier? supplier)
    {
        if (supplier == null)
            await throwBusinessException(SuppliersBusinessMessages.SupplierNotExists);
    }

    public async Task SupplierIdShouldExistWhenSelected(Guid id, CancellationToken cancellationToken)
    {
        Supplier? supplier = await _supplierRepository.GetAsync(
            predicate: s => s.Id == id,
            enableTracking: false,
            cancellationToken: cancellationToken
        );
        await SupplierShouldExistWhenSelected(supplier);
    }
}