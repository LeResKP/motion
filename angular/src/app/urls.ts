
const BASE_HREF: string = document.querySelector('base[href]').getAttribute('href');

export const URLS = {
  // Login page is not in angular since it's a server side authentication with
  // google api
  login: BASE_HREF + 'login',
}

export const API_URLS = {
  cams: {
    info: BASE_HREF + 'api/cams',
    id: BASE_HREF + 'api/cams/{cameraId}',
    enable: BASE_HREF + 'api/cams/{cameraId}/enable/{value}',
    detection: BASE_HREF + 'api/cams/{cameraId}/detection/{value}',
    upload: BASE_HREF + 'api/cams/{cameraId}/upload/{value}',
  },
  auth: {
    login: BASE_HREF + 'api/auth/login'
  }
}


export function url_replacer(url: string, values: {}) {
  Object.keys(values).forEach(key => url = url.replace('{' + key + '}', values[key]));
  return url;
}
