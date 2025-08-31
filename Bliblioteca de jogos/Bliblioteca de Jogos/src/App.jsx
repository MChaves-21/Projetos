import { useState } from 'react'; // Não se esqueça de importar o useState

export default function App() {
  const [games, setGames] = useState(()=>{
    const storedGames = localStorage.getItem("games");
    return storedGames ? JSON.parse(storedGames) : [];
  });
  const [title, setTitle] = useState("");
  const [cover, setCover] = useState("");
  
  const RemoverGame = (id) => {
  setGames(state => {
    const newState = state.filter(game => game.id !== id);
    localStorage.setItem("games", JSON.stringify(newState));
    return newState;})
  }


  const addGame = ({title,cover}) => {
    const id = Math.floor(Math.random() * 10000);
    const newGame = {id, title, cover};
    setGames(state => {
      const newState = [...state, newGame];
      localStorage.setItem("games", JSON.stringify(newState));
      return newState;
    });
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    addGame({ title, cover });
    setCover("");
    setTitle(""); 
  }
  
  return (
    <div id="app">
      <h1>Bliblioteca de jogos</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Titulo </label>
          <input
            type="text"
            name="title"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="cover">Capa  </label>
          <input 
            type="text"
            name="cover"
            id="cover"
            value={cover}
            onChange={(e) => setCover(e.target.value)}
          />
        </div>
        <button type="submit">Adicionar a Bliblioteca</button>
      </form>
      <div className='games'>
        {games.map((game) => (
          <div key={game.id} className="game">
            <h2>{game.title}</h2>
              <img src={game.cover} alt={`Capa do jogo ${game.title}`} />
            <button onClick={()=>RemoverGame(game.id)}>Remover</button>
          
          </div>
        ))}
      </div>
    </div>
  )
}