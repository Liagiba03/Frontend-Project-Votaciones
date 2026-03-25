import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom"
import useAuth from "../hooks/useAuth";
import crearVotacion from "../events/crearVotacion";
import moment from "moment";
import {useTimeValidation } from '../Context/TimeValidationProvider';
import TimeInvalid from "./TimeInvalid";


const CrearPropuesta = () => {
  const navigate = useNavigate();
  const { id, token } = useAuth();
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaLimite, setFechaLimite] = useState('');
  const [status, setStatus] = useState(false);
  const fechaActual = moment().toDate();
  const [opciones, setOpciones] = useState<{ id: number; texto: string; votos: number }[]>([]);
  const { isTimeValid } = useTimeValidation();


  useEffect(()=>{
    if (!token) {
      navigate('/login');
      return;
    }
  }, [])

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    // Aquí puedes manejar el envío de la propuesta
    const fechaInicioDate = new Date(fechaInicio);
    const fechaLimiteDate = new Date(fechaLimite);
    if (fechaInicioDate >= fechaLimiteDate) {
      toast.error('La fecha de inicio debe ser anterior a la fecha límite.');
      return;
    }else if(opciones.length < 2) {
      toast.error('Debe haber al menos dos opciones para la votación.');
      return;
    }else if(moment(fechaInicioDate).isSame(fechaActual, 'minute')){
      setStatus(true);
    }
      try {
      const data = {
        title: titulo,
        description: descripcion,
        creator_id: id,
        status: status,
        start_date: fechaInicioDate,
        end_date: fechaLimiteDate,
        options: opciones
      };
      if (!token) {
        navigate('/login');
        return;
      }
        let response = await crearVotacion(data, token);
        const dat = await response.json();
        //console.log(dat);
        if(response.status === 200){
          toast.success('Propuesta creada correctamente!');
          navigate('/menu'); // Redirigir al menú
        }
        else {
          toast.error(dat.message || 'Error al crear la propuesta enviada');
          //console.error(dat.message);
        }
      } catch (error:any) {
        toast.error(error.message || 'Error al crear la propuesta');
        //console.error(error);
        
      }
  };

  const agregarOpcion = () => {
    setOpciones([...opciones, { id: opciones.length + 1, texto: '', votos: 0 }]);
  };

  const eliminarOpcion = (id: number) => {
    setOpciones(opciones.filter(opcion => opcion.id !== id));
  };

  const actualizarTextoOpcion = (id: number, texto: string) => {
    setOpciones(opciones.map(opcion => (opcion.id === id ? { ...opcion, texto } : opcion)));
  };

  if (!isTimeValid) {
    return <TimeInvalid />;
}
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <button
          onClick={() => navigate('/menu')}
          className="bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 mb-6"
        >
          Volver
        </button>
        <h1 className="text-3xl font-bold text-center mb-6">Crear Propuesta</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="titulo" className="block text-sm font-medium text-gray-700">
              Título:
            </label>
            <input
              type="text"
              id="titulo"
              name="titulo"
              required
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700">
              Descripción:
            </label>
            <textarea
              id="descripcion"
              name="descripcion"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            ></textarea>
          </div>
          <div>
            <label htmlFor="fechaInicio" className="block text-sm font-medium text-gray-700">
              Fecha Inicio:
            </label>
            <input
              type="datetime-local"
              id="fechaInicio"
              name="fechaInicio"
              required
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="fechaLimite" className="block text-sm font-medium text-gray-700">
              Fecha Límite:
            </label>
            <input
              type="datetime-local"
              id="fechaLimite"
              name="fechaLimite"
              required
              value={fechaLimite}
              onChange={(e) => setFechaLimite(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <p className="text-lg font-semibold text-gray-700 mb-4">Agregar las opciones</p>
            {opciones.map(opcion => (
              <div key={opcion.id} className="flex items-center space-x-4 mb-2">
                <input
                  type="text"
                  placeholder={`Opción ${opcion.id}`}
                  value={opcion.texto}
                  onChange={(e) => actualizarTextoOpcion(opcion.id, e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
                <button
                  type="button"
                  onClick={() => eliminarOpcion(opcion.id)}
                  className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  -
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={agregarOpcion}
              className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              +
            </button>
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            Enviar Propuesta
          </button>
        </form>
      </div>
    </div>
  );
}

export default CrearPropuesta