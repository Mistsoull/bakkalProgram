using Application.Features.Orders.Rules;
using Application.Services.Repositories;
using AutoMapper;
using Domain.Entities;
using MediatR;

namespace Application.Features.Orders.Commands.Create;

public class CreateOrderCommand : IRequest<CreatedOrderResponse>
{
    public required string CustomerName { get; set; }
    public string? CustomerSurname { get; set; }
    public required DateTime DeliveryDate { get; set; }
    public required bool isPaid { get; set; }
    public Guid? CustomerId { get; set; }
    public required List<CreateOrderItemDto> Items { get; set; } = new();

    public class CreateOrderCommandHandler : IRequestHandler<CreateOrderCommand, CreatedOrderResponse>
    {
        private readonly IMapper _mapper;
        private readonly IOrderRepository _orderRepository;
        private readonly OrderBusinessRules _orderBusinessRules;

        public CreateOrderCommandHandler(IMapper mapper, IOrderRepository orderRepository,
                                         OrderBusinessRules orderBusinessRules)
        {
            _mapper = mapper;
            _orderRepository = orderRepository;
            _orderBusinessRules = orderBusinessRules;
        }

        public async Task<CreatedOrderResponse> Handle(CreateOrderCommand request, CancellationToken cancellationToken)
        {
            // Yeni Order oluştur
            Order order = new Order
            {
                CustomerName = request.CustomerName,
                CustomerSurname = request.CustomerSurname,
                DeliveryDate = request.DeliveryDate,
                isPaid = request.isPaid,
                CustomerId = request.CustomerId
            };

            // Set customer name if CustomerId is provided
            if (request.CustomerId.HasValue)
            {
                await _orderBusinessRules.SetCustomerNameBasedOnCustomerId(request.CustomerId, request.CustomerName, order);
            }

            // Items'ları ekle
            foreach (var itemDto in request.Items)
            {
                string productName = itemDto.ProductName;
                
                // Set product name if ProductId is provided
                if (itemDto.ProductId.HasValue)
                {
                    var tempOrderItem = new OrderItem { ProductName = itemDto.ProductName };
                    await _orderBusinessRules.SetProductNameForOrderItem(itemDto.ProductId, itemDto.ProductName, tempOrderItem);
                    productName = tempOrderItem.ProductName;
                }

                order.AddItem(
                    productName,
                    itemDto.Quantity,
                    itemDto.UnitPrice ?? 0, // Eğer birim fiyat yoksa 0 kullan
                    itemDto.ProductId
                );
            }

            await _orderRepository.AddAsync(order);

            CreatedOrderResponse response = _mapper.Map<CreatedOrderResponse>(order);
            return response;
        }
    }
}

public class CreateOrderItemDto
{
    public Guid? ProductId { get; set; }
    public required string ProductName { get; set; }
    public required int Quantity { get; set; }
    public decimal? UnitPrice { get; set; }
}