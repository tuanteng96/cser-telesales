const formatArray = {
  useInfiniteQuery: (page, key = 'data') => {
    let newPages = []
    if (!page || !page[0]) return newPages
    for (let items of page) {
      for (let x of items[key]) {
        newPages.push(x)
      }
    }
    return newPages
  },
  findNodeByName: (data, name) => {
    let findNameItem = (tree, field) => {
      let result = null
      if (tree[field] === name) {
        return tree
      }

      const children = tree.children || tree.subs
      if (Array.isArray(children) && children.length > 0) {
        children.some(node => {
          result = findNameItem(node, field)
          return result
        })
      }
      return result
    }
    if (!data) return null
    for (let field of ['name_and_group', 'name']) {
      for (let item of data) {
        const result = findNameItem(item, field)
        if (result) return result
      }
    }
    return null
  },
  arrayMove: (array, oldIndex, newIndex) => {
    if (newIndex >= array.length) {
      var k = newIndex - array.length + 1
      while (k--) {
        array.push(undefined)
      }
    }
    array.splice(newIndex, 0, array.splice(oldIndex, 1)[0])
    return array
  }
}

const hasRolesAuth = data => {
  let newHasRoles = []
  if (data && data?.groups) {
    newHasRoles = data.groups.map(x => ({
      ...x,
      name: x.group,
      children: x.rights
        ? x.rights.map(r => ({
            ...r,
            name: r.name,
            children: r?.subs || null
          }))
        : []
    }))
  }
  return { hasRoles: newHasRoles }
}

const getHasRole = (Roles, currentStockId) => {
  let hasRight = Roles?.hasRight || false
  let StockRoles = Roles?.stocksList
    ? Roles?.stocksList.map(x => ({ ...x, label: x.Title, value: x.ID }))
    : []

  if (hasRight && !Roles.IsAllStock) {
    hasRight =
      currentStockId != null &&
      StockRoles.some(x => Number(x.ID) === Number(currentStockId))
  }
  return {
    hasRight,
    StockRoles,
    StockRolesAll: Roles?.IsAllStock
      ? [{ label: 'Hệ thống', value: 0 }, ...StockRoles]
      : StockRoles,
    IsStocks: Roles?.IsAllStock || false,
    IsAllStock: Roles?.IsAllStock || false
  }
}

export const useRoles = ({ nameRoles } = {}) => {
  const isMultiple = Array.isArray(nameRoles)
  const { rightTree, RightTree, CrStocks, CrStockID } = window?.top?.Info || {}
  const currentStockId = CrStocks?.ID ?? CrStockID
  let result = {}

  const { hasRoles } = hasRolesAuth(rightTree || RightTree)

  if (!isMultiple) {
    const hasRolesItem = formatArray.findNodeByName(hasRoles, nameRoles)
    if (hasRolesItem) {
      result[nameRoles] = { ...getHasRole(hasRolesItem, currentStockId) }
    } else {
      result[nameRoles] = { hasRight: false, StockRoles: [] }
    }
  } else {
    for (let key of nameRoles) {
      const hasRolesItem = formatArray.findNodeByName(hasRoles, key)
      if (hasRolesItem) {
        result[key] = { ...getHasRole(hasRolesItem, currentStockId) }
      } else {
        result[key] = {
          hasRight: false,
          StockRoles: []
        }
      }
    }
  }
  return result
}
