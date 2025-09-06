import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/network/api_service.dart';
import '../../data/repositories/order_repository.dart';
import '../../data/models/order_item_model.dart';
import '../cubit/order_cubit.dart';
import '../cubit/order_state.dart';

class OrderFormPage extends StatefulWidget {
  final String? orderId;
  final bool isEdit;

  const OrderFormPage({super.key, this.orderId, this.isEdit = false});

  @override
  State<OrderFormPage> createState() => _OrderFormPageState();
}

class _OrderFormPageState extends State<OrderFormPage> {
  final _formKey = GlobalKey<FormState>();
  final _customerNameController = TextEditingController();
  final _customerSurnameController = TextEditingController();
  DateTime _deliveryDate = DateTime.now().add(const Duration(days: 1));
  bool _isPaid = false;
  bool _isDelivered = false;

  // Simple order items for demo (would be more complex in real app)
  final List<OrderItemModel> _orderItems = [];

  @override
  void dispose() {
    _customerNameController.dispose();
    _customerSurnameController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (context) {
        final cubit = OrderCubit(OrderRepository(ApiService().dio));
        if (widget.isEdit && widget.orderId != null) {
          cubit.getOrderById(widget.orderId!);
        }
        return cubit;
      },
      child: Scaffold(
        appBar: AppBar(
          title: Text(widget.isEdit ? 'Sipariş Düzenle' : 'Yeni Sipariş'),
          backgroundColor: Colors.blue,
          foregroundColor: Colors.white,
        ),
        body: BlocConsumer<OrderCubit, OrderState>(
          listener: (context, state) {
            if (state is OrderDetailLoaded && widget.isEdit) {
              // Fill form with existing data
              final order = state.order;
              _customerNameController.text = order.customerName;
              _customerSurnameController.text = order.customerSurname ?? '';
              _deliveryDate = order.deliveryDate;
              _isPaid = order.isPaid;
              _isDelivered = order.isDelivered;
              _orderItems.clear();
              _orderItems.addAll(order.items);
              setState(() {});
            } else if (state is OrderCreated) {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('Sipariş başarıyla oluşturuldu'),
                  backgroundColor: Colors.green,
                ),
              );
              context.pop();
            } else if (state is OrderUpdated) {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('Sipariş başarıyla güncellendi'),
                  backgroundColor: Colors.green,
                ),
              );
              context.pop();
            } else if (state is OrderError) {
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  content: Text(state.message),
                  backgroundColor: Colors.red,
                ),
              );
            }
          },
          builder: (context, state) {
            if (state is OrderDetailLoading && widget.isEdit) {
              return const Center(child: CircularProgressIndicator());
            }

            return SingleChildScrollView(
              padding: const EdgeInsets.all(16.0),
              child: Form(
                key: _formKey,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    // Customer Info Card
                    Card(
                      elevation: 2,
                      child: Padding(
                        padding: const EdgeInsets.all(16.0),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text(
                              'Müşteri Bilgileri',
                              style: TextStyle(
                                fontSize: 18,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            const SizedBox(height: 20),

                            // Customer Name
                            TextFormField(
                              controller: _customerNameController,
                              decoration: const InputDecoration(
                                labelText: 'Müşteri Adı *',
                                hintText: 'Müşteri adını girin',
                                border: OutlineInputBorder(),
                                prefixIcon: Icon(Icons.person),
                              ),
                              validator: (value) {
                                if (value == null || value.trim().isEmpty) {
                                  return 'Müşteri adı boş olamaz';
                                }
                                return null;
                              },
                              textInputAction: TextInputAction.next,
                            ),
                            const SizedBox(height: 16),

                            // Customer Surname
                            TextFormField(
                              controller: _customerSurnameController,
                              decoration: const InputDecoration(
                                labelText: 'Müşteri Soyadı',
                                hintText: 'Müşteri soyadını girin',
                                border: OutlineInputBorder(),
                                prefixIcon: Icon(Icons.person_outline),
                              ),
                              textInputAction: TextInputAction.next,
                            ),
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(height: 16),

                    // Order Details Card
                    Card(
                      elevation: 2,
                      child: Padding(
                        padding: const EdgeInsets.all(16.0),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text(
                              'Sipariş Detayları',
                              style: TextStyle(
                                fontSize: 18,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            const SizedBox(height: 20),

                            // Delivery Date
                            ListTile(
                              leading: const Icon(Icons.calendar_today),
                              title: const Text('Teslimat Tarihi'),
                              subtitle: Text(
                                '${_deliveryDate.day.toString().padLeft(2, '0')}.${_deliveryDate.month.toString().padLeft(2, '0')}.${_deliveryDate.year}',
                              ),
                              onTap: () async {
                                final date = await showDatePicker(
                                  context: context,
                                  initialDate: _deliveryDate,
                                  firstDate: DateTime.now(),
                                  lastDate: DateTime.now().add(
                                    const Duration(days: 365),
                                  ),
                                );
                                if (date != null) {
                                  setState(() {
                                    _deliveryDate = date;
                                  });
                                }
                              },
                            ),

                            // Payment Status
                            SwitchListTile(
                              secondary: const Icon(Icons.payment),
                              title: const Text('Ödeme Durumu'),
                              subtitle: Text(_isPaid ? 'Ödendi' : 'Ödenmedi'),
                              value: _isPaid,
                              onChanged: (value) {
                                setState(() {
                                  _isPaid = value;
                                });
                              },
                            ),

                            // Delivery Status
                            SwitchListTile(
                              secondary: const Icon(Icons.local_shipping),
                              title: const Text('Teslimat Durumu'),
                              subtitle: Text(
                                _isDelivered ? 'Teslim Edildi' : 'Beklemede',
                              ),
                              value: _isDelivered,
                              onChanged: (value) {
                                setState(() {
                                  _isDelivered = value;
                                });
                              },
                            ),
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(height: 16),

                    // Order Items Placeholder
                    Card(
                      elevation: 2,
                      child: Padding(
                        padding: const EdgeInsets.all(16.0),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                const Text(
                                  'Sipariş Ürünleri',
                                  style: TextStyle(
                                    fontSize: 18,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                                TextButton.icon(
                                  onPressed: _addSimpleOrderItem,
                                  icon: const Icon(Icons.add),
                                  label: const Text('Ürün Ekle'),
                                ),
                              ],
                            ),
                            const SizedBox(height: 16),
                            if (_orderItems.isEmpty)
                              const Center(
                                child: Text(
                                  'Henüz ürün eklenmemiş.\nÜrün eklemek için "Ürün Ekle" butonuna tıklayın.',
                                  textAlign: TextAlign.center,
                                  style: TextStyle(
                                    color: Colors.grey,
                                    fontStyle: FontStyle.italic,
                                  ),
                                ),
                              )
                            else
                              ..._orderItems.map(
                                (item) => Container(
                                  margin: const EdgeInsets.only(bottom: 8),
                                  padding: const EdgeInsets.all(12),
                                  decoration: BoxDecoration(
                                    color: Colors.grey.shade50,
                                    borderRadius: BorderRadius.circular(8),
                                    border: Border.all(
                                      color: Colors.grey.shade200,
                                    ),
                                  ),
                                  child: Row(
                                    children: [
                                      const Icon(
                                        Icons.inventory_2,
                                        color: Colors.blue,
                                      ),
                                      const SizedBox(width: 12),
                                      Expanded(
                                        child: Column(
                                          crossAxisAlignment:
                                              CrossAxisAlignment.start,
                                          children: [
                                            Text(
                                              item.productName,
                                              style: const TextStyle(
                                                fontWeight: FontWeight.w600,
                                              ),
                                            ),
                                            Text(
                                              '${item.quantity} adet x ₺${item.unitPrice.toStringAsFixed(2)}',
                                              style: TextStyle(
                                                color: Colors.grey.shade600,
                                                fontSize: 12,
                                              ),
                                            ),
                                          ],
                                        ),
                                      ),
                                      Text(
                                        '₺${item.totalPrice.toStringAsFixed(2)}',
                                        style: const TextStyle(
                                          fontWeight: FontWeight.bold,
                                          color: Colors.green,
                                        ),
                                      ),
                                      IconButton(
                                        onPressed: () {
                                          setState(() {
                                            _orderItems.remove(item);
                                          });
                                        },
                                        icon: const Icon(
                                          Icons.delete,
                                          color: Colors.red,
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                              ),
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(height: 20),

                    // Save Button
                    ElevatedButton(
                      onPressed:
                          state is OrderCreating || state is OrderUpdating
                          ? null
                          : _saveOrder,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.blue,
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.symmetric(vertical: 15),
                        textStyle: const TextStyle(fontSize: 16),
                      ),
                      child: state is OrderCreating || state is OrderUpdating
                          ? const Row(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                SizedBox(
                                  width: 20,
                                  height: 20,
                                  child: CircularProgressIndicator(
                                    strokeWidth: 2,
                                    valueColor: AlwaysStoppedAnimation<Color>(
                                      Colors.white,
                                    ),
                                  ),
                                ),
                                SizedBox(width: 10),
                                Text('Kaydediliyor...'),
                              ],
                            )
                          : Text(widget.isEdit ? 'Güncelle' : 'Kaydet'),
                    ),
                  ],
                ),
              ),
            );
          },
        ),
      ),
    );
  }

  void _addSimpleOrderItem() {
    // Simple dialog to add order item (in real app, this would be more sophisticated)
    showDialog(
      context: context,
      builder: (context) {
        final nameController = TextEditingController();
        final quantityController = TextEditingController(text: '1');
        final priceController = TextEditingController(text: '0.00');

        return AlertDialog(
          title: const Text('Ürün Ekle'),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              TextField(
                controller: nameController,
                decoration: const InputDecoration(
                  labelText: 'Ürün Adı',
                  border: OutlineInputBorder(),
                ),
              ),
              const SizedBox(height: 16),
              TextField(
                controller: quantityController,
                decoration: const InputDecoration(
                  labelText: 'Miktar',
                  border: OutlineInputBorder(),
                ),
                keyboardType: TextInputType.number,
              ),
              const SizedBox(height: 16),
              TextField(
                controller: priceController,
                decoration: const InputDecoration(
                  labelText: 'Birim Fiyat',
                  border: OutlineInputBorder(),
                ),
                keyboardType: TextInputType.number,
              ),
            ],
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: const Text('İptal'),
            ),
            TextButton(
              onPressed: () {
                if (nameController.text.isNotEmpty) {
                  final item = OrderItemModel(
                    id: DateTime.now().millisecondsSinceEpoch.toString(),
                    orderId: widget.orderId ?? '',
                    productName: nameController.text,
                    quantity: int.tryParse(quantityController.text) ?? 1,
                    unitPrice: double.tryParse(priceController.text) ?? 0.0,
                  );
                  setState(() {
                    _orderItems.add(item);
                  });
                }
                Navigator.pop(context);
              },
              child: const Text('Ekle'),
            ),
          ],
        );
      },
    );
  }

  void _saveOrder() {
    if (_formKey.currentState!.validate()) {
      final customerName = _customerNameController.text.trim();
      final customerSurname = _customerSurnameController.text.trim();

      if (widget.isEdit && widget.orderId != null) {
        context.read<OrderCubit>().updateOrder(
          id: widget.orderId!,
          customerName: customerName,
          customerSurname: customerSurname.isEmpty ? null : customerSurname,
          deliveryDate: _deliveryDate,
          isPaid: _isPaid,
          isDelivered: _isDelivered,
          items: _orderItems,
        );
      } else {
        context.read<OrderCubit>().createOrder(
          customerName: customerName,
          customerSurname: customerSurname.isEmpty ? null : customerSurname,
          deliveryDate: _deliveryDate,
          isPaid: _isPaid,
          isDelivered: _isDelivered,
          items: _orderItems,
        );
      }
    }
  }
}
