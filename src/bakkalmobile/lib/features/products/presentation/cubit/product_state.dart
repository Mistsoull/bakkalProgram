part of 'product_cubit.dart';

abstract class ProductState {}

class ProductInitial extends ProductState {}

class ProductLoading extends ProductState {}

class ProductLoaded extends ProductState {
  final PaginatedResponse<ProductModel> paginatedProducts;

  ProductLoaded(this.paginatedProducts);

  List<ProductModel> get products => paginatedProducts.items;
}

class ProductDetailLoaded extends ProductState {
  final ProductModel product;

  ProductDetailLoaded(this.product);
}

class ProductCreated extends ProductState {}

class ProductUpdated extends ProductState {}

class ProductDeleted extends ProductState {}

class ProductError extends ProductState {
  final String message;

  ProductError(this.message);
}
