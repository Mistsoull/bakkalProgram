import 'package:flutter_bloc/flutter_bloc.dart';
import '../../../../core/models/paginated_response.dart';
import '../../data/models/supplier_model.dart';
import '../../data/repositories/supplier_repository.dart';

part 'supplier_state.dart';

class SupplierCubit extends Cubit<SupplierState> {
  final SupplierRepository _repository;

  SupplierCubit(this._repository) : super(SupplierInitial());

  Future<void> getSuppliers({int pageIndex = 0, int pageSize = 10}) async {
    emit(SupplierLoading());
    try {
      final paginatedResponse = await _repository.getSuppliers(
        pageIndex: pageIndex,
        pageSize: pageSize,
      );
      emit(SupplierLoaded(paginatedResponse));
    } catch (e) {
      emit(SupplierError(e.toString()));
    }
  }

  Future<void> getSupplierById(String id) async {
    emit(SupplierLoading());
    try {
      final supplier = await _repository.getSupplierById(id);
      emit(SupplierDetailLoaded(supplier));
    } catch (e) {
      emit(SupplierError(e.toString()));
    }
  }

  Future<void> createSupplier(CreateSupplierRequest request) async {
    emit(SupplierLoading());
    try {
      await _repository.createSupplier(request);
      emit(SupplierCreated());
      // Refresh the list
      getSuppliers();
    } catch (e) {
      emit(SupplierError(e.toString()));
    }
  }

  Future<void> updateSupplier(UpdateSupplierRequest request) async {
    emit(SupplierLoading());
    try {
      await _repository.updateSupplier(request);
      emit(SupplierUpdated());
      // Refresh the list
      getSuppliers();
    } catch (e) {
      emit(SupplierError(e.toString()));
    }
  }

  Future<void> deleteSupplier(String id) async {
    emit(SupplierLoading());
    try {
      await _repository.deleteSupplier(id);
      emit(SupplierDeleted());
      // Refresh the list
      getSuppliers();
    } catch (e) {
      emit(SupplierError(e.toString()));
    }
  }
}
