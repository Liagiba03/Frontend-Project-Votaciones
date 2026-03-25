import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { useEffect, useState } from 'react';
import mostrarPropuestas from '../events/mostrarPropuestas';
import toast from 'react-hot-toast';
import Card from './Card';
import detalleVotacion from '../events/detalleVotacion';
import type { Propuesta } from '../Types/propuesta';
import unirseVotacion from '../events/unirseVotacion';import TimeInvalid from './TimeInvalid';
import {useTimeValidation } from '../Context/TimeValidationProvider';


const Votaciones = () => {
    const { clearAuthData, user, id, token } = useAuth();
    const navigate = useNavigate();
    //const [propuestas, setPropuestas] = useState([]);
    const [propuestas, setPropuestas] = useState<Propuesta[]>([]); // Tipar el estado con la interfaz
    const [codigoUnion, setCodigoUnion] = useState('');
    //const [isTimeValid, setIsTimeValid] = useState(true); // Estado para verificar la hora
    const { isTimeValid } = useTimeValidation();

    
    useEffect(() => {
        if (!token) {
            navigate('/login');
        }
    }, [token, navigate]);

    /*useEffect(() => {
        checkDeviceTime();
    }, []);*/


    useEffect(() => {
        getPropuestas();
        // Configurar un intervalo para actualizar el estado de la propuesta periódicamente
        const interval = setInterval(() => {
            getPropuestas();
            //checkDeviceTime();
        }, 10000); // Actualiza cada 10 segundos

        // Limpiar el intervalo cuando el componente se desmonte
        return () => clearInterval(interval);
    }, []);

    const closeSesion = () => {
        clearAuthData();
        navigate('/login');
    }

    const getPropuestas = async () => {
        
        if (!id || !token) {
            toast.error('El ID de usuario no está disponible');
            return;
        }
        try {
            let response = await mostrarPropuestas(id, token);

            //console.log(data);
            if (response.status === 200) {
                const data = await response.json();
                setPropuestas(data)
            } else if (response.status === 404) {
                //toast.error('No se encontraron propuestas');
                //setPropuestas([]);
            } else {
                const data = await response.json();
                toast.error(data.message || 'Error al obtener las propuestas');
            }
        } catch (error: any) {
            toast.error(error.message || 'Error al obtener la propuesta');
        }
    }

    const unirseAPropuesta = async (e: any) => {
        e.preventDefault();
        if (!codigoUnion) {
            toast.error('Debes ingresar un código');
            return;
        }
        if (codigoUnion.length != 24) {
            toast.error('Longitud del código incorrecta');
            return;
        }
        if (!id || !token) {
            toast.error('El ID de usuario no está disponible');
            return;
        }

        try {
            let response = await detalleVotacion(codigoUnion,token);
            const data = await response.json();
            if (response.status === 200) {
                //console.log('SE ENCONTRO LA PROPUESTA')
                const disponible = propuestas.some(prop => prop.propuesta && prop.propuesta._id === codigoUnion);
                //console.log(disponible);
                if (!disponible) {
                    //UNIRSE A LA PROPUESTA SI ESTÁ DISPONIBLE
                    if (id) {
                        let responseUnirse = await unirseVotacion(id, codigoUnion, token);
                        if (responseUnirse.status === 200) {
                            //const dataUnirse = await responseUnirse.json();
                            toast.success('Te has unido a la propuesta');
                            await getPropuestas(); //Actualizar las propuestas
                            // console.log(dataUnirse);
                        } else if (responseUnirse.status === 400) {
                            const dataUnirse = await responseUnirse.json();
                            toast.error(dataUnirse || 'Error al unirse a la propuesta');
                            console.log('segundo'+ dataUnirse);
                        }
                        else {
                            toast.error(data.message || 'Error al obtener la propuesta');
                            console.log('tercero'+ data.message);
                        }
                    } else {
                        toast.error('El ID de usuario no está disponible');
                    }
                    //toast.success('DISPONIBLE');
                } else {
                    toast.error('Ya estas unido a esta propuesta')
                }
            } else if (response.status == 404) {
                toast.error('No se encontró la propuesta');
            } else {
                toast.error('Error al obtener la propuesta');
            }

        } catch (error: any) {
            toast.error(error.message || 'Error al buscar la propuesta')
        }
    }

    if (!isTimeValid) {
        return <TimeInvalid />;
    }

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
                <h1 className="text-3xl font-bold text-center mb-6">Votaciones</h1>
                <p className="text-lg text-gray-700 text-center mb-4">
                    Bienvenido, <span className="font-semibold">{user}</span>
                </p>
                <p className="text-sm text-gray-500 text-center mb-6">
                    Elige una votación para participar o mira los resultados de las votaciones cerradas.
                </p>

                <div className="flex justify-center mb-6">
                    <button
                        onClick={() => navigate('/create')}
                        className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        Crear Votación
                    </button>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg shadow-sm mb-6">
                    <p className="text-lg font-semibold text-gray-700 mb-4">Únete a una votación</p>
                    <div className="flex items-center space-x-4">
                        <input
                            type="text"
                            placeholder="Código de unión"
                            value={codigoUnion}
                            onChange={(e) => setCodigoUnion(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        <button
                            onClick={unirseAPropuesta}
                            className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                            Unirse
                        </button>
                    </div>
                </div>

                <h2 className="text-2xl font-bold text-gray-700 mb-4">Propuestas</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {propuestas.map((propuesta: any, index: any) => {
                        if (!propuesta.propuesta) {
                            return null;
                        }

                        const { title, description, status, _id } = propuesta.propuesta;
                        return (
                            <Card
                                key={index}
                                title={title}
                                id={_id}
                                status={status}
                                description={description}
                            />
                        );
                    })}
                </div>

                <div className="flex justify-center mt-6">
                    <button
                        onClick={closeSesion}
                        className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                    >
                        Cerrar Sesión
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Votaciones