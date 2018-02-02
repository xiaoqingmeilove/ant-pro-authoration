import { routerRedux } from 'dva/router';
import { fakeAccountLogin,queryAuthoration } from '../services/api';


export default {
  namespace: 'login',

  state: {
    status: undefined,
  },

  effects: {
    *login({ payload }, { call, put }) {
      console.log("33333",payload)
      yield put({
        type: 'changeSubmitting',
        payload: true,
      });
      const response = yield call(queryAuthoration,payload,"/api/login");
      yield put({
        type: 'changeLoginStatus',
        payload: response,
      });
      // Login successfully
      if (response.status === 'ok') {
        localStorage.setItem("userName",response.userName);
        yield put(routerRedux.push('/dashboard/analysis'));
      }
    },
    *logout(_, { put }) {
      yield put({
        type: 'changeLoginStatus',
        payload: {
          status: false,
        },
      });
      yield put(routerRedux.push('/user/login'));
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      return {
        ...state,
        status: payload.status,
        type: payload.type,
        submitting: false,
      };
    },
    changeSubmitting(state, { payload }) {
      return {
        ...state,
        submitting: payload,
      };
    },
  },
};
