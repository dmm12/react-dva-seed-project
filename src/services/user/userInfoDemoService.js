import request from '../../utils/request';

export function getUserList(data) {
  return request('/user/list', {
    method: 'GET',
    query: data,
  });
}
