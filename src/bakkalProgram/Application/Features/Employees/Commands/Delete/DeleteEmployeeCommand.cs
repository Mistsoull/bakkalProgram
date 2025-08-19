using Application.Features.Employees.Constants;
using Application.Features.Employees.Rules;
using Application.Services.Repositories;
using AutoMapper;
using Domain.Entities;
using MediatR;

namespace Application.Features.Employees.Commands.Delete;

public class DeleteEmployeeCommand : IRequest<DeletedEmployeeResponse>
{
    public Guid Id { get; set; }

    public class DeleteEmployeeCommandHandler : IRequestHandler<DeleteEmployeeCommand, DeletedEmployeeResponse>
    {
        private readonly IMapper _mapper;
        private readonly IEmployeeRepository _employeeRepository;
        private readonly EmployeeBusinessRules _employeeBusinessRules;

        public DeleteEmployeeCommandHandler(IMapper mapper, IEmployeeRepository employeeRepository,
                                         EmployeeBusinessRules employeeBusinessRules)
        {
            _mapper = mapper;
            _employeeRepository = employeeRepository;
            _employeeBusinessRules = employeeBusinessRules;
        }

        public async Task<DeletedEmployeeResponse> Handle(DeleteEmployeeCommand request, CancellationToken cancellationToken)
        {
            Employee? employee = await _employeeRepository.GetAsync(predicate: e => e.Id == request.Id, cancellationToken: cancellationToken);
            await _employeeBusinessRules.EmployeeShouldExistWhenSelected(employee);

            await _employeeRepository.DeleteAsync(employee!);

            DeletedEmployeeResponse response = _mapper.Map<DeletedEmployeeResponse>(employee);
            return response;
        }
    }
}