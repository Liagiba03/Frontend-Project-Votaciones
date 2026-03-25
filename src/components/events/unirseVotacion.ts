const URL = import.meta.env.VITE_API_PROP;

const unirseVotacion = async (user: string, member: string, token: string) => {
    return await fetch(URL+'/propuesta/unirse',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({user, member})
    })
}

export default unirseVotacion;