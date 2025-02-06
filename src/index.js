document.addEventListener("DOMContentLoaded", () => {
    const BASE_URL = "http://localhost:3000/cakes";
    const cakeList = document.getElementById("cake-list");
    const cakeName = document.getElementById("cake-name");
    const cakeImage = document.getElementById("cake-image");
    const cakeDescription = document.getElementById("cake-description");
    const reviewList = document.getElementById("review-list");
    const descriptionForm = document.getElementById("description-form");
    const reviewForm = document.getElementById("review-form");

    let activeCake;

    // Fetch cakes from the API when the page loads
    function fetchCakes() {
        fetch(BASE_URL)
            .then((response) => response.ok ? response.json() : Promise.reject("Failed to fetch cakes"))
            .then((cakes) => {
                activeCake = cakes[0];  // Default to the first cake
                updateCakeDetails(activeCake);
                populateCakeList(cakes);
            })
            .catch((error) => console.error("Error fetching cakes:", error));
    }

    // Populate the list of cakes on the page
    function populateCakeList(cakes) {
        cakes.forEach((cake) => {
            const listItem = document.createElement("li");
            listItem.textContent = cake.name;
            listItem.addEventListener("click", () => selectCake(cake));
            cakeList.appendChild(listItem);
        });
    }

    // Select a cake and update its details
    function selectCake(cake) {
        activeCake = cake;
        updateCakeDetails(cake);
    }

    // Update cake details (name, image, description)
    function updateCakeDetails(cake) {
        cakeName.textContent = cake.name;
        cakeImage.src = cake.image_url;
        cakeImage.alt = cake.name;
        cakeDescription.textContent = cake.description;
        updateReviews(cake.reviews);
    }

    // Update the list of reviews
    function updateReviews(reviews) {
        reviewList.innerHTML = ""; // Clear existing reviews
        reviews.forEach((review) => {
            const reviewItem = document.createElement("li");
            reviewItem.textContent = review;
            reviewList.appendChild(reviewItem);
        });
    }

    // Handle updating cake property (like description or reviews)
    function updateCakeProperty(property, value) {
        fetch(`${BASE_URL}/${activeCake.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ [property]: value }),
        })
            .then((response) => response.json())
            .then((updatedCake) => {
                activeCake[property] = updatedCake[property];
                property === 'description' ? updateCakeDetails(activeCake) : updateReviews(updatedCake.reviews);
            })
            .catch((error) => console.error(`Error updating ${property}:`, error));
    }

    // Handle submitting a new description
    descriptionForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const newDescription = e.target.description.value;
        if (newDescription) {
            updateCakeProperty('description', newDescription);
            e.target.reset();
        }
    });

    // Handle submitting a new review
    reviewForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const newReview = e.target.review.value;
        if (newReview) {
            const updatedReviews = [...activeCake.reviews, newReview];
            updateCakeProperty('reviews', updatedReviews);
            e.target.reset();
        }
    });

    // Initial setup: Fetch and display cakes
    fetchCakes();
});
