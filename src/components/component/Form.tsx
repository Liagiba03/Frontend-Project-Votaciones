import { useState } from "react"
import register from "../events/register";
import login from "../events/login";
import toast from "react-hot-toast";
import useAuth from '../hooks/useAuth';
import { useNavigate } from "react-router-dom";


const Form = () => {
    const [isRegistrer, setIsRegistrer] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { saveAuthData } = useAuth();
    const navigate = useNavigate();

    const handlerForm = async (e: any) => {
        e.preventDefault();
        try {
            let response = isRegistrer ? await register(username, password) : await login(username, password);
            const data = await response.json();
            const token = data.token;
            //console.log(data.user)
            const userId = data.user?._id;
            
            if (response.status === 200) {
                if (!isRegistrer) {
                    //console.log(userId)
                    //console.log('entrada a false isregister')
                    saveAuthData(token, username, userId);
                    toast.success('Ingreso correcto!');
                    navigate("/menu"); // Redirigir al menú
                } else {
                    toast.success('Registro correcto!');
                    setIsRegistrer(false);
                }
            } else if(response.status===404) {
                !isRegistrer?toast.error('Usuario no encontrado'):'';
            }else if(response.status === 401) {
                toast.error('Contraseña incorrecta');
            }else if(response.status === 409) {
                toast.error('El usuario ya existe');
            }
            
            else {
                toast.error(data.message || 'Acceso incorrecto2')
                console.log(data.message)
            }
        }
        catch (error: any) {
            toast.error(error.message || 'Acceso incorrecto')
            console.log(error.message)
        }
    }
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
          <form
            onSubmit={handlerForm}
            className="w-full max-w-md bg-white p-6 rounded-lg shadow-md"
          >
            <h1 className="text-2xl font-bold text-center mb-6">
              {isRegistrer ? "Registrar Usuario" : "Iniciar Sesión"}
            </h1>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                type="text"
                name="email"
                id="email"
                required
                placeholder="user@example.com"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                }}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div className="mb-6">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                required
                placeholder="xxxxx"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              {isRegistrer ? "Registrar" : "Enviar"}
            </button>
            <p className="mt-4 text-center text-sm text-gray-600">
              {isRegistrer ? "Ya" : "Aún no"} tienes cuenta?{" "}
              <span
                onClick={() => setIsRegistrer(!isRegistrer)}
                className="text-indigo-600 hover:underline cursor-pointer"
              >
                {isRegistrer ? " Inicia Sesión" : " Registrate"}
              </span>
            </p>
          </form>
        </div>
      );
}

export default Form