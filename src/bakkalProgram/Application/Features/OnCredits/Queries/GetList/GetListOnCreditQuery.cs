using Application.Services.Repositories;
using AutoMapper;
using Domain.Entities;
using NArchitecture.Core.Application.Requests;
using NArchitecture.Core.Application.Responses;
using NArchitecture.Core.Persistence.Paging;
using MediatR;

namespace Application.Features.OnCredits.Queries.GetList;

public class GetListOnCreditQuery : IRequest<GetListResponse<GetListOnCreditListItemDto>>
{
    public PageRequest PageRequest { get; set; }

    public class GetListOnCreditQueryHandler : IRequestHandler<GetListOnCreditQuery, GetListResponse<GetListOnCreditListItemDto>>
    {
        private readonly IOnCreditRepository _onCreditRepository;
        private readonly IMapper _mapper;

        public GetListOnCreditQueryHandler(IOnCreditRepository onCreditRepository, IMapper mapper)
        {
            _onCreditRepository = onCreditRepository;
            _mapper = mapper;
        }

        public async Task<GetListResponse<GetListOnCreditListItemDto>> Handle(GetListOnCreditQuery request, CancellationToken cancellationToken)
        {
            IPaginate<OnCredit> onCredits = await _onCreditRepository.GetListAsync(
                index: request.PageRequest.PageIndex,
                size: request.PageRequest.PageSize, 
                cancellationToken: cancellationToken
            );

            GetListResponse<GetListOnCreditListItemDto> response = _mapper.Map<GetListResponse<GetListOnCreditListItemDto>>(onCredits);
            return response;
        }
    }
}