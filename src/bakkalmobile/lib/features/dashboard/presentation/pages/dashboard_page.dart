import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../../shared/widgets/navigation_drawer.dart' as nav;

class DashboardPage extends StatelessWidget {
  const DashboardPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('BakkalCRM'),
        backgroundColor: Colors.blue,
        foregroundColor: Colors.white,
      ),
      drawer: const nav.NavigationDrawer(),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const SizedBox(height: 24),

            GridView.count(
              crossAxisCount: 2,
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              crossAxisSpacing: 16,
              mainAxisSpacing: 16,
              children: [
                _DashboardCard(
                  title: 'Siparişler',
                  icon: Icons.receipt_long,
                  color: Colors.blue,
                  onTap: () => context.go('/orders'),
                ),
                _DashboardCard(
                  title: 'Ürünler',
                  icon: Icons.inventory,
                  color: Colors.green,
                  onTap: () => context.go('/products'),
                ),
                _DashboardCard(
                  title: 'Müşteriler',
                  icon: Icons.people,
                  color: Colors.orange,
                  onTap: () => context.go('/customers'),
                ),
                _DashboardCard(
                  title: 'Tedarikçiler',
                  icon: Icons.local_shipping,
                  color: Colors.purple,
                  onTap: () => context.go('/suppliers'),
                ),
                _DashboardCard(
                  title: 'Kategoriler',
                  icon: Icons.category,
                  color: Colors.teal,
                  onTap: () => context.go('/categories'),
                ),
                _DashboardCard(
                  title: 'Veresiye',
                  icon: Icons.credit_card,
                  color: Colors.red,
                  onTap: () => context.go('/on-credits'),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

class _DashboardCard extends StatelessWidget {
  final String title;
  final IconData icon;
  final Color color;
  final VoidCallback onTap;

  const _DashboardCard({
    required this.title,
    required this.icon,
    required this.color,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      elevation: 4,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(8),
        child: Container(
          padding: const EdgeInsets.all(16),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(icon, size: 48, color: color),
              const SizedBox(height: 12),
              Text(
                title,
                style: const TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w600,
                ),
                textAlign: TextAlign.center,
              ),
            ],
          ),
        ),
      ),
    );
  }
}
