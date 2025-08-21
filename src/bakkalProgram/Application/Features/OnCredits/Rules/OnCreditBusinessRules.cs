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
    private readonly ICustomerRepository _customerRepository;
    private readonly IEmployeeRepository _employeeRepository;

    public OnCreditBusinessRules(IOnCreditRepository onCreditRepository, ILocalizationService localizationService, ICustomerRepository customerRepository, IEmployeeRepository employeeRepository)
    {
        _onCreditRepository = onCreditRepository;
        _localizationService = localizationService;
        _customerRepository = customerRepository;
        _employeeRepository = employeeRepository;
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

    // Eğer customerId null veya boş ise customerName ve customerSurname kullanılır, aksi halde customerId ile eşleşen müşteri bulunur ve ad/soyad kullanılır.
    public async Task SetCustomerNameBasedOnCustomerId(Guid? customerId, string customerName, string? customerSurname, OnCredit onCredit)
    {
        if (customerId == null || customerId == Guid.Empty)
        {
            onCredit.CustomerName = customerName;
            onCredit.CustomerSurname = customerSurname;
            return;
        }

        Customer? customer = await _customerRepository.GetAsync(predicate: c => c.Id == customerId);
        if (customer != null)
        {
            onCredit.CustomerName = customer.Name;
            onCredit.CustomerSurname = customer.Surname;
        }
        else
        {
            onCredit.CustomerName = customerName;
            onCredit.CustomerSurname = customerSurname;
        }
    }

    // Eğer employeeId null veya boş ise employeeName ve employeeSurname kullanılır, aksi halde employeeId ile eşleşen çalışan bulunur ve ad/soyad kullanılır.
    public async Task SetEmployeeNameBasedOnEmployeeId(Guid? employeeId, string employeeName, string? employeeSurname, OnCredit onCredit)
    {
        if (employeeId == null || employeeId == Guid.Empty)
        {
            onCredit.EmployeeName = employeeName;
            onCredit.EmployeeSurname = employeeSurname;
            return;
        }

        Employee? employee = await _employeeRepository.GetAsync(predicate: e => e.Id == employeeId);
        if (employee != null)
        {
            onCredit.EmployeeName = employee.Name;
            onCredit.EmployeeSurname = employee.Surname;
        }
        else
        {
            onCredit.EmployeeName = employeeName;
            onCredit.EmployeeSurname = employeeSurname;
        }
    }


}