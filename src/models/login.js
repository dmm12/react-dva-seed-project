import { routerRedux } from 'dva/router';
import { signIn, signOut } from '../services/api';
import { getResponse } from '../utils/utils';

export default {
  namespace: 'login',

  state: {
    status: undefined,
  },

  effects: {
    *accountSubmit({ payload }, { call, put }) {
      const response = yield call(signIn, payload);
      const data = getResponse(response);
      if (data) {
        yield put({
          type: 'changeLoginStatus',
          payload: data,
        });
      }
      return data;
    },
    *logout(_, { call, put }) {
      const response = yield call(signOut);
      if (response) {
        yield put(routerRedux.push('/user/login'));
      }
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      return {
        ...state,
        status: payload.length > 0 ? 'ok' : 'error',
        type: payload.type,
        info: payload,
      };
    },
  },
};
