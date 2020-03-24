import { BackendModule, ReadCallback } from 'i18next';

declare namespace I18NextMultiloadBackendAdapter {
  interface BackendOptions {
    backend: BackendModule,
    backendOption?: any,
    debounceInterval?: number
  }
  
}
  
export default class I18NextMultiloadBackendAdapter {
  constructor(services?: any, options?: any);
  init(services?: any, options?: any): void;
  read(language: string, namespace: string, callback: ReadCallback): void;
  load(): void
  type: "backend";
  services: any;
  options: I18NextMultiloadBackendAdapter.BackendOptions;
}
  