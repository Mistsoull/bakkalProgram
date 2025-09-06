import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/network/api_service.dart';
import '../../data/repositories/category_repository.dart';
import '../cubit/category_cubit.dart';
import '../cubit/category_state.dart';

class CategoryFormPage extends StatefulWidget {
  final String? categoryId;
  final bool isEdit;

  const CategoryFormPage({super.key, this.categoryId, this.isEdit = false});

  @override
  State<CategoryFormPage> createState() => _CategoryFormPageState();
}

class _CategoryFormPageState extends State<CategoryFormPage> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();

  @override
  void dispose() {
    _nameController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (context) {
        final cubit = CategoryCubit(CategoryRepository(ApiService().dio));
        if (widget.isEdit && widget.categoryId != null) {
          cubit.getCategoryById(widget.categoryId!);
        }
        return cubit;
      },
      child: Scaffold(
        appBar: AppBar(
          title: Text(widget.isEdit ? 'Kategori Düzenle' : 'Yeni Kategori'),
          backgroundColor: Colors.blue,
          foregroundColor: Colors.white,
        ),
        body: BlocConsumer<CategoryCubit, CategoryState>(
          listener: (context, state) {
            if (state is CategoryDetailLoaded && widget.isEdit) {
              // Fill form with existing data
              _nameController.text = state.category.name;
            } else if (state is CategoryCreated) {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('Kategori başarıyla oluşturuldu'),
                  backgroundColor: Colors.green,
                ),
              );
              context.pop();
            } else if (state is CategoryUpdated) {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('Kategori başarıyla güncellendi'),
                  backgroundColor: Colors.green,
                ),
              );
              context.pop();
            } else if (state is CategoryError) {
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  content: Text(state.message),
                  backgroundColor: Colors.red,
                ),
              );
            }
          },
          builder: (context, state) {
            if (state is CategoryDetailLoading && widget.isEdit) {
              return const Center(child: CircularProgressIndicator());
            }

            return SingleChildScrollView(
              padding: const EdgeInsets.all(16.0),
              child: Form(
                key: _formKey,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    Card(
                      elevation: 2,
                      child: Padding(
                        padding: const EdgeInsets.all(16.0),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              widget.isEdit
                                  ? 'Kategori Bilgilerini Düzenle'
                                  : 'Yeni Kategori Bilgileri',
                              style: const TextStyle(
                                fontSize: 18,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            const SizedBox(height: 20),

                            // Name Field
                            TextFormField(
                              controller: _nameController,
                              decoration: const InputDecoration(
                                labelText: 'Kategori Adı *',
                                hintText: 'Kategori adını girin',
                                border: OutlineInputBorder(),
                                prefixIcon: Icon(Icons.category),
                              ),
                              validator: (value) {
                                if (value == null || value.trim().isEmpty) {
                                  return 'Kategori adı boş olamaz';
                                }
                                if (value.trim().length < 2) {
                                  return 'Kategori adı en az 2 karakter olmalıdır';
                                }
                                return null;
                              },
                              textInputAction: TextInputAction.done,
                            ),
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(height: 20),

                    // Save Button
                    ElevatedButton(
                      onPressed:
                          state is CategoryCreating || state is CategoryUpdating
                          ? null
                          : _saveCategory,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.blue,
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.symmetric(vertical: 15),
                        textStyle: const TextStyle(fontSize: 16),
                      ),
                      child:
                          state is CategoryCreating || state is CategoryUpdating
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

  void _saveCategory() {
    if (_formKey.currentState!.validate()) {
      final name = _nameController.text.trim();

      if (widget.isEdit && widget.categoryId != null) {
        context.read<CategoryCubit>().updateCategory(
          id: widget.categoryId!,
          name: name,
        );
      } else {
        context.read<CategoryCubit>().createCategory(name: name);
      }
    }
  }
}
