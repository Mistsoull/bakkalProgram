import '../../data/models/order_model.dart';

abstract class OrderState {
  const OrderState();
}

class OrderInitial extends OrderState {}

class OrderLoading extends OrderState {}

class OrderLoaded extends OrderState {
  final List<OrderModel> orders;
  final bool hasMore;
  final int currentPage;

  const OrderLoaded({
    required this.orders,
    this.hasMore = false,
    this.currentPage = 0,
  });

  OrderLoaded copyWith({
    List<OrderModel>? orders,
    bool? hasMore,
    int? currentPage,
  }) {
    return OrderLoaded(
      orders: orders ?? this.orders,
      hasMore: hasMore ?? this.hasMore,
      currentPage: currentPage ?? this.currentPage,
    );
  }
}

class OrderError extends OrderState {
  final String message;

  const OrderError(this.message);
}

class OrderDetailLoading extends OrderState {}

class OrderDetailLoaded extends OrderState {
  final OrderModel order;

  const OrderDetailLoaded(this.order);
}

class OrderDetailError extends OrderState {
  final String message;

  const OrderDetailError(this.message);
}

class OrderCreating extends OrderState {}

class OrderCreated extends OrderState {
  final OrderModel order;

  const OrderCreated(this.order);
}

class OrderUpdating extends OrderState {}

class OrderUpdated extends OrderState {
  final OrderModel order;

  const OrderUpdated(this.order);
}

class OrderDeleting extends OrderState {}

class OrderDeleted extends OrderState {
  final String orderId;

  const OrderDeleted(this.orderId);
}

class OrderStatusUpdating extends OrderState {}

class OrderStatusUpdated extends OrderState {
  final OrderModel order;

  const OrderStatusUpdated(this.order);
}
