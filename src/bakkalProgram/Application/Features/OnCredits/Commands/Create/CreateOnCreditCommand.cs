using Application.Features.OnCredits.Rules;
using Application.Services.Repositories;
using AutoMapper;
using Domain.Entities;
using MediatR;

namespace Application.Features.OnCredits.Commands.Create;

public class CreateOnCreditCommand : IRequest<CreatedOnCreditResponse>
{
    public string? EmployeeName { get; set; }
    public string? EmployeeSurname { get; set; }
    public string? CustomerName { get; set; }
    public string? CustomerSurname { get; set; }
    public string? Note { get; set; }
    public required bool IsPaid { get; set; }
    public required double TotalAmount { get; set; }
    public Guid? EmployeeId { get; set; }
    public Guid? CustomerId { get; set; }
    public class CreateOnCreditCommandHandler : IRequestHandler<CreateOnCreditCommand, CreatedOnCreditResponse>
    {
        private readonly IMapper _mapper;
        private readonly IOnCreditRepository _onCreditRepository;
        private readonly OnCreditBusinessRules _onCreditBusinessRules;

        public CreateOnCreditCommandHandler(IMapper mapper, IOnCreditRepository onCreditRepository,
                                         OnCreditBusinessRules onCreditBusinessRules)
        {
            _mapper = mapper;
            _onCreditRepository = onCreditRepository;
            _onCreditBusinessRules = onCreditBusinessRules;
        }

        public async Task<CreatedOnCreditResponse> Handle(CreateOnCreditCommand request, CancellationToken cancellationToken)
        {
            OnCredit onCredit = _mapper.Map<OnCredit>(request);

            // Customer bilgilerini customerId'ye göre ayarla
            await _onCreditBusinessRules.SetCustomerNameBasedOnCustomerId(
                request.CustomerId, 
                request.CustomerName ?? string.Empty, 
                request.CustomerSurname, 
                onCredit
            );

            // Employee bilgilerini employeeId'ye göre ayarla
            await _onCreditBusinessRules.SetEmployeeNameBasedOnEmployeeId(
                request.EmployeeId, 
                request.EmployeeName ?? string.Empty, 
                request.EmployeeSurname, 
                onCredit
            );

            await _onCreditRepository.AddAsync(onCredit);

            CreatedOnCreditResponse response = _mapper.Map<CreatedOnCreditResponse>(onCredit);
            return response;
        }
    }
}