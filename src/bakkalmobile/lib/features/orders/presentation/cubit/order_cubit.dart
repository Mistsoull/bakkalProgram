import 'package:flutter_bloc/flutter_bloc.dart';
import '../../data/repositories/order_repository.dart';
import '../../data/models/order_item_model.dart';
import 'order_state.dart';

class OrderCubit extends Cubit<OrderState> {
  final OrderRepository _repository;

  OrderCubit(this._repository) : super(OrderInitial());

  Future<void> getOrders({int pageIndex = 0, int pageSize = 10}) async {
    try {
      emit(OrderLoading());
      final response = await _repository.getOrders(
        pageIndex: pageIndex,
        pageSize: pageSize,
      );
      emit(
        OrderLoaded(
          orders: response.items,
          hasMore: response.hasNext,
          currentPage: response.index,
        ),
      );
    } catch (e) {
      emit(OrderError('Siparişler yüklenirken hata oluştu: ${e.toString()}'));
    }
  }

  Future<void> getOrderById(String id) async {
    try {
      emit(OrderDetailLoading());
      final order = await _repository.getOrderById(id);
      emit(OrderDetailLoaded(order));
    } catch (e) {
      emit(
        OrderDetailError(
          'Sipariş detayı yüklenirken hata oluştu: ${e.toString()}',
        ),
      );
    }
  }

  Future<void> createOrder({
    required String customerName,
    String? customerSurname,
    required DateTime deliveryDate,
    required bool isPaid,
    required bool isDelivered,
    String? customerId,
    required List<OrderItemModel> items,
  }) async {
    try {
      emit(OrderCreating());
      final orderData = {
        'customerName': customerName,
        'customerSurname': customerSurname,
        'deliveryDate': deliveryDate.toIso8601String(),
        'isPaid': isPaid,
        'isDelivered': isDelivered,
        'customerId': customerId,
        'items': items
            .map(
              (item) => {
                'productName': item.productName,
                'quantity': item.quantity,
                'unitPrice': item.unitPrice,
                'productId': item.productId,
              },
            )
            .toList(),
      };
      final order = await _repository.createOrder(orderData);
      emit(OrderCreated(order));
      // Refresh the list
      getOrders();
    } catch (e) {
      emit(OrderError('Sipariş oluşturulurken hata oluştu: ${e.toString()}'));
    }
  }

  Future<void> updateOrder({
    required String id,
    required String customerName,
    String? customerSurname,
    required DateTime deliveryDate,
    required bool isPaid,
    required bool isDelivered,
    String? customerId,
    required List<OrderItemModel> items,
  }) async {
    try {
      emit(OrderUpdating());
      final orderData = {
        'id': id,
        'customerName': customerName,
        'customerSurname': customerSurname,
        'deliveryDate': deliveryDate.toIso8601String(),
        'isPaid': isPaid,
        'isDelivered': isDelivered,
        'customerId': customerId,
        'items': items
            .map(
              (item) => {
                'productName': item.productName,
                'quantity': item.quantity,
                'unitPrice': item.unitPrice,
                'productId': item.productId,
              },
            )
            .toList(),
      };
      final order = await _repository.updateOrder(id, orderData);
      emit(OrderUpdated(order));
      // Refresh the list
      getOrders();
    } catch (e) {
      emit(OrderError('Sipariş güncellenirken hata oluştu: ${e.toString()}'));
    }
  }

  Future<void> deleteOrder(String id) async {
    try {
      emit(OrderDeleting());
      await _repository.deleteOrder(id);
      emit(OrderDeleted(id));
      // Refresh the list
      getOrders();
    } catch (e) {
      emit(OrderError('Sipariş silinirken hata oluştu: ${e.toString()}'));
    }
  }

  Future<void> markAsDelivered(String id) async {
    try {
      emit(OrderStatusUpdating());
      final order = await _repository.markAsDelivered(id);
      emit(OrderStatusUpdated(order));
      // Refresh the list
      getOrders();
    } catch (e) {
      emit(
        OrderError(
          'Sipariş durumu güncellenirken hata oluştu: ${e.toString()}',
        ),
      );
    }
  }

  Future<void> markAsPaid(String id) async {
    try {
      emit(OrderStatusUpdating());
      final order = await _repository.markAsPaid(id);
      emit(OrderStatusUpdated(order));
      // Refresh the list
      getOrders();
    } catch (e) {
      emit(
        OrderError('Ödeme durumu güncellenirken hata oluştu: ${e.toString()}'),
      );
    }
  }

  void resetToInitial() {
    emit(OrderInitial());
  }
}
