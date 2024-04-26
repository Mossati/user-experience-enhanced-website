// =========================================================================
// rating menu
// =========================================================================
let btnGroupRatings = document.querySelectorAll('.btn-group-rating');
let groupRatingArticles = document.querySelectorAll('.group-rating-article');
let btnUserRatings = document.querySelectorAll('.btn-user-rating');
let userRatingForms = document.querySelectorAll('.user-rating-form');

btnGroupRatings.forEach((btnGroupRating, index) => {
    btnGroupRating.addEventListener("click", function() {
        if (btnGroupRating.classList.contains('rating-open')) {
            btnGroupRating.classList.remove('rating-open');
        }else {
            btnGroupRating.classList.add('rating-open');
        }

        let groupRatingArticle = groupRatingArticles[index];

        if (groupRatingArticle) {
            groupRatingArticle.classList.toggle('hidden');
        }
    });
});

btnUserRatings.forEach((btnUserRating, index) => {
    btnUserRating.addEventListener("click", function() {
        if (btnUserRating.classList.contains('rating-open')) {
            btnUserRating.classList.remove('rating-open');
        }else {
            btnUserRating.classList.add('rating-open');
        }

        let userRatingForm = userRatingForms[index];

        if (userRatingForm) {
            userRatingForm.classList.toggle('hidden');
        }
    });
});
// =========================================================================
// rating stars (niet af!)
// =========================================================================
const starLabels = document.querySelectorAll(".star-list .star-item label");

function fillStars(index, fill) {
    if (fill) {
        label.classList.add('filled-star');
    } else {
        label.classList.remove('filled-star');
    }
}

starLabels.forEach((label, index) => {
    starValue = (index % 5) + 1;

    // hover over ster en voeg class tijdelijk toe
    label.addEventListener("mouseover", function(){
        //fillStars(index, true);
        //console.log(index);
    });

    // hover weg en verwijder class
    label.addEventListener("mouseleave", function(){
        //fillStars(index, false);
    });

    // klik op ster en voeg class permanent toe
    label.addEventListener("click", function(){
        //console.log(index);
    });
});
// =========================================================================
// rating form (CLS)
// =========================================================================
// Selecteer alle rating forms
const forms = document.querySelectorAll('.user-rating-form');
const successBar = document.querySelector('.success-bar');

successBar.addEventListener("click", function(){
    successBar.classList.add('hidden');
});

forms.forEach((form, index) => {
    console.log(index);
    form.addEventListener('submit', function(event) {
        // Voeg een extra eigenschap aan de formulierdata toe
        const data = new FormData(this);
        data.append('enhanced', true);

        fetch(this.action, {
            // De POST method ophalen
            method: this.method,
            // De data van de form meegeven aan de body
            body: new URLSearchParams(data)
        }).then(function(response) {
            // Als de server een antwoord geeft, krijgen we een stream terug
            // We willen hiervan de text gebruiken, wat in dit geval HTML teruggeeft
            return response.text();

        }).then(function(responseHTML) {
            // Maak tijdelijk DOM element aan
            const tempDOM = document.createElement('div');
            // Plaats de responseHTML in de tijdelijke DOM
            tempDOM.innerHTML = responseHTML;
            // Selecteer het rating gedeelte uit de tijdelijke DOM
            const responseDOM = tempDOM.querySelectorAll('.rating-test')[index];

            // log
            console.log(responseDOM);
            console.log(document.querySelectorAll('.rating-test')[index]);
            // Selecteer het rating gedeelte uit de DOM en vervang het
            document.querySelectorAll('.rating-test')[index].innerHTML = responseDOM.innerHTML;
            //console.log(responseHTML);

            if (successBar.classList.contains('hidden')) {
                successBar.classList.remove('hidden');
            }

            // Haal na 5 seconden de bar weer weg
            setTimeout(function() {
                successBar.classList.add('hidden');
            }, 5000);
        });
        event.preventDefault();
    });
});
