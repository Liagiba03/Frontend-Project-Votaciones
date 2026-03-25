const URL = import.meta.env.VITE_API_PROP;

const votar = async (propuesta: string, member: string, opcion: string, token: string) => {
    return await fetch(URL + '/votar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ propuesta, member , opcion })
    });
}

export default votar;