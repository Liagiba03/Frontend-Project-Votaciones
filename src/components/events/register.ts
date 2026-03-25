const URL_REGISTRER = import.meta.env.VITE_API_AUTH;

const register = async (username:string, password: string) => {
    //console.log(username, password);
    return await fetch(URL_REGISTRER+'/create-user', {
        method: 'POST',
        headers:{
            "Content-Type": 'application/json',
        },
        body: JSON.stringify({username, password})
    })
}

export default register;