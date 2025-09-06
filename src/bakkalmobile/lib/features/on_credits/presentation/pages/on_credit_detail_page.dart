import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/network/api_service.dart';
import '../../data/repositories/on_credit_repository.dart';
import '../cubit/on_credit_cubit.dart';

class OnCreditDetailPage extends StatelessWidget {
  final String onCreditId;

  const OnCreditDetailPage({super.key, required this.onCreditId});

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (context) =>
          OnCreditCubit(OnCreditRepository(ApiService()))
            ..getOnCreditById(onCreditId),
      child: Scaffold(
        appBar: AppBar(
          title: const Text('Veresiye Detayı'),
          backgroundColor: Colors.red,
          foregroundColor: Colors.white,
          actions: [
            BlocBuilder<OnCreditCubit, OnCreditState>(
              builder: (context, state) {
                if (state is OnCreditDetailLoaded) {
                  return Row(
                    children: [
                      if (!state.onCredit.isPaid)
                        IconButton(
                          icon: const Icon(Icons.payment),
                          onPressed: () {
                            _showMarkAsPaidDialog(
                              context,
                              state.onCredit.id,
                              state.onCredit.customerFullName.isNotEmpty
                                  ? state.onCredit.customerFullName
                                  : 'Müşteri',
                              state.onCredit.formattedAmount,
                            );
                          },
                          tooltip: 'Ödendi Olarak İşaretle',
                        ),
                      IconButton(
                        icon: const Icon(Icons.edit),
                        onPressed: () {
                          context.push('/on-credits/$onCreditId/edit');
                        },
                        tooltip: 'Düzenle',
                      ),
                    ],
                  );
                }
                return const SizedBox.shrink();
              },
            ),
          ],
        ),
        body: BlocListener<OnCreditCubit, OnCreditState>(
          listener: (context, state) {
            if (state is OnCreditMarkedAsPaid) {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('Veresiye ödendi olarak işaretlendi'),
                  backgroundColor: Colors.green,
                ),
              );
              // Refresh the detail after marking as paid
              context.read<OnCreditCubit>().getOnCreditById(onCreditId);
            }
          },
          child: BlocBuilder<OnCreditCubit, OnCreditState>(
            builder: (context, state) {
              if (state is OnCreditLoading) {
                return const Center(child: CircularProgressIndicator());
              } else if (state is OnCreditDetailLoaded) {
                final onCredit = state.onCredit;
                return SingleChildScrollView(
                  padding: const EdgeInsets.all(16.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Status Card
                      Card(
                        color: onCredit.isPaid
                            ? Colors.green[50]
                            : Colors.red[50],
                        child: Padding(
                          padding: const EdgeInsets.all(16.0),
                          child: Row(
                            children: [
                              Icon(
                                onCredit.isPaid
                                    ? Icons.check_circle
                                    : Icons.pending,
                                color: onCredit.isPaid
                                    ? Colors.green
                                    : Colors.red,
                                size: 32,
                              ),
                              const SizedBox(width: 16),
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      onCredit.statusText,
                                      style: TextStyle(
                                        fontSize: 18,
                                        fontWeight: FontWeight.bold,
                                        color: onCredit.isPaid
                                            ? Colors.green
                                            : Colors.red,
                                      ),
                                    ),
                                    Text(
                                      onCredit.formattedAmount,
                                      style: const TextStyle(
                                        fontSize: 24,
                                        fontWeight: FontWeight.bold,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                      const SizedBox(height: 16),

                      // Customer Information
                      Card(
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
                                  color: Colors.red,
                                ),
                              ),
                              const Divider(),
                              const SizedBox(height: 8),
                              if (onCredit.customerName != null) ...[
                                _DetailRow(
                                  icon: Icons.person,
                                  label: 'Ad',
                                  value: onCredit.customerName!,
                                ),
                                const SizedBox(height: 16),
                              ],
                              if (onCredit.customerSurname != null) ...[
                                _DetailRow(
                                  icon: Icons.person_outline,
                                  label: 'Soyad',
                                  value: onCredit.customerSurname!,
                                ),
                                const SizedBox(height: 16),
                              ],
                              if (onCredit.customerFullName.isEmpty) ...[
                                _DetailRow(
                                  icon: Icons.person,
                                  label: 'Müşteri',
                                  value: 'Müşteri bilgisi mevcut değil',
                                  valueStyle: TextStyle(
                                    fontSize: 16,
                                    fontStyle: FontStyle.italic,
                                    color: Colors.grey[600],
                                  ),
                                ),
                                const SizedBox(height: 16),
                              ],
                              if (onCredit.customerId != null) ...[
                                _DetailRow(
                                  icon: Icons.tag,
                                  label: 'Müşteri ID',
                                  value: onCredit.customerId!,
                                  valueStyle: const TextStyle(
                                    fontFamily: 'monospace',
                                    fontSize: 12,
                                  ),
                                ),
                              ],
                            ],
                          ),
                        ),
                      ),
                      const SizedBox(height: 16),

                      // Employee Information
                      if (onCredit.employeeName != null ||
                          onCredit.employeeSurname != null) ...[
                        Card(
                          child: Padding(
                            padding: const EdgeInsets.all(16.0),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                const Text(
                                  'Çalışan Bilgileri',
                                  style: TextStyle(
                                    fontSize: 18,
                                    fontWeight: FontWeight.bold,
                                    color: Colors.red,
                                  ),
                                ),
                                const Divider(),
                                const SizedBox(height: 8),
                                if (onCredit.employeeName != null) ...[
                                  _DetailRow(
                                    icon: Icons.badge,
                                    label: 'Ad',
                                    value: onCredit.employeeName!,
                                  ),
                                  const SizedBox(height: 16),
                                ],
                                if (onCredit.employeeSurname != null) ...[
                                  _DetailRow(
                                    icon: Icons.badge_outlined,
                                    label: 'Soyad',
                                    value: onCredit.employeeSurname!,
                                  ),
                                  const SizedBox(height: 16),
                                ],
                                if (onCredit.employeeId != null) ...[
                                  _DetailRow(
                                    icon: Icons.tag,
                                    label: 'Çalışan ID',
                                    value: onCredit.employeeId!,
                                    valueStyle: const TextStyle(
                                      fontFamily: 'monospace',
                                      fontSize: 12,
                                    ),
                                  ),
                                ],
                              ],
                            ),
                          ),
                        ),
                        const SizedBox(height: 16),
                      ],

                      // Additional Information
                      Card(
                        child: Padding(
                          padding: const EdgeInsets.all(16.0),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const Text(
                                'Ek Bilgiler',
                                style: TextStyle(
                                  fontSize: 18,
                                  fontWeight: FontWeight.bold,
                                  color: Colors.red,
                                ),
                              ),
                              const Divider(),
                              const SizedBox(height: 8),
                              _DetailRow(
                                icon: Icons.monetization_on,
                                label: 'Tutar',
                                value: onCredit.formattedAmount,
                                valueStyle: const TextStyle(
                                  fontSize: 18,
                                  fontWeight: FontWeight.bold,
                                  color: Colors.green,
                                ),
                              ),
                              const SizedBox(height: 16),
                              _DetailRow(
                                icon: onCredit.isPaid
                                    ? Icons.check_circle
                                    : Icons.pending,
                                label: 'Durum',
                                value: onCredit.statusText,
                                valueStyle: TextStyle(
                                  fontSize: 16,
                                  fontWeight: FontWeight.bold,
                                  color: onCredit.isPaid
                                      ? Colors.green
                                      : Colors.red,
                                ),
                              ),
                              if (onCredit.note != null &&
                                  onCredit.note!.isNotEmpty) ...[
                                const SizedBox(height: 16),
                                _DetailRow(
                                  icon: Icons.note,
                                  label: 'Not',
                                  value: onCredit.note!,
                                  maxLines: 3,
                                ),
                              ],
                            ],
                          ),
                        ),
                      ),
                      const SizedBox(height: 16),

                      // System Information
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
                                  color: Colors.red,
                                ),
                              ),
                              const Divider(),
                              const SizedBox(height: 8),
                              if (onCredit.createdDate != null) ...[
                                _DetailRow(
                                  icon: Icons.calendar_today,
                                  label: 'Oluşturulma Tarihi',
                                  value: _formatDate(onCredit.createdDate!),
                                ),
                                const SizedBox(height: 16),
                              ],
                              if (onCredit.updatedDate != null) ...[
                                _DetailRow(
                                  icon: Icons.update,
                                  label: 'Güncellenme Tarihi',
                                  value: _formatDate(onCredit.updatedDate!),
                                ),
                                const SizedBox(height: 16),
                              ],
                              _DetailRow(
                                icon: Icons.tag,
                                label: 'ID',
                                value: onCredit.id,
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
              } else if (state is OnCreditError) {
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
                          context.read<OnCreditCubit>().getOnCreditById(
                            onCreditId,
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
      ),
    );
  }

  void _showMarkAsPaidDialog(
    BuildContext context,
    String onCreditId,
    String customerName,
    String amount,
  ) {
    showDialog(
      context: context,
      builder: (dialogContext) => AlertDialog(
        title: const Text('Ödendi Olarak İşaretle'),
        content: Text(
          '$customerName için olan $amount tutarındaki veresiye kaydını ödendi olarak işaretlemek istediğinizden emin misiniz?',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(dialogContext).pop(),
            child: const Text('İptal'),
          ),
          TextButton(
            onPressed: () {
              Navigator.of(dialogContext).pop();
              context.read<OnCreditCubit>().markAsPaid(onCreditId);
            },
            style: TextButton.styleFrom(foregroundColor: Colors.green),
            child: const Text('Ödendi Olarak İşaretle'),
          ),
        ],
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
