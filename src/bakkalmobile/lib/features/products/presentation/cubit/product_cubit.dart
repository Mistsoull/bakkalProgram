import 'package:flutter_bloc/flutter_bloc.dart';
import '../../../../core/models/paginated_response.dart';
import '../../data/models/product_model.dart';
import '../../data/repositories/product_repository.dart';

part 'product_state.dart';

class ProductCubit extends Cubit<ProductState> {
  final ProductRepository _repository;

  ProductCubit(this._repository) : super(ProductInitial());

  Future<void> getProducts({int pageIndex = 0, int pageSize = 10}) async {
    emit(ProductLoading());
    try {
      final paginatedResponse = await _repository.getProducts(
        pageIndex: pageIndex,
        pageSize: pageSize,
      );
      emit(ProductLoaded(paginatedResponse));
    } catch (e) {
      emit(ProductError(e.toString()));
    }
  }

  Future<void> getProductById(String id) async {
    emit(ProductLoading());
    try {
      final product = await _repository.getProductById(id);
      emit(ProductDetailLoaded(product));
    } catch (e) {
      emit(ProductError(e.toString()));
    }
  }

  Future<void> createProduct(CreateProductRequest request) async {
    emit(ProductLoading());
    try {
      await _repository.createProduct(request);
      emit(ProductCreated());
      // Refresh the list
      getProducts();
    } catch (e) {
      emit(ProductError(e.toString()));
    }
  }

  Future<void> updateProduct(UpdateProductRequest request) async {
    emit(ProductLoading());
    try {
      await _repository.updateProduct(request);
      emit(ProductUpdated());
      // Refresh the list
      getProducts();
    } catch (e) {
      emit(ProductError(e.toString()));
    }
  }

  Future<void> deleteProduct(String id) async {
    emit(ProductLoading());
    try {
      await _repository.deleteProduct(id);
      emit(ProductDeleted());
      // Refresh the list
      getProducts();
    } catch (e) {
      emit(ProductError(e.toString()));
    }
  }
}
