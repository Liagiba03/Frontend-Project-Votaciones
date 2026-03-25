const URL = import.meta.env.VITE_API_PROP;

const voted = async (propuesta: string, member: string, token:string) => {
    return await fetch(URL + '/voted', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ propuesta, member })
    });
}

export default voted;