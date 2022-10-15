class BreweryList extends HTMLElement {
  constructor() {
    super();
    this.breweryList = [];

    const listContainer = document.createElement("div");
    this.loadingEl = document.createElement("h6");
    this.loadingEl.innerText = "Loading...";
    this.loadingEl.hidden = true;

    listContainer.appendChild(this.loadingEl);

    this.breweryInput = document.createElement("input");
    this.breweryInput.placeholder = "Enter a city..";

    this.breweryButton = document.createElement("button");
    this.breweryButton.innerText = "Search for Breweries";

    this.breweryUl = document.createElement("ul");
    this.cityResultsEl = document.createElement("p");

    listContainer.appendChild(this.breweryInput);
    listContainer.appendChild(this.breweryButton);
    listContainer.appendChild(this.cityResultsEl);
    listContainer.appendChild(this.breweryUl);

    const shadow = this.attachShadow({ mode: "open" });
    shadow.appendChild(listContainer);
  }

  connectedCallback() {
    this.breweryButton.addEventListener("click", () => {
      if (!this.breweryInput.value) {
        return;
      }

      this.fetchBreweryList(this.breweryInput.value);
      this.breweryInput.value = "";
    });

    if (!this.breweryList.length) {
      this.fetchBreweryList("Los Angeles");
    }
  }

  addBreweryElement(brewery) {
    const li = document.createElement("li");
    li.innerText = `Name: ${brewery.name} Address: ${brewery.street} City: ${brewery.city}`;
    this.breweryUl.appendChild(li);
  }

  removeExistingBreweryElements() {
    this.breweryUl.innerHTML = "";
  }

  setResultsForCityElementText(cityName, numResults) {
    this.cityResultsEl.innerText = `Showing ${numResults} brewery results for ${cityName}`;
  }

  setLoadingState(isLoading) {
    this.loadingEl.hidden = !isLoading;
  }

  async fetchBreweryList(city) {
    this.setLoadingState(true);
    const breweryDbApiUrl = `https://api.openbrewerydb.org/breweries?by_city=${city}&per_page=25`;
    const breweriesRes = await fetch(breweryDbApiUrl);
    const jsonRes = await breweriesRes.json();
    this.breweryList = jsonRes;
    this.setLoadingState(false);
    this.removeExistingBreweryElements();
    this.setResultsForCityElementText(city, this.breweryList.length);

    this.breweryList.forEach((brewery) => this.addBreweryElement(brewery));
  }
}

customElements.define("brewery-list", BreweryList);
