import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom"
import detalleVotacion from "../events/detalleVotacion";
import type { PropuestaProps } from "../Types/propuesta";
import moment from "moment";
import useAuth from "../hooks/useAuth";
import voted from "../events/Voted";
import votar from "../events/votar";
import {useTimeValidation } from '../Context/TimeValidationProvider';
import TimeInvalid from "./TimeInvalid";


const ViewVotacion = () => {

    const { idPropuesta } = useParams();
    const [propuesta, setPropuesta] = useState<PropuestaProps | null>(null);
    const [status, setStatus] = useState(null);
    let [fechaInicio, setFechaInicio] = useState('');
    let [fechaFinal, setFechaFinal] = useState('');
    let [seleccion, setSeleccion] = useState('');
    const { isTimeValid } = useTimeValidation();
    const horaActual = moment();
    const isBeforeStart = propuesta?.start_date && horaActual.isBefore(moment(propuesta.start_date));

    //const [votacionRealizada, setVotacionRealizada] = useState(false);
    const { id, token } = useAuth();
    const navigate = useNavigate();
    //console.log(id);
    useEffect(() => {
        if (!token) {
            navigate('/login');
        }
    }, [token, navigate]);

    useEffect(() => {
        if (idPropuesta) {
            getPropuesta(idPropuesta);
            // Configurar un intervalo para actualizar el estado de la propuesta periódicamente
            const interval = setInterval(() => {
                getPropuesta(idPropuesta);
            }, 10000); // Actualiza cada 30 segundos

            // Limpiar el intervalo cuando el componente se desmonte
            return () => clearInterval(interval);
        } else {
            toast.error('El ID no está disponible en la URL');
        }
    }, []);

    const getPropuesta = async (id: string) => {
        if (!idPropuesta) {
            toast.error('La propuesta no está disponible');
        }
        if (!id || !token) {
            toast.error('El ID de usuario no está disponible');
            return;
        }
        try {
            let response = await detalleVotacion(id, token);
            const data = await response.json();
            if (response.status === 200) {
                setFechaInicio(moment(data.start_date).format('LLL'))
                setFechaFinal(moment(data.end_date).format('LLL'));
                setStatus(data.status);
                setPropuesta(data);
            } else if (response.status === 404) {
                toast.error('No se encontró la propuesta');
            }
            else {
                toast.error(data.message || 'Error al obtener la propuesta');
            }
            //console.log(data);
        } catch (error: any) {
            toast.error(error.message || 'Error al obtener la propuesta');
        }
    }

    const setVoto = async (e: any) => {
        e.preventDefault();
        if (!seleccion) {
            toast.error('Debes seleccionar una opción antes de votar');
            return;
        }
        if (propuesta?.status === false) {
            toast.error('La votación está cerrada');
            return;
        }
        try {
            //toast.success('Voto se puede enviar');
            if (!id || !token) {
                toast.error('El ID de usuario no está disponible');
                return;
            }
            if (idPropuesta && id) {
                let response = await voted(idPropuesta, id, token);

                if (response.status === 200) {
                    const data = await response.json();
                    const voted = data.voted
                    const idMiembro = data.miembro;
                    //console.log(idMiembro);
                    if (!voted) {
                        //toast.success('EMITIR VOTO')
                        let responseVoto = await votar(idPropuesta, idMiembro, seleccion, token);
                        /*console.log(idPropuesta)
                        console.log(idMiembro)
                        console.log(seleccion)*/
                        if (responseVoto.status === 200) {
                            // const data = await responseVoto.json();
                            //console.log(data);
                            //setVotacionRealizada(true);
                            toast.success('Voto enviado correctamente');
                            setSeleccion('');
                            // Redirigir a la página de resultados o a otra página
                            // navigate('/resultados'); // Descomentar si se desea redirigir

                        } else {
                            const data = await responseVoto.json();
                            toast.error(data.message || 'Error al enviar el voto');
                            //console.log(data);
                        }
                    } else {
                        //setVotacionRealizada(true);
                        toast.error('Ya votaste en esta propuesta');
                    }
                }
            } else {
                toast.error('ID de propuesta o usuario no disponible');
            }
        } catch (error: any) {
            toast.error(error.message || 'Error al enviar el voto');

        }
        // console.log('Voto enviado:', seleccion);
    }

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
                <h1 className="text-3xl font-bold text-center mb-6">{propuesta?.title || 'Título no disponible'}</h1>
                <p className="text-lg text-gray-700 mb-4">{propuesta?.description || 'Descripción no disponible'}</p>
                <p className="text-sm text-gray-500 mb-4">Inicio de la votación: {fechaInicio}</p>
                <p className="text-sm text-gray-500 mb-4">Fin de la votación: {fechaFinal}</p>
                <p className={`text-sm font-semibold mb-4 ${status ? 'text-green-600' : 'text-red-600'}`}>
                    Estado: {status ? 'Abierta' : 'Cerrada'}
                </p>
                <p className="text-sm text-gray-700 mb-4">Seleccionaste la opción: {seleccion}</p>
                <div className="flex flex-col space-y-4">
                    {propuesta?.options.map((propuesta, index) => (
                        <button
                            key={index}
                            disabled={!status}
                            onClick={() => setSeleccion(propuesta.texto)}
                            className={`py-2 px-4 rounded-md shadow-sm focus:outline-none ${status ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                }`}
                        >
                            {propuesta.texto}
                        </button>
                    ))}
                    {status && !isBeforeStart ? (
                        <button
                            onClick={setVoto}
                            className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
                            Votar
                        </button>
                    ) : isBeforeStart ? (
                        <div
                            className="w-full bg-purple-300 text-black-500 text-center py-2 px-4 rounded-md cursor-not-allowed">
                            No ha iniciado la votación
                        </div>
                    ) : (
                        <button
                            onClick={() => navigate('/results/' + idPropuesta)}
                            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                            Ver resultados
                        </button>
                    )}
                </div>
                {propuesta?.creator_id === id && (
    <div className="mt-6 bg-gray-50 p-4 rounded-lg shadow-sm">
        <p className="text-sm text-gray-700 mb-2">Comparte la votación de esta propuesta con el siguiente código:</p>
        <div className="flex items-center space-x-4">
            <p className="text-lg font-semibold text-gray-800">{propuesta?._id || 'No disponible'}</p>
            <button
                onClick={() => {
                    if (propuesta?._id) {
                        navigator.clipboard.writeText(propuesta._id);
                        toast.success('Código copiado al portapapeles');
                    } else {
                        toast.error('Código no disponible para copiar');
                    }
                }}
                className="bg-blue-600 text-white py-1 px-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
                Copiar
            </button>
        </div>
    </div>
)}
            </div>
        </div>
    );
}

export default ViewVotacion