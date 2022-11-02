declare namespace I18NextMultiloadBackendAdapter {
  interface BackendOptions {
    backend: any,
    backendOption?: any,
    debounceInterval?: number
  }

  type LoadCallback = (error: any, result: string | false) => void;
}

export default class I18NextMultiloadBackendAdapter {
  constructor(services?: any, options?: I18NextMultiloadBackendAdapter.BackendOptions);
  init(
    services?: any,
    options?: I18NextMultiloadBackendAdapter.BackendOptions,
    i18nextOptions?: any
  ): void;
  read(
    language: string,
    namespace: string,
    callback: I18NextMultiloadBackendAdapter.LoadCallback
  ): void;
  create(
    languages: string | string[],
    namespace: string,
    key: string,
    fallbackValue: string
  ): void;
  type: "backend";
  services: any;
  backends: any[];
  options: I18NextMultiloadBackendAdapter.BackendOptions;
}

declare module "i18next" {
  interface CustomPluginOptions {
    backend?: I18NextMultiloadBackendAdapter.BackendOptions;
  }
}