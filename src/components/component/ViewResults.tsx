import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import toast from 'react-hot-toast';
import moment from 'moment';
import results from '../events/results';
import type { Resultado } from '../Types/resultadosType';
import {useTimeValidation } from '../Context/TimeValidationProvider';
import TimeInvalid from './TimeInvalid';



const ViewResults = () => {
  const { idPropuesta } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();
  let [fechaInicio, setFechaInicio] = useState('');
  let [fechaFinal, setFechaFinal] = useState('');
  const [resultados, setResultados] = useState<Resultado | null>(null);
  const { isTimeValid } = useTimeValidation();


  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  useEffect(() => {
    if (idPropuesta) {
      getPropuesta(idPropuesta);
    } else {
      toast.error('La propuesta no está disponible');
    }

  }, []);

  const getPropuesta = async (id: string) => {
    if (!idPropuesta) {
      toast.error('La propuesta no está disponible');
      return;
    }
    if (!id || !token) {
      toast.error('El ID de usuario no está disponible');
      return;
    }
    try {
      let response = await results(idPropuesta, token)
      if (response.status === 200) {
        const data = await response.json();
        setFechaInicio(moment(data.start_date).format('LLL'));
        setFechaFinal(moment(data.end_date).format('LLL'));
        setResultados(data);
      }
    } catch (error: any) {
      toast.error(error.message || 'Error al obtener la propuesta');
    }
  }

  if (!isTimeValid) {
    return <TimeInvalid />;
}

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <button
          onClick={() => navigate('/vota/' + idPropuesta)}
          className="bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 mb-6"
        >
          Volver
        </button>
        <h1 className="text-3xl font-bold text-center mb-6">{resultados?.title || 'Título no disponible'}</h1>
        <p className="text-lg text-gray-700 mb-4">{resultados?.description || 'Descripción no disponible'}</p>
        <p className="text-sm text-gray-500 mb-4">Fecha de inicio: {fechaInicio}</p>
        <p className="text-sm text-gray-500 mb-4">Fecha de finalización: {fechaFinal}</p>
        <p className="text-lg font-semibold text-gray-700 mb-4">Total de votos: {resultados?.totalVotos || 0}</p>
        <p className="text-lg font-semibold text-green-600 mb-6">Ganador: {resultados?.ganador || 'No disponible'}</p>
        <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Resultados de las votaciones</h2>
          {resultados?.resultados.map((resultado, index) => (
            <div key={index} className="border-b border-gray-300 py-2">
              <p className="text-sm text-gray-700">Opción: {resultado.texto}</p>
              <p className="text-sm text-gray-700">Votos: {resultado.votos}</p>
            </div>
          )) || (
            <p className="text-sm text-gray-500">No hay resultados disponibles</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ViewResults