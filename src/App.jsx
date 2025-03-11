import { useState, useEffect } from 'react'
import './App.css';

function App () {
  const [query, setQuery] = useState("")
  const [pokemon, setPokemon] = useState(null) // Ponemos NULL porque, al abrir la app, aún no hemos buscado nada.
  const [loading, setLoading] = useState(false) // Ponemos FALSE porque, al cargar la página, no estamos buscando aún.
  const [error, setError] = useState(null) // Ponemos NULL porque, al principio no hay errores.

  useEffect(() =>{
    if (!query) {
      setPokemon(null)
      return
    }

    const fetchPokemon = async () => {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${query.toLowerCase()}`)
        if (!response.ok) {
          throw new Error("Pokémon no encontrado")
        }
        const data = await response.json()
        setPokemon(data)
      } catch (error) {
        setPokemon(null)
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    const delayDebounce = setTimeout(fetchPokemon, 500) // debounce evita hacer muchas peticiones seguidas mientras el usuario escribe. // espera 500ms 
    return () => clearTimeout(delayDebounce) // cancela la busqueda anterior si el usuario sigue escribiendo.
  }, [query])
 
  return(
    <div className='app-container'>
      <h1>Buscador de Pokémon</h1>
      <input
        type="text"
        placeholder="Escribe el nombre de un pokémon"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {loading && <p>Cargando...</p>}
      {error && <p className='error'>{error}</p>}
      {pokemon && (
        <div className='pokemon-card'>
          <h2>{pokemon.name.toUpperCase()}</h2>
          <img src={pokemon.sprites.front_default} alt={pokemon.name} />
          <p>Peso: {pokemon.weight} hg</p>
          <p>Altura: {pokemon.height} dm</p>
        </div>
      )}
    </div>
  ) 
};

export default App;
