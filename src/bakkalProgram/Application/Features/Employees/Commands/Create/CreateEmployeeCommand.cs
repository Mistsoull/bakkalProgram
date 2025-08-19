using Application.Features.Employees.Rules;
using Application.Services.Repositories;
using AutoMapper;
using Domain.Entities;
using MediatR;

namespace Application.Features.Employees.Commands.Create;

public class CreateEmployeeCommand : IRequest<CreatedEmployeeResponse>
{
    public required string Name { get; set; }
    public required string Surname { get; set; }
    public required string PhoneNumber { get; set; }

    public class CreateEmployeeCommandHandler : IRequestHandler<CreateEmployeeCommand, CreatedEmployeeResponse>
    {
        private readonly IMapper _mapper;
        private readonly IEmployeeRepository _employeeRepository;
        private readonly EmployeeBusinessRules _employeeBusinessRules;

        public CreateEmployeeCommandHandler(IMapper mapper, IEmployeeRepository employeeRepository,
                                         EmployeeBusinessRules employeeBusinessRules)
        {
            _mapper = mapper;
            _employeeRepository = employeeRepository;
            _employeeBusinessRules = employeeBusinessRules;
        }

        public async Task<CreatedEmployeeResponse> Handle(CreateEmployeeCommand request, CancellationToken cancellationToken)
        {
            Employee employee = _mapper.Map<Employee>(request);

            await _employeeRepository.AddAsync(employee);

            CreatedEmployeeResponse response = _mapper.Map<CreatedEmployeeResponse>(employee);
            return response;
        }
    }
}