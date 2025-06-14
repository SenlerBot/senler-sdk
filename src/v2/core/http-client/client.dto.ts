import { AxiosRequestConfig } from 'axios';
import { DestinationStream, LoggerOptions } from 'pino';

export interface ApiConfig {
  apiVersion?: string;
  baseUrl?: string;
  accessToken: string;
  vkGroupId?: number;
  groupId?: number;
}

export interface LoggingConfig extends LoggerOptions {
  destination?: DestinationStream;
}

export interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  url: string;
  requestId: string;
}
