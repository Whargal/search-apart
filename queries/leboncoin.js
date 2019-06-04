const leboncoin = require('leboncoin-api')

const printLog = require('../helpers/printLog')

const queryLeboncoin = () => {
  var search = new leboncoin.Search()
    .setPage(1)
    .setLimit(999)
    .setSort({
      sort_by: 'date',
      sort_order: 'asc',
    })
    .setFilter(leboncoin.FILTERS.ALL)
    .setCategory('ventes_immobilieres')
    .setRegion('haute_normandie')
    .setDepartment('seine_maritime')
    .setLocation([{ zipcode: '76000' }, { zipcode: '76100' }])
    .addSearchExtra('price', { min: 0, max: 125000 })
    .addSearchExtra('rooms', { min: 4 })

  return search.run()
}

module.exports = queryLeboncoin
