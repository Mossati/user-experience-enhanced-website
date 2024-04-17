// =========================================================================
// rating menu
// =========================================================================
let btnGroupRatings = document.querySelectorAll('.btn-group-rating');
let groupRatingArticles = document.querySelectorAll('.group-rating-article');
let btnUserRatings = document.querySelectorAll('.btn-user-rating');
let userRatingForms = document.querySelectorAll('.user-rating-form');

btnGroupRatings.forEach((btnGroupRating, index) => {
    btnGroupRating.addEventListener("click", function() {
        let groupRatingArticle = groupRatingArticles[index];

        if (groupRatingArticle) {
            groupRatingArticle.classList.toggle('hidden');
        }
    });
});

btnUserRatings.forEach((btnUserRating, index) => {
    btnUserRating.addEventListener("click", function() {
        let userRatingForm = userRatingForms[index];

        if (userRatingForm) {
            userRatingForm.classList.toggle('hidden');
        }
    });
});
// =========================================================================
// rating stars
// =========================================================================
