import http from './configs/http'

const moreApi = {
  getProduct: key => {
    return http.get(
      `/api/gl/select2?cmd=prod&cate_name=dich_vu,san_pham&ignore_all=1&q=${key}&&ignore_rootsv=1`
    )
  },
  getProductService: key => {
    return http.get(
      `/api/gl/select2?cmd=prod&cate_name=san_pham,dich_vu&ignore_all=1&q=${key}`
    )
  },
  getAllServiceCard: key => {
    return http.get(
      `/api/gl/select2?cmd=prod&fee=0&ignore_all=1&srv=1&q&no_root=1&q=${key}`
    )
  },
  getAllStaffs: key => {
    return http.get(`/api/gl/select2?cmd=user&q=${key}`)
  },
  getStaffs: ({ StockID, key, All }) => {
    return http.get(
      `/api/gl/select2?cmd=user&roles=DV&crstockid=${StockID}&q=${key}${
        All ? '&all=1' : ''
      }`
    )
  },
  getRootServices: ({ MemberID, StockID, Key }) => {
    return http.get(
      `/api/v3/mbook?cmd=getroot&memberid=${MemberID}&ps=15&pi=1&key=${Key}=&stockid=${StockID}`
    )
  },
  getGroupsMember: () => http.get(`/api/v3/member23?cmd=dataForAdd`)
}
export default moreApi
