// =========================================================================
// navbar animation
// =========================================================================
let btnNavRemove = document.querySelector('.btn-nav-remove');
let btnMenu = document.querySelector('.btn-menu');
let toggledNavMenu = document.querySelector('.toggled-navbar-list');

btnMenu.addEventListener("click", function(){
    toggledNavMenu.classList.remove('navbar-slide-up');
    toggledNavMenu.classList.toggle('navbar-slide-down');
});

btnNavRemove.addEventListener("click", function(){
    toggledNavMenu.classList.remove('navbar-slide-down');
    toggledNavMenu.classList.toggle('navbar-slide-up');
})
// =========================================================================
// format price
// =========================================================================
let housePrice = document.querySelector('.price');

function formatPrice(priceElement) {
    let priceText = priceElement.textContent.trim();
    let priceValue = parseFloat(priceText.replace(/[^\d.,]/g, '').replace(',', '.')); // Filter non-numeric characters and convert comma to dot
    let formattedPrice = priceValue.toLocaleString('nl-NL', { style: 'currency', currency: 'EUR' });
    priceElement.textContent = formattedPrice;
}

formatPrice(housePrice);
// =========================================================================
// user ratings
// =========================================================================
let btnUsers = document.querySelectorAll('.btn-user');
let userRatings = document.querySelectorAll('.user-ratings');

btnUsers.forEach(btnUser => {
    btnUser.addEventListener("click", function(){
        let userRating = btnUser.nextElementSibling;

        if (userRating.classList.contains('user-ratings-display')) {
            userRating.classList.remove('user-ratings-display');
            userRating.classList.remove('user-rating-slide-down');
            console.log("class verwijderd!");
        }else {
            userRating.classList.add('user-ratings-display');
            userRating.classList.add('user-rating-slide-down');
            console.log("class toegevoegd!");
        }
    });
});