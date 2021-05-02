import { createWrapper } from "next-redux-wrapper";
import reducer from "../reducers";
import { createStore, compose, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
// import thunkMiddleware from "redux-thunk";
import createSagaMiddleware from "redux-saga";
import rootSaga from "../sagas";

const loggerMiddleware = ({ dispatch, getState }) => (next) => (action) => {
  console.log(action);
  return next(action);
};

const configureStore = () => {
  const sagaMiddeleware = createSagaMiddleware();
  const middlewares = [sagaMiddeleware, loggerMiddleware];
  const enhancer =
    process.env.NODE_ENV === "production"
      ? compose(applyMiddleware(...middlewares))
      : composeWithDevTools(applyMiddleware(...middlewares));

  const store = createStore(reducer, enhancer);
  store.sagaTask = sagaMiddeleware.run(rootSaga);

  return store;
};

const wrapper = createWrapper(configureStore, {
  debug: process.env.NODE_ENV === "development",
});

export default wrapper;
