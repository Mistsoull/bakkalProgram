using Application.Features.ProcurementOrders.Constants;
using Application.Services.Repositories;
using NArchitecture.Core.Application.Rules;
using NArchitecture.Core.CrossCuttingConcerns.Exception.Types;
using NArchitecture.Core.Localization.Abstraction;
using Domain.Entities;

namespace Application.Features.ProcurementOrders.Rules;

public class ProcurementOrderBusinessRules : BaseBusinessRules
{
    private readonly IProcurementOrderRepository _procurementOrderRepository;
    private readonly ILocalizationService _localizationService;

    public ProcurementOrderBusinessRules(IProcurementOrderRepository procurementOrderRepository, ILocalizationService localizationService)
    {
        _procurementOrderRepository = procurementOrderRepository;
        _localizationService = localizationService;
    }

    private async Task throwBusinessException(string messageKey)
    {
        string message = await _localizationService.GetLocalizedAsync(messageKey, ProcurementOrdersBusinessMessages.SectionName);
        throw new BusinessException(message);
    }

    public async Task ProcurementOrderShouldExistWhenSelected(ProcurementOrder? procurementOrder)
    {
        if (procurementOrder == null)
            await throwBusinessException(ProcurementOrdersBusinessMessages.ProcurementOrderNotExists);
    }

    public async Task ProcurementOrderIdShouldExistWhenSelected(Guid id, CancellationToken cancellationToken)
    {
        ProcurementOrder? procurementOrder = await _procurementOrderRepository.GetAsync(
            predicate: po => po.Id == id,
            enableTracking: false,
            cancellationToken: cancellationToken
        );
        await ProcurementOrderShouldExistWhenSelected(procurementOrder);
    }
}