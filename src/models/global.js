import { queryNotices,queryAuthoration } from '../services/api';
import  {getNavList} from '../common/getNavList';

export default {
  namespace: 'global',

  state: {
    collapsed: false,
    notices: [],
    fetchingNotices: false,
    authoration:undefined,
    currentKey: false,
    state: false
  },

  effects: {
    *fetchNotices(_, { call, put }) {
      yield put({
        type: 'changeNoticeLoading',
        payload: true,
      });
      const data = yield call(queryNotices);
      yield put({
        type: 'saveNotices',
        payload: data,
      });
      yield put({
        type: 'user/changeNotifyCount',
        payload: data.length,
      });
    },
    *clearNotices({ payload }, { put, select }) {
      yield put({
        type: 'saveClearedNotices',
        payload,
      });
      const count = yield select(state => state.global.notices.length);
      yield put({
        type: 'user/changeNotifyCount',
        payload: count,
      });
    },
    *queryAuthoration({}, { call, put, select }){
      const userName = localStorage.getItem("userName")
      const data = yield call(queryAuthoration,{userName},"/api/Authoration");
      yield put({
        type: 'changeAuthoration',
        payload: data,
      });
    },
    *changeItemKey({ payload,menus }, { call, put, select }){
      const key = getNavList(payload,menus)
      yield put({
        type: 'itemKey',
        payload: key,
      });
    },
    *getState({ payload }, { call, put, select }){
      yield put({
        type: 'changeState',
        payload: payload,
      });
    },
    *sendReceive({ payload }, { call, put, select }){
      yield put({
        type: 'receiveDate/fetchReceive',
        payload,
      });
    }
  },

  reducers: {
    changeLayoutCollapsed(state, { payload }) {
      return {
        ...state,
        collapsed: payload,
      };
    },
    saveNotices(state, { payload }) {
      return {
        ...state,
        notices: payload,
        fetchingNotices: false,
      };
    },
    saveClearedNotices(state, { payload }) {
      return {
        ...state,
        notices: state.notices.filter(item => item.type !== payload),
      };
    },
    changeNoticeLoading(state, { payload }) {
      return {
        ...state,
        fetchingNotices: payload,
      };
    },
    changeAuthoration(state, { payload }) {
      return {
        ...state,
        authoration: payload,
      };
    },
    itemKey(state, { payload }){
      return {
        ...state,
        currentKey: payload,
      };
    },
    changeState(state, { payload }){
      return {
        ...state,
        state: payload,
      };
    }
  },

  subscriptions: {
    setup({ dispatch,history }) {
      // Subscribe history(url) change, trigger `load` action if pathname is `/`
      return history.listen(({ pathname, search }) => {
        if (typeof window.ga !== 'undefined') {
          window.ga('send', 'pageview', pathname + search);
        }
        dispatch({
          type: 'queryAuthoration',
          payload: {}
        });
      });
    },
  },
};
