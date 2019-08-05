import request from '../utils/request';


export function login(data) {
  return request('/user/getUser', {
    method: 'POST',
    query: JSON.stringify(data),
  });
}
