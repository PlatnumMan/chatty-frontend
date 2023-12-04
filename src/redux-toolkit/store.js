import suggestionsReducer from '@redux/reducers/suggestions/suggestions.reducer';
import userReducer from '@redux/reducers/user/user.reducer';
import { configureStore } from '@reduxjs/toolkit';

export const store = configureStore({
  reducer: {
    user: userReducer,
    suggestions: suggestionsReducer
  }
});
