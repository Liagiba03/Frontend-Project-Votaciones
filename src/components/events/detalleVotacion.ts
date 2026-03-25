const URL = import.meta.env.VITE_API_PROP;

const detalleVotacion = async (propuesta: string, token:string) => {
    return await fetch(URL+`/propuesta/${propuesta}`,{
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        }
    })
}

export default detalleVotacion;