class ApiConstants {
  static const String baseUrl =
      'http://ilgazmountainbakkal.com.tr/api/'; // Backend URL'ini buraya yazın

  // Endpoints
  static const String suppliers = '/suppliers';
  static const String customers = '/customers';
  static const String products = '/products';
  static const String categories = '/categories';
  static const String orders = '/orders';
  static const String onCredits = '/oncredits';
  static const String procurementOrders = '/procurementorders';

  // HTTP Headers
  static const Map<String, String> defaultHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };
}
