// //  pokemonRepository IIFE
let pokemonRepository = (function () {
  let pokemonList = [];
  let apiUrl = "https://pokeapi.co/api/v2/pokemon/?limit=152"; // api url

  // adds new pokemon to list
  function add(pokemon) {
    if (
      typeof pokemon === "object" &&
      "name" in pokemon &&
      "detailsUrl" in pokemon
      // "height" in pokemon &&
      // "types" in pokemon
    ) {
      pokemonList.push(pokemon);
    } else {
      console.log("pokemon is not correct");
    }
  }

  // gets all pokemon and sorts them from a-b
  // returns the list of sorted pokemons
  function getAll() {
    let sortedPokemon = pokemonList.sort(function (a, b) {
      return a.name.localeCompare(b.name);
    });
    return sortedPokemon;
  }

  // adds pokemon to each list item
  function addListItem(pokemon) {
    let row = document.getElementById("row");

    // create column div
    let colDiv = document.createElement("div");
    colDiv.classList.add("col", "col-xl-3", "col-lg-4", "col-md-6", "col-sm-8");

    // create button
    let button = document.createElement("button");
    button.innerText = pokemon.name;
    button.setAttribute("data-toggle", "modal");
    button.setAttribute("data-target", "#modal");
    button.classList.add("btn", "btn-primary", "pokemon-button");

    // append button to column
    colDiv.appendChild(button);

    // append column to row
    row.appendChild(colDiv);

    // event listener for button
    button.addEventListener("click", function () {
      console.log(pokemon);
      showDetails(pokemon);
    });
  }

  // shows pokemon details
  function showDetails(pokemon) {
    loadDetails(pokemon).then(function () {
      let modalBody = document.querySelector(".modal-body");
      let modalTitle = document.querySelector(".modal-title");

      // empty modal content
      modalBody.innerHTML = "";
      modalTitle.innerHTML = "";

      // add pokemon details to modal
      let pokemonName = document.createElement("h1");
      pokemonName.classList.add("modal-title");
      // uppercases first letter of each pokemon name
      pokemonName.innerText =
        pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);

      // creates img element
      // front-side of pokemon
      let pokemonImage = document.createElement("img");
      pokemonImage.src = pokemon.imageUrl;
      pokemonImage.classList.add("modal-image");
      // back-side of pokemon
      let pokemonBack = document.createElement("img");
      pokemonBack.src = pokemon.back;
      pokemonBack.classList.add("modal-image");

      // creates modal content
      let pokemonHeight = document.createElement("p");
      pokemonHeight.innerText = "Height: " + pokemon.height;
      let pokemonType = document.createElement("p");
      pokemonType.innerText = "Types: " + pokemon.types.join(", ");
      let pokemonWeight = document.createElement("p");
      pokemonWeight.innerText = "Weight: " + pokemon.weight;
      let pokemonAbility = document.createElement("p");
      pokemonAbility.innerText = "Abilities: " + pokemon.abilities.join(", ");

      // appends
      modalTitle.appendChild(pokemonName);
      modalBody.appendChild(pokemonImage);
      modalBody.appendChild(pokemonBack);
      modalBody.appendChild(pokemonHeight);
      modalBody.appendChild(pokemonType);
      modalBody.appendChild(pokemonWeight);
      modalBody.appendChild(pokemonAbility);
    });

    return pokemon;
  }

  // loads list of pokemons
  async function loadList() {
    // returns json of api data
    return fetch(apiUrl)
      .then(function (response) {
        return response.json();
      })
      .then(function (json) {
        // each pokemon item has a property of name and detailsUrl
        json.results.forEach(function (item) {
          let pokemon = {
            name: item.name,
            detailsUrl: item.url,
          };
          add(pokemon);
          console.log(pokemon);
        });
      })
      .catch(function (e) {
        console.error(e);
      });
  }

  // loads details of each pokemon
  async function loadDetails(item) {
    let url = item.detailsUrl;
    return fetch(url)
      .then(function (response) {
        return response.json();
      })
      .then(function (details) {
        // details to each item
        item.imageUrl = details.sprites.front_default;
        item.height = details.height;
        item.types = details.types.map(function (pokemon) {
          return pokemon.type.name;
        });
        item.weight = details.weight;
        item.abilities = details.abilities.map(function (pokemon) {
          return pokemon.ability.name;
        });
        item.back = details.sprites.back_default;
      })
      .catch(function (e) {
        console.error;
      });
  }

  return {
    add: add,
    getAll: getAll,
    addListItem: addListItem,
    loadList: loadList,
    loadDetails: loadDetails,
    showDetails: showDetails,
  };
})();

pokemonRepository.loadList().then(function () {
  // loaded data
  pokemonRepository.getAll().forEach(function (pokemon) {
    pokemonRepository.addListItem(pokemon);
  });
});
