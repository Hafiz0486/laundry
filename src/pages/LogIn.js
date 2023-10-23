import React, { useEffect, useState } from 'react';
import supabase from '../config/supabaseClient';

export default function LogIn() {
    const login = async () => {
        await supabase.auth.signIn({
            provider: "google",
        });
    }

    useEffect(() => {
        const session = supabase.auth.session();
        console.log(session)
    }, [])

    return (
        <div className="container">
            <div className="form-container">
                <button onClick={login}>Login With Google</button>
            </div>
        </div>
      );
}


