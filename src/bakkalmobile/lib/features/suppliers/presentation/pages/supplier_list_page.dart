import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/network/api_service.dart';
import '../../../../shared/widgets/navigation_drawer.dart' as nav;
import '../../data/repositories/supplier_repository.dart';
import '../cubit/supplier_cubit.dart';
import '../widgets/supplier_list_item.dart';

class SupplierListPage extends StatelessWidget {
  const SupplierListPage({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (context) =>
          SupplierCubit(SupplierRepository(ApiService()))..getSuppliers(),
      child: Scaffold(
        appBar: AppBar(
          title: const Text('Tedarikçiler'),
          backgroundColor: Colors.blue,
          foregroundColor: Colors.white,
          actions: [
            IconButton(
              icon: const Icon(Icons.add),
              onPressed: () {
                context.push('/suppliers/add');
              },
            ),
          ],
        ),
        drawer: const nav.NavigationDrawer(),
        body: BlocBuilder<SupplierCubit, SupplierState>(
          builder: (context, state) {
            if (state is SupplierLoading) {
              return const Center(child: CircularProgressIndicator());
            } else if (state is SupplierLoaded) {
              if (state.suppliers.isEmpty) {
                return const Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(
                        Icons.local_shipping_outlined,
                        size: 64,
                        color: Colors.grey,
                      ),
                      SizedBox(height: 16),
                      Text(
                        'Henüz tedarikçi eklenmemiş',
                        style: TextStyle(fontSize: 18, color: Colors.grey),
                      ),
                      SizedBox(height: 8),
                      Text(
                        'Yeni tedarikçi eklemek için + butonuna tıklayın',
                        style: TextStyle(fontSize: 14, color: Colors.grey),
                      ),
                    ],
                  ),
                );
              }

              return RefreshIndicator(
                onRefresh: () async {
                  context.read<SupplierCubit>().getSuppliers();
                },
                child: ListView.builder(
                  padding: const EdgeInsets.all(8.0),
                  itemCount: state.suppliers.length,
                  itemBuilder: (context, index) {
                    final supplier = state.suppliers[index];
                    return SupplierListItem(
                      supplier: supplier,
                      onTap: () {
                        context.push('/suppliers/${supplier.id}');
                      },
                      onEdit: () {
                        context.push('/suppliers/${supplier.id}/edit');
                      },
                      onDelete: () {
                        _showDeleteDialog(
                          context,
                          supplier.id,
                          supplier.nameSurname,
                        );
                      },
                    );
                  },
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
                        context.read<SupplierCubit>().getSuppliers();
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
    String supplierId,
    String supplierName,
  ) {
    showDialog(
      context: context,
      builder: (dialogContext) => AlertDialog(
        title: const Text('Tedarikçiyi Sil'),
        content: Text(
          '$supplierName adlı tedarikçiyi silmek istediğinizden emin misiniz?',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(dialogContext).pop(),
            child: const Text('İptal'),
          ),
          TextButton(
            onPressed: () {
              Navigator.of(dialogContext).pop();
              context.read<SupplierCubit>().deleteSupplier(supplierId);
            },
            style: TextButton.styleFrom(foregroundColor: Colors.red),
            child: const Text('Sil'),
          ),
        ],
      ),
    );
  }
}
