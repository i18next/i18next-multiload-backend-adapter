import { BackendModule, ReadCallback } from 'i18next';


/**
 * @see https://github.com/i18next/i18next-xhr-backend/blob/master/index.d.ts
 */
type LoadPathOption = string | ((lngs: string[], namespaces: string[]) => string);

interface BackendOptions {
  /**
   * path where resources get loaded from, or a function
   * returning a path:
   * function(lngs, namespaces) { return customPath; }
   * the returned path will interpolate lng, ns if provided like giving a static path
   */
  loadPath?: LoadPathOption;
  /**
   * path to post missing resources
   */
  addPath?: string;
  /**
   * your backend server supports multiLoading
   * locales/resources.json?lng=de+en&ns=ns1+ns2
   * set loadPath: '/locales/resources.json?lng={{lng}}&ns={{ns}}' to adapt to multiLoading
   */
  allowMultiLoading?: boolean;
  /**
   * parse data after it has been fetched
   * in example use https://www.npmjs.com/package/json5
   * here it removes the letter a from the json (bad idea)
   */
  parse?(data: string): string;
  /**
   * parse data before it has been sent by addPath
   */
  parsePayload?(namespace: string, key: string, fallbackValue?: string): { [key: string]: any };
  /**
   * allow cross domain requests
   */
  crossDomain?: boolean;
  /**
   * allow credentials on cross domain requests
   */
  withCredentials?: boolean;
  /**
   * define a custom xhr function
   * can be used to support XDomainRequest in IE 8 and 9
   */
  ajax?(
    url: string,
    options: BackendOptions,
    callback: AjaxRequestCallback,
    data: {} | string,
    cache: boolean,
  ): void;
  /**
   * adds parameters to resource URL. 'example.com' -> 'example.com?v=1.3.5'
   */
  queryStringParams?: { [key: string]: string };

  /**
   * @see https://github.com/i18next/i18next-xhr-backend/blob/281c7e235e1157b33122adacef1957252e5700f1/src/ajax.js#L52
   */
  customHeaders?: { [key: string]: string };
}

type AjaxRequestCallback = (response: string, x: XMLHttpRequest) => void;


declare namespace I18NextMultiloadBackendAdapter {
  interface BackendOptions {
    backend: BackendModule,
    backendOption?: BackendOptions,
    debounceInterval?: number
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
  