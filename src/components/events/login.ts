
const URL_LOGIN = import.meta.env.VITE_API_AUTH;


const login = async (username:string, password: string) =>{
    return await fetch(URL_LOGIN+"/login",{
        method: 'POST',
        headers:{
            "Content-Type": "application/json",
        },
        body: JSON.stringify({username, password})
    })
}

export default login;