using Application.Features.Employees.Rules;
using Application.Services.Repositories;
using AutoMapper;
using Domain.Entities;
using MediatR;

namespace Application.Features.Employees.Queries.GetById;

public class GetByIdEmployeeQuery : IRequest<GetByIdEmployeeResponse>
{
    public Guid Id { get; set; }

    public class GetByIdEmployeeQueryHandler : IRequestHandler<GetByIdEmployeeQuery, GetByIdEmployeeResponse>
    {
        private readonly IMapper _mapper;
        private readonly IEmployeeRepository _employeeRepository;
        private readonly EmployeeBusinessRules _employeeBusinessRules;

        public GetByIdEmployeeQueryHandler(IMapper mapper, IEmployeeRepository employeeRepository, EmployeeBusinessRules employeeBusinessRules)
        {
            _mapper = mapper;
            _employeeRepository = employeeRepository;
            _employeeBusinessRules = employeeBusinessRules;
        }

        public async Task<GetByIdEmployeeResponse> Handle(GetByIdEmployeeQuery request, CancellationToken cancellationToken)
        {
            Employee? employee = await _employeeRepository.GetAsync(predicate: e => e.Id == request.Id, cancellationToken: cancellationToken);
            await _employeeBusinessRules.EmployeeShouldExistWhenSelected(employee);

            GetByIdEmployeeResponse response = _mapper.Map<GetByIdEmployeeResponse>(employee);
            return response;
        }
    }
}