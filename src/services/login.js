import request from '../utils/request';

export function login(data) {
  return request('/user/login', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
