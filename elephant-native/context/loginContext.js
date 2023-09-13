import { createContext, useState } from "react"

const LoginContext = createContext()

const LoginContextProvider = ({children}) => {

    const [loggedIn, setLoggedIn] = useState(false)

    return (
        <LoginContext.Provider value={{loggedIn, setLoggedIn}}>
            {children}
        </LoginContext.Provider>
    )
}

export {LoginContext, LoginContextProvider}