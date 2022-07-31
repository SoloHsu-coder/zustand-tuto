import logo from "./logo.svg";
import "./App.css";
import create from "zustand";
import { useEffect } from "react";
import { mountStoreDevtool } from "simple-zustand-devtools";
const POKEMON_URL =
  "https://gist.githubusercontent.com/jherr/23ae3f96cf5ac341c98cd9aa164d2fe3/raw/f8d792f5b2cf97eaaf9f0c2119918f333e348823/pokemon.json";
const useStore = create((set) => ({
  filter: "",
  pokemon: [],
  setFilter: (filter) =>
    set((state) => ({
      ...state,
      filter,
    })),
  setPokemon: (pokemon) =>
    set((state) => ({
      ...state,
      pokemon,
    })),
}));

if (process.env.NODE_ENV === "development") {
  mountStoreDevtool("Store", useStore);
}
const FilterInput = () => {
  const filter = useStore((state) => state.filter);

  const setFilter = useStore((state) => state.setFilter);
  return <input value={filter} onChange={(e) => setFilter(e.target.value)} />;
};

const PokemonTable = () => {
  const pokemon = useStore((state) => state.pokemon);
  const filter = useStore((state) => state.filter);
  return (
    <table width="100%">
      <tbody>
        {pokemon
          .filter(({ name: { english } }) =>
            english.toLowerCase().includes(filter.toLowerCase())
          )
          .map(({ id, name: { english }, type }) => (
            <tr key={id}>
              <td>{english}</td>
              <td>{type.join(",")}</td>
            </tr>
          ))}
      </tbody>
    </table>
  );
};

fetch(POKEMON_URL)
  .then((res) => res.json())
  .then((pokemon) =>
    useStore.setState((state) => ({
      ...state,
      pokemon,
    }))
  );
function App() {
  // const filter = useStore((state) => state.filter);
  // const setPokemon = useStore((state) => state.setPokemon);

  // useEffect(() => {
  //   fetch(POKEMON_URL)
  //     .then((res) => res.json())
  //     .then((pokemon) => setPokemon(pokemon));
  // });
  return (
    <div className="App">
      <FilterInput />
      <h1>List of Pokemon</h1>
      <PokemonTable />
    </div>
  );
}

export default App;
