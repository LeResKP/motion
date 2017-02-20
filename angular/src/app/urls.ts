
const BASE_HREF: string = document.querySelector('base[href]').getAttribute('href');

export const URLS = {
  // Login page is not in angular since it's a server side authentication with
  // google api
  login: BASE_HREF + 'login',
}

export const API_URLS = {
  cams: BASE_HREF + 'api/cams',
}
