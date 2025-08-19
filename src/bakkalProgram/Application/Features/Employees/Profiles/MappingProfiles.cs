using Application.Features.Employees.Commands.Create;
using Application.Features.Employees.Commands.Delete;
using Application.Features.Employees.Commands.Update;
using Application.Features.Employees.Queries.GetById;
using Application.Features.Employees.Queries.GetList;
using AutoMapper;
using NArchitecture.Core.Application.Responses;
using Domain.Entities;
using NArchitecture.Core.Persistence.Paging;

namespace Application.Features.Employees.Profiles;

public class MappingProfiles : Profile
{
    public MappingProfiles()
    {
        CreateMap<CreateEmployeeCommand, Employee>();
        CreateMap<Employee, CreatedEmployeeResponse>();

        CreateMap<UpdateEmployeeCommand, Employee>();
        CreateMap<Employee, UpdatedEmployeeResponse>();

        CreateMap<DeleteEmployeeCommand, Employee>();
        CreateMap<Employee, DeletedEmployeeResponse>();

        CreateMap<Employee, GetByIdEmployeeResponse>();

        CreateMap<Employee, GetListEmployeeListItemDto>();
        CreateMap<IPaginate<Employee>, GetListResponse<GetListEmployeeListItemDto>>();
    }
}