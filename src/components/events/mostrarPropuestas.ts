const URL_API = import.meta.env.VITE_API_PROP;


const mostrarPropuestas = async (id:string, token: string) => {

    return await fetch(URL_API+'/propuestas/member/'+id,{
        method: 'GET',
        headers: {
            "Content-Type": "application/json",

            "Authorization": `Bearer ${token}`,
        }
    })
}

export default mostrarPropuestas;