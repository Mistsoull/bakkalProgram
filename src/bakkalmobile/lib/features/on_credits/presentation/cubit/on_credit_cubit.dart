import 'package:flutter_bloc/flutter_bloc.dart';
import '../../../../core/models/paginated_response.dart';
import '../../data/models/on_credit_model.dart';
import '../../data/repositories/on_credit_repository.dart';

part 'on_credit_state.dart';

class OnCreditCubit extends Cubit<OnCreditState> {
  final OnCreditRepository _repository;

  OnCreditCubit(this._repository) : super(OnCreditInitial());

  Future<void> getOnCredits({int pageIndex = 0, int pageSize = 10}) async {
    emit(OnCreditLoading());
    try {
      final paginatedResponse = await _repository.getOnCredits(
        pageIndex: pageIndex,
        pageSize: pageSize,
      );
      emit(OnCreditLoaded(paginatedResponse));
    } catch (e) {
      emit(OnCreditError(e.toString()));
    }
  }

  Future<void> getOnCreditById(String id) async {
    emit(OnCreditLoading());
    try {
      final onCredit = await _repository.getOnCreditById(id);
      emit(OnCreditDetailLoaded(onCredit));
    } catch (e) {
      emit(OnCreditError(e.toString()));
    }
  }

  Future<void> createOnCredit(CreateOnCreditRequest request) async {
    emit(OnCreditLoading());
    try {
      await _repository.createOnCredit(request);
      emit(OnCreditCreated());
      // Refresh the list
      getOnCredits();
    } catch (e) {
      emit(OnCreditError(e.toString()));
    }
  }

  Future<void> updateOnCredit(UpdateOnCreditRequest request) async {
    emit(OnCreditLoading());
    try {
      await _repository.updateOnCredit(request);
      emit(OnCreditUpdated());
      // Refresh the list
      getOnCredits();
    } catch (e) {
      emit(OnCreditError(e.toString()));
    }
  }

  Future<void> deleteOnCredit(String id) async {
    emit(OnCreditLoading());
    try {
      await _repository.deleteOnCredit(id);
      emit(OnCreditDeleted());
      // Refresh the list
      getOnCredits();
    } catch (e) {
      emit(OnCreditError(e.toString()));
    }
  }

  Future<void> markAsPaid(String id) async {
    emit(OnCreditLoading());
    try {
      await _repository.markAsPaid(id);
      emit(OnCreditMarkedAsPaid());
      // Refresh the list
      getOnCredits();
    } catch (e) {
      emit(OnCreditError(e.toString()));
    }
  }
}
