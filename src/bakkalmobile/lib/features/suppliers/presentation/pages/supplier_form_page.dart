import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/network/api_service.dart';
import '../../data/models/supplier_model.dart';
import '../../data/repositories/supplier_repository.dart';
import '../cubit/supplier_cubit.dart';

class SupplierFormPage extends StatefulWidget {
  final String? supplierId;
  final bool isEdit;

  const SupplierFormPage({super.key, this.supplierId, this.isEdit = false});

  @override
  State<SupplierFormPage> createState() => _SupplierFormPageState();
}

class _SupplierFormPageState extends State<SupplierFormPage> {
  final _formKey = GlobalKey<FormState>();
  final _nameSurnameController = TextEditingController();
  final _companyNameController = TextEditingController();
  final _phoneNumberController = TextEditingController();
  final _noteController = TextEditingController();

  @override
  void dispose() {
    _nameSurnameController.dispose();
    _companyNameController.dispose();
    _phoneNumberController.dispose();
    _noteController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (context) {
        final cubit = SupplierCubit(SupplierRepository(ApiService()));
        if (widget.isEdit && widget.supplierId != null) {
          cubit.getSupplierById(widget.supplierId!);
        }
        return cubit;
      },
      child: Scaffold(
        appBar: AppBar(
          title: Text(widget.isEdit ? 'Tedarikçi Düzenle' : 'Yeni Tedarikçi'),
          backgroundColor: Colors.blue,
          foregroundColor: Colors.white,
        ),
        body: BlocConsumer<SupplierCubit, SupplierState>(
          listener: (context, state) {
            if (state is SupplierCreated) {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('Tedarikçi başarıyla oluşturuldu'),
                  backgroundColor: Colors.green,
                ),
              );
              context.pop();
            } else if (state is SupplierUpdated) {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('Tedarikçi başarıyla güncellendi'),
                  backgroundColor: Colors.green,
                ),
              );
              context.pop();
            } else if (state is SupplierError) {
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  content: Text('Hata: ${state.message}'),
                  backgroundColor: Colors.red,
                ),
              );
            } else if (state is SupplierDetailLoaded && widget.isEdit) {
              final supplier = state.supplier;
              _nameSurnameController.text = supplier.nameSurname;
              _companyNameController.text = supplier.companyName;
              _phoneNumberController.text = supplier.phoneNumber;
              _noteController.text = supplier.note ?? '';
            }
          },
          builder: (context, state) {
            if (state is SupplierLoading && widget.isEdit) {
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
                              'Tedarikçi Bilgileri',
                              style: TextStyle(
                                fontSize: 18,
                                fontWeight: FontWeight.bold,
                                color: Colors.blue,
                              ),
                            ),
                            const Divider(),
                            const SizedBox(height: 16),
                            TextFormField(
                              controller: _nameSurnameController,
                              decoration: const InputDecoration(
                                labelText: 'İletişim Kişisi',
                                hintText: 'Ahmet Yılmaz',
                                prefixIcon: Icon(Icons.person),
                                border: OutlineInputBorder(),
                              ),
                              validator: (value) {
                                if (value == null || value.isEmpty) {
                                  return 'İletişim kişisi adı gerekli';
                                }
                                if (value.length < 2) {
                                  return 'İletişim kişisi adı en az 2 karakter olmalı';
                                }
                                return null;
                              },
                            ),
                            const SizedBox(height: 16),
                            TextFormField(
                              controller: _companyNameController,
                              decoration: const InputDecoration(
                                labelText: 'Firma Adı',
                                hintText: 'ABC Ltd. Şti.',
                                prefixIcon: Icon(Icons.business),
                                border: OutlineInputBorder(),
                              ),
                              validator: (value) {
                                if (value == null || value.isEmpty) {
                                  return 'Firma adı gerekli';
                                }
                                if (value.length < 2) {
                                  return 'Firma adı en az 2 karakter olmalı';
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
                            onPressed: state is SupplierLoading
                                ? null
                                : () => _submitForm(context),
                            style: ElevatedButton.styleFrom(
                              backgroundColor: Colors.blue,
                              foregroundColor: Colors.white,
                            ),
                            child: state is SupplierLoading
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
      if (widget.isEdit && widget.supplierId != null) {
        final request = UpdateSupplierRequest(
          id: widget.supplierId!,
          nameSurname: _nameSurnameController.text.trim(),
          companyName: _companyNameController.text.trim(),
          phoneNumber: _phoneNumberController.text.trim(),
          note: _noteController.text.trim().isEmpty
              ? null
              : _noteController.text.trim(),
        );
        context.read<SupplierCubit>().updateSupplier(request);
      } else {
        final request = CreateSupplierRequest(
          nameSurname: _nameSurnameController.text.trim(),
          companyName: _companyNameController.text.trim(),
          phoneNumber: _phoneNumberController.text.trim(),
          note: _noteController.text.trim().isEmpty
              ? null
              : _noteController.text.trim(),
        );
        context.read<SupplierCubit>().createSupplier(request);
      }
    }
  }
}
