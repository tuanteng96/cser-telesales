import { useQuery } from '@tanstack/react-query'
import configApi from 'src/api/config.api'

export const TAG_KH_QUERY_KEY = ['TagsKH', 'tagkh']

export default function useTagKh({ enabled = true } = {}) {
  return useQuery({
    queryKey: TAG_KH_QUERY_KEY,
    queryFn: async () => {
      const { data } = await configApi.getConfigName('tagkh')
      const groups = data?.data?.[0]?.Value
        ? JSON.parse(data.data[0].Value)
        : []
      if (!Array.isArray(groups)) {
        throw new Error('Cấu hình phân loại không hợp lệ')
      }
      return groups.map(group => ({ ...group, Children: group.Children || [] }))
    },
    enabled,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false
  })
}
