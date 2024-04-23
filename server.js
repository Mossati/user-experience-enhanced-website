// Importeer het npm pakket express uit de node_modules map
import express from 'express'

// Importeer de zelfgemaakte functie fetchJson uit de ./helpers map
import fetchJson from './helpers/fetch-json.js'

// Haal data op uit de FDND API, ga pas verder als de data gedownload is
const apiUrl = 'https://fdnd-agency.directus.app/items/'
const f_houses = apiUrl + 'f_houses'
const f_list = apiUrl + 'f_list'
const f_files = apiUrl + 'f_houses_files'
const f_feedback = apiUrl + 'f_feedback'
const FavoriteRatings = []

// Maak een nieuwe express app aan
const app = express()

// Stel ejs in als template engine
app.set('view engine', 'ejs')
// Stel de map met ejs templates in
app.set('views', './views')

// Gebruik de map 'public' voor statische resources
app.use(express.static('public'))

//Verwerken van url-gecodeerde data in POST-verzoeken
app.use(express.urlencoded({extended: true}))

// GET route voor de index pagina
app.get('/', function (request, response) {
    fetchJson(f_houses).then((housesData) => {
      response.render('index', {houses: housesData.data, ratings: FavoriteRatings})
    })
})

// GET route voor de favorites pagina
app.get('/favorites', function (request, response) {
  fetchJson(f_list).then((listsData) => {
    response.render('favorites', {lists: listsData.data})
  })
})

// GET route voor de house pagina
app.get('/house/:id', function (request, response) {
  fetchJson(f_houses + "/" + request.params.id + '?fields=*.*').then((houseData) => {
    response.render('house', {house: houseData.data})
  })
})

// Maak een POST route voor de index
app.post('/', function (request, response) {
  // Er is nog geen afhandeling van POST, redirect naar GET op /
    response.redirect(303, '/')
})


// GET route voor de favorite pagina
app.get('/favorite/:id', function (request, response) {
    fetchJson(f_list + "/" + request.params.id + '?fields=*.*.*').then((listData) => {
        //console.log(listData.data.houses)
        console.log(FavoriteRatings)

        response.render('favorite', {list: listData.data, houses: listData.data.houses, ratings: FavoriteRatings})
    })
})

// Maak een POST route voor de favorite pagina
app.post('/favorite/:id', function (request, response) {
    // Variabelen
    const houseId = parseInt(request.body.houseId, 10)
    const userId = parseInt(request.body.userId, 10)
    const houseRatings = {}
    const notes = request.body.notes
    const listId = request.params.id

    // Categorieën
    const categories = ['algemeen', 'keuken', 'badkamer', 'tuin', 'prijs', 'ligging', 'oppervlakte']

    // Loop door alle categorieën
    categories.forEach(category => {
      // Sla de value van de form op en parse het naar een integer
      let rating = parseInt(request.body[category], 10)
      // Als rating undefined is maak het dan standaard 0
      if (!rating) {
        rating = 0
      }
      // Sla de rating op in een tijdelijke array
      houseRatings[category] = rating
    })

    fetchJson(f_feedback).then((apiResponse) => {
      try {
        apiResponse.data.rating = JSON.parse(apiResponse.data.rating)
      } catch (e) {
        apiResponse.data.rating = {}
      }

      apiResponse.data.rating = apiResponse.data.rating
    })

    fetchJson(f_feedback, {
      method: 'POST',
      body: JSON.stringify({
      house: houseId,
      list: listId,
      user: userId,
      note: notes,
      rating: houseRatings
    }),
    headers: {
      'Content-type': 'application/json; charset=UTF-8'
    }
    }).then((response) => {
      // Als er een enhanced property is dan wordt er een render gedaan client-side
      if (request.body.enhanced) {
        response.render('favorite', {list: listData.data, houses: listData.data.houses, ratings: FavoriteRatings})
      } else { // Geen enhanced property dus wordt er een redirect gedaan
        response.redirect(303, '/favorite/' + listId)
      }
    })
})

// Stel het poortnummer in waar express op moet gaan luisteren
app.set('port', process.env.PORT || 8000)

// Start express op, haal daarbij het zojuist ingestelde poortnummer op
app.listen(app.get('port'), function () {
  // Toon een bericht in de console en geef het poortnummer door
    console.log(`Application started on http://localhost:${app.get('port')}`)
})
