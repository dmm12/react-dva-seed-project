import { getUserList } from '../../services/user/userInfoDemoService';
import { getResponse } from '../../utils/utils';

export default {
  namespace: 'userInfoDemo',

  state: {
    list: [],
    pagination: {},
  },

  effects: {
    *fetchUserList({ payload }, { call, put }) {
      const response = yield call(getUserList, payload);
      const data = getResponse(response);
      if (data) {
        yield put({
          type: 'updateState',
          payload: {
            list: data,
          },
        });
      }
    },
  },

  reducers: {
    updateState(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};
