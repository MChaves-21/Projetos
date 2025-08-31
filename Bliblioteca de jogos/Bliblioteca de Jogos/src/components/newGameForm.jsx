import { useState } from 'react';
import PropTypes from 'prop-types';
import TextInput from './TextInput';

NewGAMEFORM.propTypes = {
    addGame: PropTypes.func.isRequired,
}
export default function NewGAMEFORM({ addGame }) {

    const [title, setTitle] = useState("");
    const [cover, setCover] = useState("");

    const handleSubmit = (event) => {
        event.preventDefault();
        addGame({ title, cover });
        setCover("");
        setTitle("");
    }


    return (
           <form onSubmit={handleSubmit}>
      <TextInput id="title" label="Título" value={title} onChange={(ev) => setTitle(ev.target.value)} />
      <TextInput id="cover" label="Capa" value={cover} onChange={(ev) => setCover(ev.target.value)} />
      <button>Adicionar</button>
    </form>)
}