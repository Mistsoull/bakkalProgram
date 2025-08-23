using NArchitecture.Core.Application.Responses;

namespace Application.Features.Orders.Queries.GetTotalOrderCountByDay
{
    public class GetTotalOrderCountByDayResponse : IResponse
    {
        public int TotalOrderCount { get; set; }
    }
}