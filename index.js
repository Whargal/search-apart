const express = require('express')
const fs = require('fs')
const leboncoin = require('leboncoin-api')

var config = require('./config.json')

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

// Please check into categories & sub categories constants to know which are the sub categories to add into "addSearchExtra"
search.run().then(data => {
  console.log('nb result = ' + data.nbResult)

  var viewData = []
  const refDate = new Date(config.refDate)

  data.results.forEach(el => {
    const desc = el.description
    const date = new Date(el.date)

    const regex = /(grand mare|vallon suisse|Mont Saint-Aignan|haut(eur)*(s)* (de )*rouen)/gi

    if (!desc.match(regex) && date > refDate) {
      viewData.push({
        title: el.title,
        description: desc,
        price: el.price,
        date: date,
      })
    }
  })
  console.log('nb real result = ' + viewData.length)

  fs.writeFile('config.json', JSON.stringify({ refDate: new Date() }), 'utf8', () => {})

  ////    RENDER    ////
  var app = express()

  app.get('/', function(req, res) {
    res.render('index.ejs', { data: viewData })
  })

  app.listen(8080)
})

/*
Item {
  title: 'Appartement 4 pièces 77 m²',
  description: 'Appartement ROUEN 4 pièce(s) 78 m²\n\nROUEN GRAND MARE. Au calme et bien environné dans petite copropriété avec vue sur verdure agréable et spacieux appartement exposé sud comprenant : belle entrée, cuisine, séjour, loggia,  3 chambres, salle de bains, dégagement, nombreux rangements. Pas de vis à vis. Cave. Idéal 1ère acquisition. Copropriété de 140 lots (Pas de procédure en cours).    Charges annuelles : 2593 euros.\nRéférence annonce : 558\nLes honoraires sont à la charge du vendeur\n\nA propos de la copropriété :\nNombre de lots : 140\nCharges prévisionnelles annuelles : 2593 €',
  category: 'Ventes immobilières',
  link: 'https://leboncoin.fr/ventes_immobilieres/1562741609.htm',
  images:
   [ 'https://img2.leboncoin.fr/ad-image/56f8e7de624aa1097a562ad6215ab2caebe9446d.jpg',
     'https://img6.leboncoin.fr/ad-image/3bc91224467570c7ccaed600a1e19b8ae688be0c.jpg',
     'https://img1.leboncoin.fr/ad-image/711475d356abb2b1b4da1d986adea6f91b21f63a.jpg',
     'https://img4.leboncoin.fr/ad-image/d9cd2340ac3027fd871ad8d37cb290b9c2a20d35.jpg',
     'https://img3.leboncoin.fr/ad-image/3e4f728a004d8d278fa246e980a3e5f7500cb126.jpg',
     'https://img6.leboncoin.fr/ad-image/33b9cda81caf5d393c03df7cb1586e222d39080a.jpg',
     'https://img0.leboncoin.fr/ad-image/cebc0cdd445381daf9bbfd1f5ffaea3513f3c926.jpg',
     'https://img3.leboncoin.fr/ad-image/aee53fe2f902c7f3c755cbc074ecf2568fbf208f.jpg',
     'https://img7.leboncoin.fr/ad-image/a1f359b2213d2783cfcd161880533413e7a5b5e3.jpg',
     'https://img1.leboncoin.fr/ad-image/78c25b82561b5bb29e57641738a1a95a10b4e22f.jpg' ],
  location:
   { region_id: '11',
     region_name: 'Haute-Normandie',
     department_id: '76',
     department_name: 'Seine-Maritime',
     city_label: 'Rouen 76000',
     city: 'Rouen',
     zipcode: '76000',
     lat: 49.44015,
     lng: 1.08941,
     source: 'city',
     provider: 'lbc',
     is_shape: true },
  urgent: false,
  price: 62500,
  date: 2019-02-02T14:49:23.000Z,
  owner:
   { store_id: '7866337',
     user_id: 'fe287206-c01b-46f6-bee0-9ecfa127b4b9',
     type: 'pro',
     name: 'CABINET LAGADEUC SAS',
     siren: '409152626',
     pro_rates_link: 'http://media8.ac3-distribution.com/segments/immo/catalog/images/manufacturers_bareme/148808.pdf',
     no_salesmen: false },
  attributes:
   { real_estate_type: '2',
     rooms: '4',
     square: '77',
     custom_ref: '558',
     ges: 'f',
     energy_rate: 'e',
     pro_rates_link: 'http://media8.ac3-distribution.com/segments/immo/catalog/images/manufacturers_bareme/148808.pdf',
     immo_sell_type: 'old',
     is_import: 'true',
     lease_type: 'sell' },
  id: 1562741609,
  seller: 'CABINET LAGADEUC SAS',
  has_phone: true }
});*/
