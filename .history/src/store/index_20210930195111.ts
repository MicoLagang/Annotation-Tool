import { combineReducers } from 'redux';
import { labelsReducer } from "./labels/reducer";
import { generalReducer } from "./general/reducer";
import { aiReducer } from "./ai/reducer";
import useGlobalState from './useGlobalStates';

export const rootReducer = combineReducers({
    general: generalReducer,
    labels: labelsReducer,
    ai: aiReducer,
    // global: useGlobalState
});

export type AppState = ReturnType<typeof rootReducer>;