import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/network/api_service.dart';
import '../../data/models/on_credit_model.dart';
import '../../data/repositories/on_credit_repository.dart';
import '../cubit/on_credit_cubit.dart';

class OnCreditFormPage extends StatefulWidget {
  final String? onCreditId;
  final bool isEdit;

  const OnCreditFormPage({super.key, this.onCreditId, this.isEdit = false});

  @override
  State<OnCreditFormPage> createState() => _OnCreditFormPageState();
}

class _OnCreditFormPageState extends State<OnCreditFormPage> {
  final _formKey = GlobalKey<FormState>();
  final _customerNameController = TextEditingController();
  final _customerSurnameController = TextEditingController();
  final _employeeNameController = TextEditingController();
  final _employeeSurnameController = TextEditingController();
  final _totalAmountController = TextEditingController();
  final _noteController = TextEditingController();

  bool _isPaid = false;

  @override
  void dispose() {
    _customerNameController.dispose();
    _customerSurnameController.dispose();
    _employeeNameController.dispose();
    _employeeSurnameController.dispose();
    _totalAmountController.dispose();
    _noteController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (context) {
        final cubit = OnCreditCubit(OnCreditRepository(ApiService()));
        if (widget.isEdit && widget.onCreditId != null) {
          cubit.getOnCreditById(widget.onCreditId!);
        }
        return cubit;
      },
      child: Scaffold(
        appBar: AppBar(
          title: Text(widget.isEdit ? 'Veresiye Düzenle' : 'Yeni Veresiye'),
          backgroundColor: Colors.red,
          foregroundColor: Colors.white,
        ),
        body: BlocConsumer<OnCreditCubit, OnCreditState>(
          listener: (context, state) {
            if (state is OnCreditCreated) {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('Veresiye kaydı başarıyla oluşturuldu'),
                  backgroundColor: Colors.green,
                ),
              );
              context.pop();
            } else if (state is OnCreditUpdated) {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('Veresiye kaydı başarıyla güncellendi'),
                  backgroundColor: Colors.green,
                ),
              );
              context.pop();
            } else if (state is OnCreditError) {
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  content: Text('Hata: ${state.message}'),
                  backgroundColor: Colors.red,
                ),
              );
            } else if (state is OnCreditDetailLoaded && widget.isEdit) {
              final onCredit = state.onCredit;
              _customerNameController.text = onCredit.customerName ?? '';
              _customerSurnameController.text = onCredit.customerSurname ?? '';
              _employeeNameController.text = onCredit.employeeName ?? '';
              _employeeSurnameController.text = onCredit.employeeSurname ?? '';
              _totalAmountController.text = onCredit.totalAmount.toString();
              _noteController.text = onCredit.note ?? '';
              _isPaid = onCredit.isPaid;
              setState(() {});
            }
          },
          builder: (context, state) {
            if (state is OnCreditLoading && widget.isEdit) {
              return const Center(child: CircularProgressIndicator());
            }

            return Form(
              key: _formKey,
              child: SingleChildScrollView(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    // Customer Information Card
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
                            const SizedBox(height: 16),
                            TextFormField(
                              controller: _customerNameController,
                              decoration: const InputDecoration(
                                labelText: 'Müşteri Adı',
                                hintText: 'Ahmet',
                                prefixIcon: Icon(Icons.person),
                                border: OutlineInputBorder(),
                              ),
                              validator: (value) {
                                if (value == null || value.isEmpty) {
                                  return 'Müşteri adı gerekli';
                                }
                                if (value.length < 2) {
                                  return 'Müşteri adı en az 2 karakter olmalı';
                                }
                                return null;
                              },
                            ),
                            const SizedBox(height: 16),
                            TextFormField(
                              controller: _customerSurnameController,
                              decoration: const InputDecoration(
                                labelText: 'Müşteri Soyadı',
                                hintText: 'Yılmaz',
                                prefixIcon: Icon(Icons.person_outline),
                                border: OutlineInputBorder(),
                              ),
                              validator: (value) {
                                if (value == null || value.isEmpty) {
                                  return 'Müşteri soyadı gerekli';
                                }
                                if (value.length < 2) {
                                  return 'Müşteri soyadı en az 2 karakter olmalı';
                                }
                                return null;
                              },
                            ),
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(height: 16),

                    // Employee Information Card (Optional)
                    Card(
                      child: Padding(
                        padding: const EdgeInsets.all(16.0),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text(
                              'Çalışan Bilgileri (İsteğe Bağlı)',
                              style: TextStyle(
                                fontSize: 18,
                                fontWeight: FontWeight.bold,
                                color: Colors.red,
                              ),
                            ),
                            const Divider(),
                            const SizedBox(height: 16),
                            TextFormField(
                              controller: _employeeNameController,
                              decoration: const InputDecoration(
                                labelText: 'Çalışan Adı',
                                hintText: 'Mehmet',
                                prefixIcon: Icon(Icons.badge),
                                border: OutlineInputBorder(),
                              ),
                            ),
                            const SizedBox(height: 16),
                            TextFormField(
                              controller: _employeeSurnameController,
                              decoration: const InputDecoration(
                                labelText: 'Çalışan Soyadı',
                                hintText: 'Demir',
                                prefixIcon: Icon(Icons.badge_outlined),
                                border: OutlineInputBorder(),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(height: 16),

                    // Payment Information Card
                    Card(
                      child: Padding(
                        padding: const EdgeInsets.all(16.0),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text(
                              'Ödeme Bilgileri',
                              style: TextStyle(
                                fontSize: 18,
                                fontWeight: FontWeight.bold,
                                color: Colors.red,
                              ),
                            ),
                            const Divider(),
                            const SizedBox(height: 16),
                            TextFormField(
                              controller: _totalAmountController,
                              decoration: const InputDecoration(
                                labelText: 'Toplam Tutar',
                                hintText: '0.00',
                                prefixIcon: Icon(Icons.monetization_on),
                                suffixText: '₺',
                                border: OutlineInputBorder(),
                              ),
                              keyboardType:
                                  const TextInputType.numberWithOptions(
                                    decimal: true,
                                  ),
                              inputFormatters: [
                                FilteringTextInputFormatter.allow(
                                  RegExp(r'^\d+\.?\d{0,2}'),
                                ),
                              ],
                              validator: (value) {
                                if (value == null || value.isEmpty) {
                                  return 'Toplam tutar gerekli';
                                }
                                final double? amount = double.tryParse(value);
                                if (amount == null) {
                                  return 'Geçerli bir tutar girin';
                                }
                                if (amount <= 0) {
                                  return 'Tutar 0\'dan büyük olmalı';
                                }
                                return null;
                              },
                            ),
                            const SizedBox(height: 16),
                            Row(
                              children: [
                                const Icon(Icons.payment, color: Colors.grey),
                                const SizedBox(width: 8),
                                const Text(
                                  'Ödendi mi?',
                                  style: TextStyle(fontSize: 16),
                                ),
                                const Spacer(),
                                Switch(
                                  value: _isPaid,
                                  onChanged: (value) {
                                    setState(() {
                                      _isPaid = value;
                                    });
                                  },
                                  activeColor: Colors.green,
                                ),
                              ],
                            ),
                            const SizedBox(height: 8),
                            Row(
                              children: [
                                Icon(
                                  _isPaid ? Icons.check_circle : Icons.pending,
                                  color: _isPaid ? Colors.green : Colors.red,
                                  size: 16,
                                ),
                                const SizedBox(width: 8),
                                Text(
                                  _isPaid ? 'Ödendi' : 'Ödenmedi',
                                  style: TextStyle(
                                    color: _isPaid ? Colors.green : Colors.red,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                              ],
                            ),
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(height: 16),

                    // Additional Information Card
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
                            const SizedBox(height: 16),
                            TextFormField(
                              controller: _noteController,
                              decoration: const InputDecoration(
                                labelText: 'Not (İsteğe bağlı)',
                                hintText: 'Ek bilgiler...',
                                prefixIcon: Icon(Icons.note),
                                border: OutlineInputBorder(),
                              ),
                              maxLines: 3,
                              maxLength: 500,
                            ),
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(height: 24),

                    // Action Buttons
                    Row(
                      children: [
                        Expanded(
                          child: OutlinedButton(
                            onPressed: () => context.pop(),
                            child: const Text('İptal'),
                          ),
                        ),
                        const SizedBox(width: 16),
                        Expanded(
                          child: ElevatedButton(
                            onPressed: state is OnCreditLoading
                                ? null
                                : () => _submitForm(context),
                            style: ElevatedButton.styleFrom(
                              backgroundColor: Colors.red,
                              foregroundColor: Colors.white,
                            ),
                            child: state is OnCreditLoading
                                ? const SizedBox(
                                    width: 20,
                                    height: 20,
                                    child: CircularProgressIndicator(
                                      strokeWidth: 2,
                                      valueColor: AlwaysStoppedAnimation<Color>(
                                        Colors.white,
                                      ),
                                    ),
                                  )
                                : Text(widget.isEdit ? 'Güncelle' : 'Kaydet'),
                          ),
                        ),
                      ],
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

  void _submitForm(BuildContext context) {
    if (_formKey.currentState!.validate()) {
      final customerName = _customerNameController.text.trim();
      final customerSurname = _customerSurnameController.text.trim();
      final employeeName = _employeeNameController.text.trim();
      final employeeSurname = _employeeSurnameController.text.trim();
      final totalAmount = double.parse(_totalAmountController.text.trim());
      final note = _noteController.text.trim();

      if (widget.isEdit && widget.onCreditId != null) {
        final request = UpdateOnCreditRequest(
          id: widget.onCreditId!,
          customerName: customerName.isEmpty ? null : customerName,
          customerSurname: customerSurname.isEmpty ? null : customerSurname,
          employeeName: employeeName.isEmpty ? null : employeeName,
          employeeSurname: employeeSurname.isEmpty ? null : employeeSurname,
          totalAmount: totalAmount,
          isPaid: _isPaid,
          note: note.isEmpty ? null : note,
        );
        context.read<OnCreditCubit>().updateOnCredit(request);
      } else {
        final request = CreateOnCreditRequest(
          customerName: customerName.isEmpty ? null : customerName,
          customerSurname: customerSurname.isEmpty ? null : customerSurname,
          employeeName: employeeName.isEmpty ? null : employeeName,
          employeeSurname: employeeSurname.isEmpty ? null : employeeSurname,
          totalAmount: totalAmount,
          isPaid: _isPaid,
          note: note.isEmpty ? null : note,
        );
        context.read<OnCreditCubit>().createOnCredit(request);
      }
    }
  }
}
