import { queryProjectNotice } from '../services/api';

export default {
  namespace: 'receiveDate',

  state: {
    receive:undefined
  },

  effects: {
    *fetchReceive({ payload }, { call, put }) {
        console.log("收到",payload)
    } 
  },

  reducers: {
    saveReceive(state, action) {
      return {
        ...state,
        receive: action.payload,
      };
    }
  },
};
