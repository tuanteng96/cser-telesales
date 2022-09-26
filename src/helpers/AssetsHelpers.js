import { DevHelpers } from './DevHelpers'

export const AssetsHelpers = {
  toAbsoluteUrl: pathname => process.env.PUBLIC_URL + pathname
}
export const toUrlServer = pathname =>
  DevHelpers.isDevelopment()
    ? process.env.REACT_APP_API_URL + pathname
    : '' + pathname
