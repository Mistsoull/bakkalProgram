import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/network/api_service.dart';
import '../../../../shared/widgets/navigation_drawer.dart' as nav;
import '../../data/repositories/order_repository.dart';
import '../cubit/order_cubit.dart';
import '../cubit/order_state.dart';
import '../widgets/order_list_item.dart';

class OrderListPage extends StatelessWidget {
  const OrderListPage({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (context) =>
          OrderCubit(OrderRepository(ApiService().dio))..getOrders(),
      child: Scaffold(
        appBar: AppBar(
          title: const Text('Siparişler'),
          backgroundColor: Colors.blue,
          foregroundColor: Colors.white,
          actions: [
            IconButton(
              icon: const Icon(Icons.add),
              onPressed: () {
                context.push('/orders/add');
              },
            ),
          ],
        ),
        drawer: const nav.NavigationDrawer(),
        body: BlocBuilder<OrderCubit, OrderState>(
          builder: (context, state) {
            if (state is OrderLoading) {
              return const Center(child: CircularProgressIndicator());
            } else if (state is OrderLoaded) {
              if (state.orders.isEmpty) {
                return const Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(
                        Icons.receipt_long_outlined,
                        size: 64,
                        color: Colors.grey,
                      ),
                      SizedBox(height: 16),
                      Text(
                        'Henüz sipariş eklenmemiş',
                        style: TextStyle(fontSize: 18, color: Colors.grey),
                      ),
                      SizedBox(height: 8),
                      Text(
                        'Yeni sipariş eklemek için + butonuna tıklayın',
                        style: TextStyle(fontSize: 14, color: Colors.grey),
                      ),
                    ],
                  ),
                );
              }

              return RefreshIndicator(
                onRefresh: () async {
                  context.read<OrderCubit>().getOrders();
                },
                child: ListView.builder(
                  padding: const EdgeInsets.all(8.0),
                  itemCount: state.orders.length,
                  itemBuilder: (context, index) {
                    final order = state.orders[index];
                    return OrderListItem(
                      order: order,
                      onTap: () {
                        context.push('/orders/${order.id}');
                      },
                      onEdit: () {
                        context.push('/orders/${order.id}/edit');
                      },
                      onDelete: () {
                        _showDeleteDialog(
                          context,
                          order.id,
                          order.fullCustomerName,
                        );
                      },
                      onMarkAsDelivered: () {
                        _showDeliveryDialog(
                          context,
                          order.id,
                          order.fullCustomerName,
                        );
                      },
                      onMarkAsPaid: () {
                        _showPaymentDialog(
                          context,
                          order.id,
                          order.fullCustomerName,
                        );
                      },
                    );
                  },
                ),
              );
            } else if (state is OrderError) {
              return Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Icon(
                      Icons.error_outline,
                      size: 64,
                      color: Colors.red,
                    ),
                    const SizedBox(height: 16),
                    Text(
                      'Hata: ${state.message}',
                      style: const TextStyle(fontSize: 16, color: Colors.red),
                      textAlign: TextAlign.center,
                    ),
                    const SizedBox(height: 16),
                    ElevatedButton(
                      onPressed: () {
                        context.read<OrderCubit>().getOrders();
                      },
                      child: const Text('Tekrar Dene'),
                    ),
                  ],
                ),
              );
            }
            return const SizedBox.shrink();
          },
        ),
      ),
    );
  }

  void _showDeleteDialog(
    BuildContext context,
    String orderId,
    String customerName,
  ) {
    showDialog(
      context: context,
      builder: (dialogContext) => AlertDialog(
        title: const Text('Siparişi Sil'),
        content: Text(
          '$customerName adlı müşterinin siparişini silmek istediğinizden emin misiniz?',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(dialogContext).pop(),
            child: const Text('İptal'),
          ),
          TextButton(
            onPressed: () {
              Navigator.of(dialogContext).pop();
              context.read<OrderCubit>().deleteOrder(orderId);
            },
            style: TextButton.styleFrom(foregroundColor: Colors.red),
            child: const Text('Sil'),
          ),
        ],
      ),
    );
  }

  void _showDeliveryDialog(
    BuildContext context,
    String orderId,
    String customerName,
  ) {
    showDialog(
      context: context,
      builder: (dialogContext) => AlertDialog(
        title: const Text('Siparişi Teslim Et'),
        content: Text(
          '$customerName adlı müşterinin siparişini teslim edildi olarak işaretlemek istediğinizden emin misiniz?',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(dialogContext).pop(),
            child: const Text('İptal'),
          ),
          TextButton(
            onPressed: () {
              Navigator.of(dialogContext).pop();
              context.read<OrderCubit>().markAsDelivered(orderId);
            },
            style: TextButton.styleFrom(foregroundColor: Colors.blue),
            child: const Text('Teslim Et'),
          ),
        ],
      ),
    );
  }

  void _showPaymentDialog(
    BuildContext context,
    String orderId,
    String customerName,
  ) {
    showDialog(
      context: context,
      builder: (dialogContext) => AlertDialog(
        title: const Text('Ödeme Al'),
        content: Text(
          '$customerName adlı müşterinin siparişini ödendi olarak işaretlemek istediğinizden emin misiniz?',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(dialogContext).pop(),
            child: const Text('İptal'),
          ),
          TextButton(
            onPressed: () {
              Navigator.of(dialogContext).pop();
              context.read<OrderCubit>().markAsPaid(orderId);
            },
            style: TextButton.styleFrom(foregroundColor: Colors.green),
            child: const Text('Öde'),
          ),
        ],
      ),
    );
  }
}
