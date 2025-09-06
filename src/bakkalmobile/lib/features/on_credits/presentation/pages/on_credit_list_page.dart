import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/network/api_service.dart';
import '../../../../shared/widgets/navigation_drawer.dart' as nav;
import '../../data/repositories/on_credit_repository.dart';
import '../cubit/on_credit_cubit.dart';
import '../widgets/on_credit_list_item.dart';

class OnCreditListPage extends StatelessWidget {
  const OnCreditListPage({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (context) =>
          OnCreditCubit(OnCreditRepository(ApiService()))..getOnCredits(),
      child: Scaffold(
        appBar: AppBar(
          title: const Text('Veresiye Defteri'),
          backgroundColor: Colors.red,
          foregroundColor: Colors.white,
          actions: [
            IconButton(
              icon: const Icon(Icons.add),
              onPressed: () {
                context.push('/on-credits/add');
              },
            ),
          ],
        ),
        drawer: const nav.NavigationDrawer(),
        body: BlocListener<OnCreditCubit, OnCreditState>(
          listener: (context, state) {
            if (state is OnCreditMarkedAsPaid) {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('Veresiye ödendi olarak işaretlendi'),
                  backgroundColor: Colors.green,
                ),
              );
            } else if (state is OnCreditDeleted) {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('Veresiye kaydı silindi'),
                  backgroundColor: Colors.orange,
                ),
              );
            }
          },
          child: BlocBuilder<OnCreditCubit, OnCreditState>(
            builder: (context, state) {
              if (state is OnCreditLoading) {
                return const Center(child: CircularProgressIndicator());
              } else if (state is OnCreditLoaded) {
                if (state.onCredits.isEmpty) {
                  return const Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(
                          Icons.account_balance_wallet_outlined,
                          size: 64,
                          color: Colors.grey,
                        ),
                        SizedBox(height: 16),
                        Text(
                          'Henüz veresiye kaydı eklenmemiş',
                          style: TextStyle(fontSize: 18, color: Colors.grey),
                        ),
                        SizedBox(height: 8),
                        Text(
                          'Yeni veresiye kaydı eklemek için + butonuna tıklayın',
                          style: TextStyle(fontSize: 14, color: Colors.grey),
                        ),
                      ],
                    ),
                  );
                }

                return RefreshIndicator(
                  onRefresh: () async {
                    context.read<OnCreditCubit>().getOnCredits();
                  },
                  child: ListView.builder(
                    padding: const EdgeInsets.all(8.0),
                    itemCount: state.onCredits.length,
                    itemBuilder: (context, index) {
                      final onCredit = state.onCredits[index];
                      return OnCreditListItem(
                        onCredit: onCredit,
                        onTap: () {
                          context.push('/on-credits/${onCredit.id}');
                        },
                        onEdit: () {
                          context.push('/on-credits/${onCredit.id}/edit');
                        },
                        onDelete: () {
                          _showDeleteDialog(
                            context,
                            onCredit.id,
                            onCredit.customerFullName.isNotEmpty
                                ? onCredit.customerFullName
                                : 'Müşteri',
                          );
                        },
                        onMarkAsPaid: () {
                          _showMarkAsPaidDialog(
                            context,
                            onCredit.id,
                            onCredit.customerFullName.isNotEmpty
                                ? onCredit.customerFullName
                                : 'Müşteri',
                            onCredit.formattedAmount,
                          );
                        },
                      );
                    },
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
                          context.read<OnCreditCubit>().getOnCredits();
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

  void _showDeleteDialog(
    BuildContext context,
    String onCreditId,
    String customerName,
  ) {
    showDialog(
      context: context,
      builder: (dialogContext) => AlertDialog(
        title: const Text('Veresiye Kaydını Sil'),
        content: Text(
          '$customerName için olan veresiye kaydını silmek istediğinizden emin misiniz?',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(dialogContext).pop(),
            child: const Text('İptal'),
          ),
          TextButton(
            onPressed: () {
              Navigator.of(dialogContext).pop();
              context.read<OnCreditCubit>().deleteOnCredit(onCreditId);
            },
            style: TextButton.styleFrom(foregroundColor: Colors.red),
            child: const Text('Sil'),
          ),
        ],
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
}
