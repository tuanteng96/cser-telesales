import http from './configs/http'

const configApi = {
  getConfigName: name => {
    return http.get(`/api/v3/config?cmd=getnames&names=${name}&ignore_root=1`)
  },
  saveConfigName: ({ Name, name = Name, body }) =>
    http.post(`/api/v3/ConfigJson@save?name=${name}`, JSON.stringify(body))
}
export default configApi
