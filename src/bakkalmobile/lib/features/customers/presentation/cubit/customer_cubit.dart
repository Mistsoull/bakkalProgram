import 'package:flutter_bloc/flutter_bloc.dart';
import '../../../../core/models/paginated_response.dart';
import '../../data/models/customer_model.dart';
import '../../data/repositories/customer_repository.dart';

part 'customer_state.dart';

class CustomerCubit extends Cubit<CustomerState> {
  final CustomerRepository _repository;

  CustomerCubit(this._repository) : super(CustomerInitial());

  Future<void> getCustomers({int pageIndex = 0, int pageSize = 10}) async {
    emit(CustomerLoading());
    try {
      final paginatedResponse = await _repository.getCustomers(
        pageIndex: pageIndex,
        pageSize: pageSize,
      );
      emit(CustomerLoaded(paginatedResponse));
    } catch (e) {
      emit(CustomerError(e.toString()));
    }
  }

  Future<void> getCustomerById(String id) async {
    emit(CustomerLoading());
    try {
      final customer = await _repository.getCustomerById(id);
      emit(CustomerDetailLoaded(customer));
    } catch (e) {
      emit(CustomerError(e.toString()));
    }
  }

  Future<void> createCustomer(CreateCustomerRequest request) async {
    emit(CustomerLoading());
    try {
      await _repository.createCustomer(request);
      emit(CustomerCreated());
      // Refresh the list
      getCustomers();
    } catch (e) {
      emit(CustomerError(e.toString()));
    }
  }

  Future<void> updateCustomer(UpdateCustomerRequest request) async {
    emit(CustomerLoading());
    try {
      await _repository.updateCustomer(request);
      emit(CustomerUpdated());
      // Refresh the list
      getCustomers();
    } catch (e) {
      emit(CustomerError(e.toString()));
    }
  }

  Future<void> deleteCustomer(String id) async {
    emit(CustomerLoading());
    try {
      await _repository.deleteCustomer(id);
      emit(CustomerDeleted());
      // Refresh the list
      getCustomers();
    } catch (e) {
      emit(CustomerError(e.toString()));
    }
  }
}
