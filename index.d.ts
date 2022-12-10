import { BackendModule, ReadCallback } from "i18next";

export interface MultiloadBackendOptions {
  backend: any,
  backendOption?: any,
  debounceInterval?: number
}

export default class I18NextMultiloadBackendAdapter
  implements BackendModule<MultiloadBackendOptions> {
  constructor(services?: any, options?: MultiloadBackendOptions);
  init(
    services?: any,
    options?: MultiloadBackendOptions,
    i18nextOptions?: any
  ): void;
  read(
    language: string,
    namespace: string,
    callback: ReadCallback
  ): void;
  create(
    languages: string[],
    namespace: string,
    key: string,
    fallbackValue: string
  ): void;
  type: "backend";
  services: any;
  backends: any[];
  options: MultiloadBackendOptions;
}
