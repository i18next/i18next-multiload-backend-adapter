import { BackendModule, ReadCallback } from 'i18next';
import { BackendOptions as XHRBackendOptions } from 'i18next-xhr-backend'
import { I18NextLocalStorageBackend } from 'i18next-localstorage-backend';

declare namespace I18NextMultiloadBackendAdapter {
  interface BackendOptions {
    backend: BackendModule;
    backendOption?: XHRBackendOptions | I18NextLocalStorageBackend.BackendOptions;
    debounceInterval?: number;
  }
}
  
export default class I18NextMultiloadBackendAdapter {
  constructor(services?: any, options?: I18NextMultiloadBackendAdapter.BackendOptions);
  init(services?: any, options?: I18NextMultiloadBackendAdapter.BackendOptions): void;
  read(language: string, namespace: string, callback: ReadCallback): void;
  load(): void
  type: "backend";
  services: any;
  options: I18NextMultiloadBackendAdapter.BackendOptions;
}
  