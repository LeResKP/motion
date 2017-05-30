const BASE_HREF: string = document.querySelector('base[href]').getAttribute('href');

export const API_URLS = {
  keys: {
    info: BASE_HREF + 'api/keys',
  },
  cams: {
    info: BASE_HREF + 'api/cams',
    id: BASE_HREF + 'api/cams/{cameraId}',
    enable: BASE_HREF + 'api/cams/{cameraId}/enable/{value}',
    detection: BASE_HREF + 'api/cams/{cameraId}/detection/{value}',
    upload: BASE_HREF + 'api/cams/{cameraId}/upload/{value}',
  },
  user: {
    info: BASE_HREF + 'api/users',
    id: BASE_HREF + 'api/users/{userId}',
  },
  auth: {
    login: BASE_HREF + 'api/auth/login',
    logout: BASE_HREF + 'api/auth/logout',
  },
};


export const URLS = {
  'dashboard': '/',
  'login': '/login',
  'admin': {
    'users': '/admin/users'
  }
};


export function url_replacer(url: string, values: {}) {
  Object.keys(values).forEach(key => url = url.replace('{' + key + '}', values[key]));
  return url;
}
