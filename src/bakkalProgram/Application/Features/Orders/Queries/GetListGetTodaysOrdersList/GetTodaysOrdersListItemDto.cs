using NArchitecture.Core.Application.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.Features.Orders.Queries.GetListGetTodaysOrdersList
{
    public class GetTodaysOrdersListItemDto : IDto
    {
        public Guid Id { get; set; }
        public string? ProductName { get; set; }
        public int Quantity { get; set; }
        public string? CustomerName { get; set; }
        public string? CustomerSurname { get; set; }
        public DateTime DeliveryDate { get; set; }
        public bool isPaid { get; set; }
        public bool IsDelivered { get; set; }
    }
}