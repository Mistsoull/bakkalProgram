import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/network/api_service.dart';
import '../../../../features/categories/data/models/category_model.dart';
import '../../../../features/categories/data/repositories/category_repository.dart';
import '../../data/models/product_model.dart';
import '../../data/repositories/product_repository.dart';
import '../cubit/product_cubit.dart';

class ProductFormPage extends StatefulWidget {
  final String? productId;
  final bool isEdit;

  const ProductFormPage({super.key, this.productId, this.isEdit = false});

  @override
  State<ProductFormPage> createState() => _ProductFormPageState();
}

class _ProductFormPageState extends State<ProductFormPage> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _priceController = TextEditingController();

  String? _selectedCategoryId;
  List<CategoryModel> _categories = [];
  bool _loadingCategories = true;

  @override
  void initState() {
    super.initState();
    _loadCategories();
  }

  @override
  void dispose() {
    _nameController.dispose();
    _priceController.dispose();
    super.dispose();
  }

  Future<void> _loadCategories() async {
    try {
      final categoryRepository = CategoryRepository(ApiService().dio);
      final paginatedResponse = await categoryRepository.getCategories(
        pageSize: 100,
      );
      setState(() {
        _categories = paginatedResponse.items;
        _loadingCategories = false;
      });
    } catch (e) {
      setState(() {
        _loadingCategories = false;
      });
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Kategoriler yüklenirken hata: $e'),
            backgroundColor: Colors.red,
          ),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (context) {
        final cubit = ProductCubit(ProductRepository(ApiService()));
        if (widget.isEdit && widget.productId != null) {
          cubit.getProductById(widget.productId!);
        }
        return cubit;
      },
      child: Scaffold(
        appBar: AppBar(
          title: Text(widget.isEdit ? 'Ürün Düzenle' : 'Yeni Ürün'),
          backgroundColor: Colors.purple,
          foregroundColor: Colors.white,
        ),
        body: BlocConsumer<ProductCubit, ProductState>(
          listener: (context, state) {
            if (state is ProductCreated) {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('Ürün başarıyla oluşturuldu'),
                  backgroundColor: Colors.green,
                ),
              );
              context.pop();
            } else if (state is ProductUpdated) {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('Ürün başarıyla güncellendi'),
                  backgroundColor: Colors.green,
                ),
              );
              context.pop();
            } else if (state is ProductError) {
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  content: Text('Hata: ${state.message}'),
                  backgroundColor: Colors.red,
                ),
              );
            } else if (state is ProductDetailLoaded && widget.isEdit) {
              final product = state.product;
              _nameController.text = product.name;
              _priceController.text = product.price.toString();
              _selectedCategoryId = product.categoryId;
            }
          },
          builder: (context, state) {
            if (state is ProductLoading && widget.isEdit) {
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
                              'Ürün Bilgileri',
                              style: TextStyle(
                                fontSize: 18,
                                fontWeight: FontWeight.bold,
                                color: Colors.purple,
                              ),
                            ),
                            const Divider(),
                            const SizedBox(height: 16),
                            TextFormField(
                              controller: _nameController,
                              decoration: const InputDecoration(
                                labelText: 'Ürün Adı',
                                hintText: 'Örn: Ekmek',
                                prefixIcon: Icon(Icons.inventory_2),
                                border: OutlineInputBorder(),
                              ),
                              validator: (value) {
                                if (value == null || value.isEmpty) {
                                  return 'Ürün adı gerekli';
                                }
                                if (value.length < 2) {
                                  return 'Ürün adı en az 2 karakter olmalı';
                                }
                                return null;
                              },
                            ),
                            const SizedBox(height: 16),
                            TextFormField(
                              controller: _priceController,
                              decoration: const InputDecoration(
                                labelText: 'Fiyat',
                                hintText: '0.00',
                                prefixIcon: Icon(Icons.monetization_on),
                                border: OutlineInputBorder(),
                                suffixText: '₺',
                              ),
                              keyboardType:
                                  const TextInputType.numberWithOptions(
                                    decimal: true,
                                  ),
                              validator: (value) {
                                if (value == null || value.isEmpty) {
                                  return 'Fiyat gerekli';
                                }
                                final price = double.tryParse(value);
                                if (price == null) {
                                  return 'Geçerli bir fiyat girin';
                                }
                                if (price < 0) {
                                  return 'Fiyat negatif olamaz';
                                }
                                return null;
                              },
                            ),
                            const SizedBox(height: 16),
                            _loadingCategories
                                ? const LinearProgressIndicator()
                                : DropdownButtonFormField<String>(
                                    value: _selectedCategoryId,
                                    decoration: const InputDecoration(
                                      labelText: 'Kategori',
                                      prefixIcon: Icon(Icons.category),
                                      border: OutlineInputBorder(),
                                    ),
                                    hint: const Text('Kategori seçin'),
                                    items: _categories.map((category) {
                                      return DropdownMenuItem<String>(
                                        value: category.id,
                                        child: Text(category.name),
                                      );
                                    }).toList(),
                                    onChanged: (value) {
                                      setState(() {
                                        _selectedCategoryId = value;
                                      });
                                    },
                                    validator: (value) {
                                      if (value == null || value.isEmpty) {
                                        return 'Kategori seçimi gerekli';
                                      }
                                      return null;
                                    },
                                  ),
                            if (_categories.isEmpty && !_loadingCategories) ...[
                              const SizedBox(height: 8),
                              Container(
                                padding: const EdgeInsets.all(12),
                                decoration: BoxDecoration(
                                  color: Colors.orange[50],
                                  borderRadius: BorderRadius.circular(8),
                                  border: Border.all(color: Colors.orange),
                                ),
                                child: Row(
                                  children: [
                                    Icon(
                                      Icons.warning,
                                      color: Colors.orange[700],
                                    ),
                                    const SizedBox(width: 12),
                                    const Expanded(
                                      child: Text(
                                        'Henüz kategori eklenmemiş. Önce kategori eklemeniz gerekir.',
                                        style: TextStyle(fontSize: 14),
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ],
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
                            onPressed:
                                state is ProductLoading || _loadingCategories
                                ? null
                                : () => _submitForm(context),
                            style: ElevatedButton.styleFrom(
                              backgroundColor: Colors.purple,
                              foregroundColor: Colors.white,
                            ),
                            child: state is ProductLoading
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
      final price = double.parse(_priceController.text);

      if (widget.isEdit && widget.productId != null) {
        final request = UpdateProductRequest(
          id: widget.productId!,
          name: _nameController.text.trim(),
          price: price,
          categoryId: _selectedCategoryId!,
        );
        context.read<ProductCubit>().updateProduct(request);
      } else {
        final request = CreateProductRequest(
          name: _nameController.text.trim(),
          price: price,
          categoryId: _selectedCategoryId!,
        );
        context.read<ProductCubit>().createProduct(request);
      }
    }
  }
}
