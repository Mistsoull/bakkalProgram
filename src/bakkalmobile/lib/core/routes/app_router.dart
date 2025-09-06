import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../features/dashboard/presentation/pages/dashboard_page.dart';
import '../../features/suppliers/presentation/pages/supplier_list_page.dart';
import '../../features/suppliers/presentation/pages/supplier_detail_page.dart';
import '../../features/suppliers/presentation/pages/supplier_form_page.dart';
import '../../features/customers/presentation/pages/customer_list_page.dart';
import '../../features/customers/presentation/pages/customer_detail_page.dart';
import '../../features/customers/presentation/pages/customer_form_page.dart';
import '../../features/categories/presentation/pages/category_list_page.dart';
import '../../features/categories/presentation/pages/category_detail_page.dart';
import '../../features/categories/presentation/pages/category_form_page.dart';
import '../../features/orders/presentation/pages/order_list_page.dart';
import '../../features/orders/presentation/pages/order_detail_page.dart';
import '../../features/orders/presentation/pages/order_form_page.dart';
import '../../features/on_credits/presentation/pages/on_credit_list_page.dart';
import '../../features/on_credits/presentation/pages/on_credit_detail_page.dart';
import '../../features/on_credits/presentation/pages/on_credit_form_page.dart';
import '../../features/products/presentation/pages/product_list_page.dart';
import '../../features/products/presentation/pages/product_detail_page.dart';
import '../../features/products/presentation/pages/product_form_page.dart';

final router = GoRouter(
  initialLocation: '/',
  routes: [
    GoRoute(
      path: '/',
      builder: (context, state) => const DashboardPage(),
      routes: [
        // Supplier routes - hierarchical
        GoRoute(
          path: 'suppliers',
          builder: (context, state) => const SupplierListPage(),
          routes: [
            GoRoute(
              path: 'add',
              builder: (context, state) => const SupplierFormPage(),
            ),
            GoRoute(
              path: ':id',
              builder: (context, state) {
                final id = state.pathParameters['id']!;
                return SupplierDetailPage(supplierId: id);
              },
              routes: [
                GoRoute(
                  path: 'edit',
                  builder: (context, state) {
                    final id = state.pathParameters['id']!;
                    return SupplierFormPage(supplierId: id, isEdit: true);
                  },
                ),
              ],
            ),
          ],
        ),

        // Customer routes - hierarchical
        GoRoute(
          path: 'customers',
          builder: (context, state) => const CustomerListPage(),
          routes: [
            GoRoute(
              path: 'add',
              builder: (context, state) => const CustomerFormPage(),
            ),
            GoRoute(
              path: ':id',
              builder: (context, state) {
                final id = state.pathParameters['id']!;
                return CustomerDetailPage(customerId: id);
              },
              routes: [
                GoRoute(
                  path: 'edit',
                  builder: (context, state) {
                    final id = state.pathParameters['id']!;
                    return CustomerFormPage(customerId: id, isEdit: true);
                  },
                ),
              ],
            ),
          ],
        ),

        // Category routes - hierarchical
        GoRoute(
          path: 'categories',
          builder: (context, state) => const CategoryListPage(),
          routes: [
            GoRoute(
              path: 'add',
              builder: (context, state) => const CategoryFormPage(),
            ),
            GoRoute(
              path: ':id',
              builder: (context, state) {
                final id = state.pathParameters['id']!;
                return CategoryDetailPage(categoryId: id);
              },
              routes: [
                GoRoute(
                  path: 'edit',
                  builder: (context, state) {
                    final id = state.pathParameters['id']!;
                    return CategoryFormPage(categoryId: id, isEdit: true);
                  },
                ),
              ],
            ),
          ],
        ),

        // Orders routes - hierarchical
        GoRoute(
          path: 'orders',
          builder: (context, state) => const OrderListPage(),
          routes: [
            GoRoute(
              path: 'add',
              builder: (context, state) => const OrderFormPage(),
            ),
            GoRoute(
              path: ':id',
              builder: (context, state) {
                final id = state.pathParameters['id']!;
                return OrderDetailPage(orderId: id);
              },
              routes: [
                GoRoute(
                  path: 'edit',
                  builder: (context, state) {
                    final id = state.pathParameters['id']!;
                    return OrderFormPage(orderId: id, isEdit: true);
                  },
                ),
              ],
            ),
          ],
        ),

        // OnCredit routes - hierarchical
        GoRoute(
          path: 'on-credits',
          builder: (context, state) => const OnCreditListPage(),
          routes: [
            GoRoute(
              path: 'add',
              builder: (context, state) => const OnCreditFormPage(),
            ),
            GoRoute(
              path: ':id',
              builder: (context, state) {
                final id = state.pathParameters['id']!;
                return OnCreditDetailPage(onCreditId: id);
              },
              routes: [
                GoRoute(
                  path: 'edit',
                  builder: (context, state) {
                    final id = state.pathParameters['id']!;
                    return OnCreditFormPage(onCreditId: id, isEdit: true);
                  },
                ),
              ],
            ),
          ],
        ),
        // Product routes - hierarchical
        GoRoute(
          path: 'products',
          builder: (context, state) => const ProductListPage(),
          routes: [
            GoRoute(
              path: 'add',
              builder: (context, state) => const ProductFormPage(),
            ),
            GoRoute(
              path: ':id',
              builder: (context, state) {
                final id = state.pathParameters['id']!;
                return ProductDetailPage(productId: id);
              },
              routes: [
                GoRoute(
                  path: 'edit',
                  builder: (context, state) {
                    final id = state.pathParameters['id']!;
                    return ProductFormPage(productId: id, isEdit: true);
                  },
                ),
              ],
            ),
          ],
        ),
        GoRoute(
          path: 'procurement-orders',
          builder: (context, state) =>
              const _PlaceholderPage(title: 'Tedarik Siparişleri'),
        ),
      ],
    ),
  ],
);

// Temporary placeholder page for modules not yet implemented
class _PlaceholderPage extends StatelessWidget {
  final String title;

  const _PlaceholderPage({required this.title});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(title),
        backgroundColor: Colors.blue,
        foregroundColor: Colors.white,
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(Icons.construction, size: 64, color: Colors.grey),
            const SizedBox(height: 16),
            Text(
              '$title modülü',
              style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 8),
            const Text(
              'Bu modül henüz geliştirilme aşamasındadır.',
              style: TextStyle(fontSize: 16, color: Colors.grey),
            ),
          ],
        ),
      ),
    );
  }
}
