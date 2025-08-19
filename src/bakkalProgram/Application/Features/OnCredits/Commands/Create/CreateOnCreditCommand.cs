using Application.Features.OnCredits.Rules;
using Application.Services.Repositories;
using AutoMapper;
using Domain.Entities;
using MediatR;

namespace Application.Features.OnCredits.Commands.Create;

public class CreateOnCreditCommand : IRequest<CreatedOnCreditResponse>
{
    public required string EmployeeName { get; set; }
    public required string Note { get; set; }
    public required bool IsPaid { get; set; }
    public required double TotalAmount { get; set; }
    public Guid? EmployeeId { get; set; }

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

            await _onCreditRepository.AddAsync(onCredit);

            CreatedOnCreditResponse response = _mapper.Map<CreatedOnCreditResponse>(onCredit);
            return response;
        }
    }
}