import config from './config';
import enUS from './locale/en-US';
import zhCN from './locale/zh-CN';
import zhTW from './locale/zh-TW';

config.loadMessages('en-US', enUS).loadMessages('zh-CN', zhCN).loadMessages('zh-TW', zhTW).setLocale('en-US');

export * from './index';
export { default } from './index';
