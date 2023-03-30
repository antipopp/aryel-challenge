const searchInput = document.getElementById(
  "search-input"
) as HTMLInputElement | null;
const searchButton = document.getElementById(
  "search-btn"
) as HTMLButtonElement | null;

if (!searchInput) throw new Error("Search input not found");
if (!searchButton) throw new Error("Search button not found");

searchButton.addEventListener("click", () => {
  const nickname = searchInput.value;
  if (nickname === "") {
    showError("Nickname cannot be empty");
    return;
  }
  window.location.href = `/search/${nickname}`;
});
