using Application.Features.Orders.Constants;
using Application.Services.Repositories;
using NArchitecture.Core.Application.Rules;
using NArchitecture.Core.CrossCuttingConcerns.Exception.Types;
using NArchitecture.Core.Localization.Abstraction;
using Domain.Entities;

namespace Application.Features.Orders.Rules;

public class OrderBusinessRules : BaseBusinessRules
{
    private readonly IOrderRepository _orderRepository;
    private readonly ILocalizationService _localizationService;
    private readonly IProductRepository _productRepository;
    private readonly ICustomerRepository _customerRepository;

    public OrderBusinessRules(IOrderRepository orderRepository, ILocalizationService localizationService, IProductRepository productRepository, ICustomerRepository customerRepository)
    {
        _orderRepository = orderRepository;
        _localizationService = localizationService;
        _productRepository = productRepository;
        _customerRepository = customerRepository;
    }

    private async Task throwBusinessException(string messageKey)
    {
        string message = await _localizationService.GetLocalizedAsync(messageKey, OrdersBusinessMessages.SectionName);
        throw new BusinessException(message);
    }

    public async Task OrderShouldExistWhenSelected(Order? order)
    {
        if (order == null)
            await throwBusinessException(OrdersBusinessMessages.OrderNotExists);
    }

    public async Task OrderIdShouldExistWhenSelected(Guid id, CancellationToken cancellationToken)
    {
        Order? order = await _orderRepository.GetAsync(
            predicate: o => o.Id == id,
            enableTracking: false,
            cancellationToken: cancellationToken
        );
        await OrderShouldExistWhenSelected(order);
    }

    // Eğer productId null veya boş ise productName kullanılır, aksi halde productId ile eşleşen ürün bulunur ve ismi kullanılır.
    public async Task SetProductNameBasedOnProductId(Guid? productId, string productName, Order order)
    {
        if (productId == null || productId == Guid.Empty)
        {
            order.ProductName = productName;
            return;
        }

        Product? product = await _productRepository.GetAsync(predicate: p => p.Id == productId);
        order.ProductName = product?.Name ?? productName;
    }
    // Eğer customerId null veya boş ise customerName kullanılır, aksi halde customerId ile eşleşen müşteri bulunur ve ismi kullanılır.
    public async Task SetCustomerNameBasedOnCustomerId(Guid? customerId, string customerName, Order order)
    {
        if (customerId == null || customerId == Guid.Empty)
        {
            order.CustomerName = customerName;
            return;
        }

        Customer? customer = await _customerRepository.GetAsync(predicate: c => c.Id == customerId);
        order.CustomerName = customer?.Name ?? customerName;
    }
}