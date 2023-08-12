'use client'

import Image from "next/image";
import styles from "./navbar.module.css";
import Link from "next/link";
import SignIn from "./sign-in";

import { onAuthStateChangedHelper } from "../firebase/firebase";
import { useEffect, useState } from "react";
import { User } from "firebase/auth";
import Upload from "./upload";

export default function Navbar() {

    const [user, setUser] = useState<User | null>(null);
    
    useEffect(() => {
        const unsubscribe = onAuthStateChangedHelper((user) => {
            setUser(user);
        });

        return () => unsubscribe();
    });

    return(
        <div>
            <></>
            <nav className = {styles.nav}>
                <Link href="/" className = {styles.logoContainer}>
                        <Image className = {styles.logo} width={90} height={90}
                            src = "/icon.png" alt ="VideoMe logo"/>
                </Link>
                {
                    user && <Upload/>
                }
                <SignIn user = {user}/>
            </nav>
        </div>
    );
}