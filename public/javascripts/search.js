"use strict";
const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-btn");
if (!searchInput)
    throw new Error("Search input not found");
if (!searchButton)
    throw new Error("Search button not found");
searchButton.addEventListener("submit", (e) => {
    e.preventDefault();
    const nickname = searchInput.value;
    if (nickname === "") {
        showError("Nickname cannot be empty");
        return;
    }
    window.location.href = `/search/${nickname}`;
});
