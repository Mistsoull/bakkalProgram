using Application.Services.Repositories;
using AutoMapper;
using Domain.Entities;
using NArchitecture.Core.Application.Requests;
using NArchitecture.Core.Application.Responses;
using NArchitecture.Core.Persistence.Paging;
using MediatR;

namespace Application.Features.Employees.Queries.GetList;

public class GetListEmployeeQuery : IRequest<GetListResponse<GetListEmployeeListItemDto>>
{
    public PageRequest PageRequest { get; set; }

    public class GetListEmployeeQueryHandler : IRequestHandler<GetListEmployeeQuery, GetListResponse<GetListEmployeeListItemDto>>
    {
        private readonly IEmployeeRepository _employeeRepository;
        private readonly IMapper _mapper;

        public GetListEmployeeQueryHandler(IEmployeeRepository employeeRepository, IMapper mapper)
        {
            _employeeRepository = employeeRepository;
            _mapper = mapper;
        }

        public async Task<GetListResponse<GetListEmployeeListItemDto>> Handle(GetListEmployeeQuery request, CancellationToken cancellationToken)
        {
            IPaginate<Employee> employees = await _employeeRepository.GetListAsync(
                index: request.PageRequest.PageIndex,
                size: request.PageRequest.PageSize, 
                cancellationToken: cancellationToken
            );

            GetListResponse<GetListEmployeeListItemDto> response = _mapper.Map<GetListResponse<GetListEmployeeListItemDto>>(employees);
            return response;
        }
    }
}