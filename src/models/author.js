import { queryAuthoration } from '../services/api';
import { getNavData } from '../common/nav';

export default {
  namespace: 'author',

  state: {
    list: [],
    currentList: [],
    currentList_server: [],
    authorArr:[],
    loading: true,
    role:"admin"
  },

  effects: {
    *fetchCurrentList(_, { call, put, select}) {
      const userName = yield select(({author}) => author.role)
      const response = yield call(queryAuthoration,{userName},"/api/Authoration");
      var list = []
      for(let key in response.result){
        list.push(key)
      }
      yield put({
        type: 'fetchList',
        payload: {list,server:response.result_server}
      });
      yield put({
        type: 'changeAuthor',
        payload: response.result
      });
    },


    *fetchList({payload}, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const menusList = getNavData();
      var response = []
      for(let i=0;i<menusList.length;i++){
        if(i==0){
          response = menusList[i].children
        }else if(i == menusList.length-1){
          yield put({
            type: 'saveList',
            payload: Array.isArray(response) ? response : [],
          });
          yield put({
            type: 'changeSelect',
            payload: payload.list
          });
          yield put({
            type: 'changeSelectServer',
            payload: payload.server
          });
        }else{               
            var temp = response.concat(menusList[i].children)
            response = temp
        }
      }    
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },

    *fetchSelect({payload}, { call, put }){
      console.log(22211111,payload)
      yield put({
        type: 'changeSelect',
        payload:payload.currentList
      });
      yield put({
        type: 'changeSelectServer',
        payload:payload.currentList_server
      });
    },

    *fetchRole({payload}, { call, put }){
      yield put({
        type: 'changeRole',
        payload
      });
      yield put({
        type: 'fetchCurrentList',
        payload:{}
      });
    },


    *sendToService(_, { call, put, select }){
      const List = yield select(({author}) => author.currentList)
      const List_server = yield select(({author}) => author.currentList_server)
      const roleName = yield select(({author}) => author.role)
      const temp_author = yield select(({author}) => author.authorArr)
      var res_arr = {}
      for(let i=0;i<List.length;i++){
        if(temp_author.hasOwnProperty(List[i])){
          res_arr[List[i]] = temp_author[List[i]]
        }else{
          res_arr[List[i]] = []
        }
      }
      console.log(555555,res_arr)
      const response = yield call(queryAuthoration,{List,List_server,res_arr,roleName},"/api/change");
    }
  },

  reducers: {
    saveList(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    changeLoading(state, action) {
      return {
        ...state,
        loading: action.payload,
      };
    },
    changeSelect(state, action) {
      return {
        ...state,
        currentList: action.payload,
      };
    },
    changeSelectServer(state, action) {
      return {
        ...state,
        currentList_server: action.payload,
      };
    },
    changeAuthor(state, action) {
      return {
        ...state,
        authorArr: action.payload,
      };
    },
    changeRole(state, action) {
      return {
        ...state,
        role: action.payload,
      };
    },
  },

  subscriptions: {
    setup({ dispatch,history }) {
      return history.listen(({ pathname, search }) => {
        dispatch({
          type: 'fetchCurrentList',
          payload: {}
        });
      });
    },
  },

};
