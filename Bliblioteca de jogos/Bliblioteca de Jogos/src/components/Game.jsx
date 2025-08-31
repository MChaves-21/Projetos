import PropTypes from 'prop-types';

Game.propTypes = {
    title:PropTypes.string.isRequired,
    cover:PropTypes.string.isRequired,
    onRemove:PropTypes.func.isRequired,
}

export default function Game({ onRemove, cover, title }) {
  return (
    <div className="game">
      <h2>{title}</h2>
      <img src={cover} alt={`Capa do jogo ${title}`} />
      <button onClick={onRemove}>Remover</button>
    </div>
  );
}