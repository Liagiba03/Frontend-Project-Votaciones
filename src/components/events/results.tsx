const URL = import.meta.env.VITE_API_PROP;

const results = async (idPropuesta: string, token: string) => {
    return await fetch(URL+'/results/'+idPropuesta,{
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${token}`,
        }
    })
}

export default results;