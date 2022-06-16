//firebase
import { db } from '../firebase/Config'
import { async } from '@firebase/util'
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    updateProfile,
    signOut
} from 'firebase/auth'

//hooks
import { useState, useEffect } from 'react'

export const useAuthenticantion = () => {
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(null)

    //cleanup
    //deal with memory leak - limpando memória desperdiçada

    const [cancelled, setCancelled] = useState(false)

    const auth = getAuth()

    function checkIfIsCancelled() {
        if(cancelled) {
            return;
        }
    }

    const createUser = async(data) => {
        checkIfIsCancelled();

        setLoading(true)
        setError(null)

        try{

            const{user} = await createUserWithEmailAndPassword(
                auth,
                data.email,
                data.password
            )
            await updateProfile(user, {
                displayName: data.displayName
            })
// O estado do loading precisa mudar antes do retorno do usuario
            setLoading(false);

            return user;
            
        } catch ( error ) {

            let systemErrorMessage;

            if(error.message.includes("Password")){
                systemErrorMessage = "A senha precisa conter pelo menos 6 caracteres.";
            } else if (error.message.includes("email-already")) {
                systemErrorMessage = "E-mail já cadastrado.";
            } else if (error.message.includes("INVALID_EMAIL")) {
                systemErrorMessage = "E-mail inválido.";
            } else {
                systemErrorMessage = "Ocorreu um erro, por favor tente mais tarde.";
            }

            setLoading(false);
            setError(systemErrorMessage);
        }

    };

    useEffect(() => {
        return () => setCancelled(true);
    }, []);

  return {
    auth,
    createUser,
    error,
    loading
  }
}