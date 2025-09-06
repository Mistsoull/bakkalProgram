part of 'supplier_cubit.dart';

abstract class SupplierState {}

class SupplierInitial extends SupplierState {}

class SupplierLoading extends SupplierState {}

class SupplierLoaded extends SupplierState {
  final PaginatedResponse<SupplierModel> paginatedSuppliers;

  SupplierLoaded(this.paginatedSuppliers);

  List<SupplierModel> get suppliers => paginatedSuppliers.items;
}

class SupplierDetailLoaded extends SupplierState {
  final SupplierModel supplier;

  SupplierDetailLoaded(this.supplier);
}

class SupplierCreated extends SupplierState {}

class SupplierUpdated extends SupplierState {}

class SupplierDeleted extends SupplierState {}

class SupplierError extends SupplierState {
  final String message;

  SupplierError(this.message);
}
