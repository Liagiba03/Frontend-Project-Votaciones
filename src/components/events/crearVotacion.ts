
const URL_VOTO = import.meta.env.VITE_API_PROP;


const crearVotacion = async (data:any, token: string) =>{
    return await fetch(URL_VOTO+"/propuesta",{
        method: 'POST',
        headers:{
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(data)
    })
}

export default crearVotacion;