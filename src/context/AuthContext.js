import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { useClerk, useUser } from '@clerk/clerk-react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const { user: clerkUser, isSignedIn } = useUser();

    useEffect(() => {
        const token = localStorage.getItem("authToken");
        const userInfo = localStorage.getItem("userInfo");

        if (token && userInfo) {
            setUser(JSON.parse(userInfo));
        }

        // Global Clerk Sync
        const syncClerkUser = async () => {
            if (isSignedIn && clerkUser) {
                const existingToken = localStorage.getItem("authToken");

                // If we have a valid JWT (not Clerk session), just update user info
                if (existingToken && !existingToken.startsWith("CLERK_SESSION_")) {
                    console.log("🔑 Already have valid JWT token");

                    // Get existing local data to preserve fields
                    let existingUser = null;
                    try {
                        const stored = localStorage.getItem("userInfo");
                        if (stored) existingUser = JSON.parse(stored);
                    } catch (e) { }

                    const isSameUser = existingUser && (existingUser.id === clerkUser.id || existingUser.email === clerkUser.primaryEmailAddress?.emailAddress);

                    const mappedUser = {
                        id: existingUser?.id || clerkUser.id,
                        email: clerkUser.primaryEmailAddress ? clerkUser.primaryEmailAddress.emailAddress : "",
                        fullName: clerkUser.fullName,
                        firstName: clerkUser.firstName,
                        lastName: clerkUser.lastName,
                        mobileNumber: (isSameUser && existingUser.mobileNumber) ? existingUser.mobileNumber : (clerkUser.primaryPhoneNumber ? clerkUser.primaryPhoneNumber.phoneNumber : ""),
                        address: (isSameUser && existingUser.address) ? existingUser.address : "",
                        addressLine: (isSameUser && existingUser.addressLine) ? existingUser.addressLine : "",
                        city: (isSameUser && existingUser.city) ? existingUser.city : "",
                        country: (isSameUser && existingUser.country) ? existingUser.country : "Vietnam",
                        loginType: "GOOGLE"
                    };

                    if (!existingUser || JSON.stringify(existingUser) !== JSON.stringify(mappedUser)) {
                        setUser(mappedUser);
                        localStorage.setItem("userInfo", JSON.stringify(mappedUser));
                    } else if (!user) {
                        setUser(mappedUser);
                    }

                    setLoading(false);
                    return;
                }

                // Need to sync with backend to get JWT
                console.log("🔄 Syncing Clerk user with backend to get JWT...");
                try {
                    const response = await fetch(process.env.REACT_APP_API_BASE_URL + '/api/auth/google-sync', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            email: clerkUser.primaryEmailAddress?.emailAddress,
                            firstName: clerkUser.firstName || '',
                            lastName: clerkUser.lastName || ''
                        })
                    });

                    if (response.ok) {
                        const data = await response.json();
                        console.log("✅ Backend sync successful, got JWT token");

                        // Save JWT token
                        localStorage.setItem("authToken", data.token);

                        // Save user info
                        const userInfo = {
                            id: data.id,
                            email: data.email,
                            fullName: data.fullName,
                            firstName: data.firstName,
                            lastName: data.lastName,
                            mobileNumber: data.mobileNumber || '',
                            address: '',
                            city: '',
                            country: 'Vietnam',
                            loginType: 'GOOGLE'
                        };

                        localStorage.setItem("userInfo", JSON.stringify(userInfo));
                        setUser(userInfo);
                    } else {
                        console.error("❌ Failed to sync with backend:", response.status);
                    }
                } catch (error) {
                    console.error("❌ Error syncing Clerk user with backend:", error);
                }
            }

            setLoading(false);
        };

        syncClerkUser();
    }, [isSignedIn, clerkUser]);

    const login = useCallback((token, userInfo) => {
        localStorage.setItem("authToken", token);
        localStorage.setItem("userInfo", JSON.stringify(userInfo));
        setUser(userInfo);
    }, []);

    const { signOut } = useClerk();

    const logout = useCallback(async () => {
        await signOut();
        localStorage.removeItem("authToken");
        localStorage.removeItem("userInfo");
        setUser(null);
        window.location.href = "/login";
    }, [signOut]);

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
