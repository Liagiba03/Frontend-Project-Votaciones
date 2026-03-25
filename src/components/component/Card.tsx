import { useNavigate } from "react-router-dom"
import type { CardProps } from "../Types/card"
import useAuth from "../hooks/useAuth";
import { useEffect } from "react";



const Card = ({ title,id, status, description }: CardProps) => {
  const {token} = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
        navigate('/login');
    }
}, [token, navigate]);
return (
  <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
    <h2 className="text-xl font-bold text-gray-800 mb-2">{title}</h2>
    <p className="text-gray-600 mb-4">{description}</p>
    <p className={`text-sm font-semibold mb-4 ${status ? 'text-green-600' : 'text-red-600'}`}>
      Estado: {status ? 'Abierta' : 'Cerrada'}
    </p>
    <button
      onClick={() => navigate(`/vota/${id}`)}
      className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
    >
      Ver Detalles
    </button>
  </div>
);
}

export default Card