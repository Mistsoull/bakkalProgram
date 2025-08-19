using Application.Features.OnCredits.Constants;
using Application.Services.Repositories;
using NArchitecture.Core.Application.Rules;
using NArchitecture.Core.CrossCuttingConcerns.Exception.Types;
using NArchitecture.Core.Localization.Abstraction;
using Domain.Entities;

namespace Application.Features.OnCredits.Rules;

public class OnCreditBusinessRules : BaseBusinessRules
{
    private readonly IOnCreditRepository _onCreditRepository;
    private readonly ILocalizationService _localizationService;

    public OnCreditBusinessRules(IOnCreditRepository onCreditRepository, ILocalizationService localizationService)
    {
        _onCreditRepository = onCreditRepository;
        _localizationService = localizationService;
    }

    private async Task throwBusinessException(string messageKey)
    {
        string message = await _localizationService.GetLocalizedAsync(messageKey, OnCreditsBusinessMessages.SectionName);
        throw new BusinessException(message);
    }

    public async Task OnCreditShouldExistWhenSelected(OnCredit? onCredit)
    {
        if (onCredit == null)
            await throwBusinessException(OnCreditsBusinessMessages.OnCreditNotExists);
    }

    public async Task OnCreditIdShouldExistWhenSelected(Guid id, CancellationToken cancellationToken)
    {
        OnCredit? onCredit = await _onCreditRepository.GetAsync(
            predicate: oc => oc.Id == id,
            enableTracking: false,
            cancellationToken: cancellationToken
        );
        await OnCreditShouldExistWhenSelected(onCredit);
    }
}