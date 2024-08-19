"use client"

import React, { useEffect, useState } from 'react';
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTrigger } from "./ui/sheet";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { db } from '../app/firebase';
import { setDoc, doc } from 'firebase/firestore';
import Link from 'next/link';
import { auth } from '../app/firebase';
import { rdb } from '../app/firebase';
import { remove, ref } from 'firebase/database';

export const Navbar = () => {
    const { setTheme, resolvedTheme } = useTheme();
    const [loggedInUser, setLoggedInUser] = useState(null);
    const [mounted, setMounted] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        setMounted(true);

        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setLoggedInUser(user);
            } else {
                setLoggedInUser(null);
            }
        });

        return () => unsubscribe();
    }, []);

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    const signInWithGoogle = async () => {
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);

            const user = auth.currentUser;
            const userDocRef = doc(db, 'users', user.uid);

            const userData = {
                uid: user.uid,
                displayName: user.displayName,
                email: user.email,
                photoURL: user.photoURL,
                customInstructions: ""
            };

            await setDoc(userDocRef, userData);
            
            window.location.reload();
        } catch (error) {
            console.error('Error during sign-in:', error);
        }
    };

    const signOutWithGoogle = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error('Error during sign-out:', error);
        }
    };

    const handleClearHistory = () => {
        if (loggedInUser) {
            const dbRef = ref(rdb, `messages/${loggedInUser.uid}`);
            remove(dbRef)
                .then(() => {
                    console.log('Chat history cleared successfully!');
                    window.location.reload();
                })
                .catch((error) => {
                    console.error('Error clearing chat history:', error);
                }
            );
        }
        else{
            window.location.reload();
        }

    };


    // Ensure the theme is resolved before rendering theme-dependent components
    if (!mounted) return null;

    return (
        <nav className="backdrop-blur-sm h-[10%] text-primary sticky top-0 z-30">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <a href={'/'} className="text-2xl font-bold">MoodSmith</a>
                
                {/* Desktop Menu */}
                <div className="hidden md:flex md:justify-center md:items-center space-x-6">
                    <a href="/" className="hover:text-muted-foreground">Home</a>
                    <Link href="/letmepredict" className="hover:text-muted-foreground">Game</Link>
                    <p className="cursor-pointer hover:underline text-red-500" onClick={handleClearHistory}>Clear History</p>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                                <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                                <span className="sr-only">Toggle theme</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setTheme("light")}>
                                Light
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setTheme("dark")}>
                                Dark
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setTheme("system")}>
                                System
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <div
                        className="flex cursor-pointer hover:underline"
                        onClick={loggedInUser ? signOutWithGoogle : signInWithGoogle}
                    >
                        {resolvedTheme === 'dark' ? (
                            <img src={'/person-white.png'} alt='login-icon' className='bg-transparent h-6 mr-0.5 pb-1 w-6 object-contain'/>
                        ) : (
                            <img src={'/person.png'} alt='login-icon' className='h-6 mr-0.5 pb-1 w-6 object-contain'/>
                        )}
                        <p className="flex h-full">
                            {loggedInUser ? "Logout" : "Login"}
                        </p>
                    </div>
                </div>

                {/* Mobile Menu Button */}
                <div className="md:hidden">
                    <Sheet open={mobileMenuOpen} onOpenChange={toggleMobileMenu}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" aria-label="Open Menu">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
                                </svg>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right">
                            <SheetHeader>
                                <div className="flex flex-col items-center space-y-4 mt-10">
                                    <a href="/" className="hover:text-muted-foreground w-full border-b border-primary pb-2">Home</a>
                                    <Link href="/letmepredict" className="hover:text-muted-foreground border-b border-primary pb-2 w-full">Game</Link>
                                    <div className="flex w-full justify-between pb-2 border-b border-primary">
                                        <Button onClick={() => setTheme("light")} className="text-sm border-r border-primary w-full" variant="ghost">Light</Button>
                                        <Button onClick={() => setTheme("dark")} className="text-sm border-x border-primary w-full" variant="ghost">Dark</Button>
                                        <Button onClick={() => setTheme("system")} className="text-sm w-full border-l border-primary" variant="ghost">System</Button>
                                    </div>
                                    {/* Login Button */}
                                    <div
                                        className="flex cursor-pointer hover:underline"
                                        onClick={loggedInUser ? signOutWithGoogle : signInWithGoogle}
                                    >
                                        {resolvedTheme === 'dark' ? (
                                            <img src={'/person-white.png'} alt='login-icon' className='bg-transparent h-6 mr-0.5 pb-1 w-6 object-contain'/>
                                        ) : (
                                            <img src={'/person.png'} alt='login-icon' className='h-6 mr-0.5 pb-1 w-6 object-contain'/>
                                        )}
                                        <p className="flex h-full">
                                            {loggedInUser ? "Logout" : "Login"}
                                        </p>
                                    </div>
                                </div>
                            </SheetHeader>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </nav>
    );
};
