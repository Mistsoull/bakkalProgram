import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/network/api_service.dart';
import '../../data/repositories/customer_repository.dart';
import '../cubit/customer_cubit.dart';

class CustomerDetailPage extends StatelessWidget {
  final String customerId;

  const CustomerDetailPage({super.key, required this.customerId});

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (context) =>
          CustomerCubit(CustomerRepository(ApiService()))
            ..getCustomerById(customerId),
      child: Scaffold(
        appBar: AppBar(
          title: const Text('Müşteri Detayı'),
          backgroundColor: Colors.orange,
          foregroundColor: Colors.white,
          actions: [
            BlocBuilder<CustomerCubit, CustomerState>(
              builder: (context, state) {
                if (state is CustomerDetailLoaded) {
                  return IconButton(
                    icon: const Icon(Icons.edit),
                    onPressed: () {
                      context.push('/customers/$customerId/edit');
                    },
                  );
                }
                return const SizedBox.shrink();
              },
            ),
          ],
        ),
        body: BlocBuilder<CustomerCubit, CustomerState>(
          builder: (context, state) {
            if (state is CustomerLoading) {
              return const Center(child: CircularProgressIndicator());
            } else if (state is CustomerDetailLoaded) {
              final customer = state.customer;
              return SingleChildScrollView(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Card(
                      child: Padding(
                        padding: const EdgeInsets.all(16.0),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text(
                              'Kişisel Bilgiler',
                              style: TextStyle(
                                fontSize: 18,
                                fontWeight: FontWeight.bold,
                                color: Colors.orange,
                              ),
                            ),
                            const Divider(),
                            const SizedBox(height: 8),
                            _DetailRow(
                              icon: Icons.person,
                              label: 'Ad',
                              value: customer.name,
                            ),
                            const SizedBox(height: 16),
                            _DetailRow(
                              icon: Icons.person_outline,
                              label: 'Soyad',
                              value: customer.surname,
                            ),
                            const SizedBox(height: 16),
                            _DetailRow(
                              icon: Icons.phone,
                              label: 'Telefon',
                              value: customer.phoneNumber,
                            ),
                            if (customer.note != null &&
                                customer.note!.isNotEmpty) ...[
                              const SizedBox(height: 16),
                              _DetailRow(
                                icon: Icons.note,
                                label: 'Not',
                                value: customer.note!,
                                maxLines: 3,
                              ),
                            ],
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(height: 16),
                    Card(
                      child: Padding(
                        padding: const EdgeInsets.all(16.0),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text(
                              'Sistem Bilgileri',
                              style: TextStyle(
                                fontSize: 18,
                                fontWeight: FontWeight.bold,
                                color: Colors.orange,
                              ),
                            ),
                            const Divider(),
                            const SizedBox(height: 8),
                            if (customer.createdDate != null) ...[
                              _DetailRow(
                                icon: Icons.calendar_today,
                                label: 'Oluşturulma Tarihi',
                                value: _formatDate(customer.createdDate!),
                              ),
                              const SizedBox(height: 16),
                            ],
                            if (customer.updatedDate != null) ...[
                              _DetailRow(
                                icon: Icons.update,
                                label: 'Güncellenme Tarihi',
                                value: _formatDate(customer.updatedDate!),
                              ),
                              const SizedBox(height: 16),
                            ],
                            _DetailRow(
                              icon: Icons.tag,
                              label: 'ID',
                              value: customer.id,
                              valueStyle: const TextStyle(
                                fontFamily: 'monospace',
                                fontSize: 12,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
              );
            } else if (state is CustomerError) {
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
                        context.read<CustomerCubit>().getCustomerById(
                          customerId,
                        );
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

  String _formatDate(DateTime date) {
    return '${date.day.toString().padLeft(2, '0')}/${date.month.toString().padLeft(2, '0')}/${date.year}';
  }
}

class _DetailRow extends StatelessWidget {
  final IconData icon;
  final String label;
  final String value;
  final int maxLines;
  final TextStyle? valueStyle;

  const _DetailRow({
    required this.icon,
    required this.label,
    required this.value,
    this.maxLines = 1,
    this.valueStyle,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Icon(icon, size: 20, color: Colors.grey[600]),
        const SizedBox(width: 12),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                label,
                style: TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.w500,
                  color: Colors.grey[600],
                ),
              ),
              const SizedBox(height: 4),
              Text(
                value,
                style:
                    valueStyle ??
                    const TextStyle(fontSize: 16, fontWeight: FontWeight.w400),
                maxLines: maxLines,
                overflow: TextOverflow.ellipsis,
              ),
            ],
          ),
        ),
      ],
    );
  }
}
