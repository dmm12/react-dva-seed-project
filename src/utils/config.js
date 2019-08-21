/** config -全局统一配置
 * @author: niujiaqing <njq.niu@hand-china.com>
 * @version: 0.0.1
 */

const CLIENT_ID = `${process.env.CLIENT_ID}`;
const API_HOST = `${process.env.API_HOST}`;
const BPM_HOST = `${process.env.BPM_HOST}/editor`;
const WEBSOCKET_URL = `${process.env.WEBSOCKET_HOST}`;
const SRC_WEBSOCKET_HOST = `${process.env.SRC_WEBSOCKET_HOST}`;
const SRM_MALL_HOST = `${process.env.SRM_MALL_HOST}`;

const COMMON_PLATFORM = '/common';

export {
  CLIENT_ID,
  API_HOST,
  BPM_HOST,
  WEBSOCKET_URL,
  SRC_WEBSOCKET_HOST,
  SRM_MALL_HOST,
  COMMON_PLATFORM,
};
