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
        //console.log(FavoriteRatings)

        response.render('favorite', {list: listData.data, houses: listData.data.houses, ratings: FavoriteRatings})
    })
})

// Maak een POST route voor de favorite pagina
app.post('/favorite/:id', function (request, response) {
    const houseId = request.body.houseId
    const userId = request.body.userId
    const houseRatings = []
    const notes = request.body.notes
    const listId = request.params.id;

    const categories = ['algemeen', 'keuken', 'badkamer', 'tuin', 'prijs', 'ligging', 'oppervlakte'];

    categories.forEach(category => {
        const rating = request.body[category];
        houseRatings[category] = rating;
    });

    FavoriteRatings.push({ houseId: houseId, userId: userId, rating: houseRatings, notes: notes})
    console.log(FavoriteRatings)
    
    response.redirect(303, '/favorite/' + listId)
})

// Stel het poortnummer in waar express op moet gaan luisteren
app.set('port', process.env.PORT || 8000)

// Start express op, haal daarbij het zojuist ingestelde poortnummer op
app.listen(app.get('port'), function () {
  // Toon een bericht in de console en geef het poortnummer door
    console.log(`Application started on http://localhost:${app.get('port')}`)
})
