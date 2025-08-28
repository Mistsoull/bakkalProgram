using Application.Features.OnCredits.Commands.Create;
using Application.Features.OnCredits.Commands.Delete;
using Application.Features.OnCredits.Commands.Update;
using Application.Features.OnCredits.Commands.ToggleStatus;
using Application.Features.OnCredits.Queries.GetById;
using Application.Features.OnCredits.Queries.GetList;
using AutoMapper;
using NArchitecture.Core.Application.Responses;
using Domain.Entities;
using NArchitecture.Core.Persistence.Paging;

namespace Application.Features.OnCredits.Profiles;

public class MappingProfiles : Profile
{
    public MappingProfiles()
    {
        CreateMap<CreateOnCreditCommand, OnCredit>();
        CreateMap<OnCredit, CreatedOnCreditResponse>();

        CreateMap<UpdateOnCreditCommand, OnCredit>();
        CreateMap<OnCredit, UpdatedOnCreditResponse>();

        CreateMap<DeleteOnCreditCommand, OnCredit>();
        CreateMap<OnCredit, DeletedOnCreditResponse>();

        CreateMap<OnCredit, ToggleOnCreditStatusResponse>();

        CreateMap<OnCredit, GetByIdOnCreditResponse>();

        CreateMap<OnCredit, GetListOnCreditListItemDto>();
        CreateMap<IPaginate<OnCredit>, GetListResponse<GetListOnCreditListItemDto>>();
    }
}