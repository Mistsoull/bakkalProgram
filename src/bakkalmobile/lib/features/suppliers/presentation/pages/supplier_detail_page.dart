import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/network/api_service.dart';
import '../../data/repositories/supplier_repository.dart';
import '../cubit/supplier_cubit.dart';

class SupplierDetailPage extends StatelessWidget {
  final String supplierId;

  const SupplierDetailPage({super.key, required this.supplierId});

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (context) =>
          SupplierCubit(SupplierRepository(ApiService()))
            ..getSupplierById(supplierId),
      child: Scaffold(
        appBar: AppBar(
          title: const Text('Tedarikçi Detayı'),
          backgroundColor: Colors.blue,
          foregroundColor: Colors.white,
          actions: [
            BlocBuilder<SupplierCubit, SupplierState>(
              builder: (context, state) {
                if (state is SupplierDetailLoaded) {
                  return IconButton(
                    icon: const Icon(Icons.edit),
                    onPressed: () {
                      context.push('/suppliers/$supplierId/edit');
                    },
                  );
                }
                return const SizedBox.shrink();
              },
            ),
          ],
        ),
        body: BlocBuilder<SupplierCubit, SupplierState>(
          builder: (context, state) {
            if (state is SupplierLoading) {
              return const Center(child: CircularProgressIndicator());
            } else if (state is SupplierDetailLoaded) {
              final supplier = state.supplier;
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
                              'Temel Bilgiler',
                              style: TextStyle(
                                fontSize: 18,
                                fontWeight: FontWeight.bold,
                                color: Colors.blue,
                              ),
                            ),
                            const Divider(),
                            const SizedBox(height: 8),
                            _DetailRow(
                              icon: Icons.person,
                              label: 'İletişim Kişisi',
                              value: supplier.nameSurname,
                            ),
                            const SizedBox(height: 16),
                            _DetailRow(
                              icon: Icons.business,
                              label: 'Firma Adı',
                              value: supplier.companyName,
                            ),
                            const SizedBox(height: 16),
                            _DetailRow(
                              icon: Icons.phone,
                              label: 'Telefon',
                              value: supplier.phoneNumber,
                            ),
                            if (supplier.note != null &&
                                supplier.note!.isNotEmpty) ...[
                              const SizedBox(height: 16),
                              _DetailRow(
                                icon: Icons.note,
                                label: 'Not',
                                value: supplier.note!,
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
                                color: Colors.blue,
                              ),
                            ),
                            const Divider(),
                            const SizedBox(height: 8),
                            if (supplier.createdDate != null) ...[
                              _DetailRow(
                                icon: Icons.calendar_today,
                                label: 'Oluşturulma Tarihi',
                                value: _formatDate(supplier.createdDate!),
                              ),
                              const SizedBox(height: 16),
                            ],
                            if (supplier.updatedDate != null) ...[
                              const SizedBox(height: 16),
                              _DetailRow(
                                icon: Icons.update,
                                label: 'Güncellenme Tarihi',
                                value: _formatDate(supplier.updatedDate!),
                              ),
                            ],
                            const SizedBox(height: 16),
                            _DetailRow(
                              icon: Icons.tag,
                              label: 'ID',
                              value: supplier.id,
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
            } else if (state is SupplierError) {
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
                        context.read<SupplierCubit>().getSupplierById(
                          supplierId,
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
