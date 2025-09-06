import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/network/api_service.dart';
import '../../data/models/customer_model.dart';
import '../../data/repositories/customer_repository.dart';
import '../cubit/customer_cubit.dart';

class CustomerFormPage extends StatefulWidget {
  final String? customerId;
  final bool isEdit;

  const CustomerFormPage({super.key, this.customerId, this.isEdit = false});

  @override
  State<CustomerFormPage> createState() => _CustomerFormPageState();
}

class _CustomerFormPageState extends State<CustomerFormPage> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _surnameController = TextEditingController();
  final _phoneNumberController = TextEditingController();
  final _noteController = TextEditingController();

  @override
  void dispose() {
    _nameController.dispose();
    _surnameController.dispose();
    _phoneNumberController.dispose();
    _noteController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (context) {
        final cubit = CustomerCubit(CustomerRepository(ApiService()));
        if (widget.isEdit && widget.customerId != null) {
          cubit.getCustomerById(widget.customerId!);
        }
        return cubit;
      },
      child: Scaffold(
        appBar: AppBar(
          title: Text(widget.isEdit ? 'Müşteri Düzenle' : 'Yeni Müşteri'),
          backgroundColor: Colors.orange,
          foregroundColor: Colors.white,
        ),
        body: BlocConsumer<CustomerCubit, CustomerState>(
          listener: (context, state) {
            if (state is CustomerCreated) {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('Müşteri başarıyla oluşturuldu'),
                  backgroundColor: Colors.green,
                ),
              );
              context.pop();
            } else if (state is CustomerUpdated) {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('Müşteri başarıyla güncellendi'),
                  backgroundColor: Colors.green,
                ),
              );
              context.pop();
            } else if (state is CustomerError) {
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  content: Text('Hata: ${state.message}'),
                  backgroundColor: Colors.red,
                ),
              );
            } else if (state is CustomerDetailLoaded && widget.isEdit) {
              final customer = state.customer;
              _nameController.text = customer.name;
              _surnameController.text = customer.surname;
              _phoneNumberController.text = customer.phoneNumber;
              _noteController.text = customer.note ?? '';
            }
          },
          builder: (context, state) {
            if (state is CustomerLoading && widget.isEdit) {
              return const Center(child: CircularProgressIndicator());
            }

            return Form(
              key: _formKey,
              child: SingleChildScrollView(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
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
                                color: Colors.orange,
                              ),
                            ),
                            const Divider(),
                            const SizedBox(height: 16),
                            TextFormField(
                              controller: _nameController,
                              decoration: const InputDecoration(
                                labelText: 'Ad',
                                hintText: 'Ahmet',
                                prefixIcon: Icon(Icons.person),
                                border: OutlineInputBorder(),
                              ),
                              validator: (value) {
                                if (value == null || value.isEmpty) {
                                  return 'Ad gerekli';
                                }
                                if (value.length < 2) {
                                  return 'Ad en az 2 karakter olmalı';
                                }
                                return null;
                              },
                            ),
                            const SizedBox(height: 16),
                            TextFormField(
                              controller: _surnameController,
                              decoration: const InputDecoration(
                                labelText: 'Soyad',
                                hintText: 'Yılmaz',
                                prefixIcon: Icon(Icons.person_outline),
                                border: OutlineInputBorder(),
                              ),
                              validator: (value) {
                                if (value == null || value.isEmpty) {
                                  return 'Soyad gerekli';
                                }
                                if (value.length < 2) {
                                  return 'Soyad en az 2 karakter olmalı';
                                }
                                return null;
                              },
                            ),
                            const SizedBox(height: 16),
                            TextFormField(
                              controller: _phoneNumberController,
                              decoration: const InputDecoration(
                                labelText: 'Telefon Numarası',
                                hintText: '0532 123 45 67',
                                prefixIcon: Icon(Icons.phone),
                                border: OutlineInputBorder(),
                              ),
                              keyboardType: TextInputType.phone,
                              validator: (value) {
                                if (value == null || value.isEmpty) {
                                  return 'Telefon numarası gerekli';
                                }
                                // Basit telefon numarası kontrolü
                                final phoneRegex = RegExp(r'^[0-9+\-\s()]+$');
                                if (!phoneRegex.hasMatch(value)) {
                                  return 'Geçerli bir telefon numarası girin';
                                }
                                return null;
                              },
                            ),
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
                            onPressed: state is CustomerLoading
                                ? null
                                : () => _submitForm(context),
                            style: ElevatedButton.styleFrom(
                              backgroundColor: Colors.orange,
                              foregroundColor: Colors.white,
                            ),
                            child: state is CustomerLoading
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
      if (widget.isEdit && widget.customerId != null) {
        final request = UpdateCustomerRequest(
          id: widget.customerId!,
          name: _nameController.text.trim(),
          surname: _surnameController.text.trim(),
          phoneNumber: _phoneNumberController.text.trim(),
          note: _noteController.text.trim().isEmpty
              ? null
              : _noteController.text.trim(),
        );
        context.read<CustomerCubit>().updateCustomer(request);
      } else {
        final request = CreateCustomerRequest(
          name: _nameController.text.trim(),
          surname: _surnameController.text.trim(),
          phoneNumber: _phoneNumberController.text.trim(),
          note: _noteController.text.trim().isEmpty
              ? null
              : _noteController.text.trim(),
        );
        context.read<CustomerCubit>().createCustomer(request);
      }
    }
  }
}
