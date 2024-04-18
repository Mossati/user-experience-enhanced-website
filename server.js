// Importeer het npm pakket express uit de node_modules map
import express from 'express'

// Importeer de zelfgemaakte functie fetchJson uit de ./helpers map
import fetchJson from './helpers/fetch-json.js'

// Haal data op uit de FDND API, ga pas verder als de data gedownload is
const apiUrl = 'https://fdnd-agency.directus.app/items/'
const houses = apiUrl + 'f_houses'
const favoriteList = apiUrl + 'f_list'
const housesImages = apiUrl + 'f_houses_files'
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
    fetchJson(houses).then((housesData) => {
      response.render('index', {houses: housesData.data, ratings: FavoriteRatings})
    })
})

// GET route voor de favorites pagina
app.get('/favorites', function (request, response) {
  fetchJson(favoriteList).then((listsData) => {
    response.render('favorites', {lists: listsData.data})
  })
})

// GET route voor de house pagina
app.get('/house/:id', function (request, response) {
  fetchJson(houses + "/" + request.params.id + '?fields=*.*').then((houseData) => {
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
    fetchJson(favoriteList + "/" + request.params.id + '?fields=*.*.*').then((listData) => {
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
    const houseRatings = []
    const notes = request.body.notes
    const listId = request.params.id

    // Categorieën
    const categories = ['algemeen', 'keuken', 'badkamer', 'tuin', 'prijs', 'ligging', 'oppervlakte']

    // Zoek naar bestaande entry in array
    const existingIndex = FavoriteRatings.findIndex(entry => entry.houseId === houseId && entry.userId === userId)

    // Bestaande entry gevonden
    if (existingIndex !== -1) {
      // Loop door alle categorieën
      categories.forEach(category => {
          // Sla de value van de form op en parse het naar een integer
          let rating = parseInt(request.body[category], 10)
          // Als rating undefined is maak het dan standaard 0
          if (!rating) {
              rating = 0;
          }
          // Sla de rating op in een tijdelijke array
          houseRatings[category] = rating;
      });

      // Pas de array aan van de gevonden index
      FavoriteRatings[existingIndex] = { houseId: houseId, userId: userId, rating: houseRatings, notes: notes };
    } else { // Geen bestaande entry gevonden
      // Loop door alle categorieën
      categories.forEach(category => {
          // Sla de value van de form op en parse het naar een integer
          let rating = parseInt(request.body[category], 10);
          // Als rating undefined is maak het dan standaard 0
          if (!rating) {
              rating = 0;
          }
          // Sla de rating op in een tijdelijke array
          houseRatings[category] = rating;
      });

      // Push de waarden in een nieuwe entry
      FavoriteRatings.push({ houseId: houseId, userId: userId, rating: houseRatings, notes: notes })
      // Log de array
      //console.log(FavoriteRatings)
    }

    // Als er een enhanced property is dan wordt er een render gedaan client-side
    if (request.body.enhanced) {
      response.render('favorite', {list: listData.data, houses: listData.data.houses, ratings: FavoriteRatings})
    } else { // Geen enhanced property dus wordt er een redirect gedaan
      response.redirect(303, '/favorite/' + listId)
    }
})

// Stel het poortnummer in waar express op moet gaan luisteren
app.set('port', process.env.PORT || 8000)

// Start express op, haal daarbij het zojuist ingestelde poortnummer op
app.listen(app.get('port'), function () {
  // Toon een bericht in de console en geef het poortnummer door
    console.log(`Application started on http://localhost:${app.get('port')}`)
})
