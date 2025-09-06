part of 'customer_cubit.dart';

abstract class CustomerState {}

class CustomerInitial extends CustomerState {}

class CustomerLoading extends CustomerState {}

class CustomerLoaded extends CustomerState {
  final PaginatedResponse<CustomerModel> paginatedCustomers;

  CustomerLoaded(this.paginatedCustomers);

  List<CustomerModel> get customers => paginatedCustomers.items;
}

class CustomerDetailLoaded extends CustomerState {
  final CustomerModel customer;

  CustomerDetailLoaded(this.customer);
}

class CustomerCreated extends CustomerState {}

class CustomerUpdated extends CustomerState {}

class CustomerDeleted extends CustomerState {}

class CustomerError extends CustomerState {
  final String message;

  CustomerError(this.message);
}
