"use client";

import { signOut } from "next-auth/react";

export default function ButtonLogout() {
    const handleLogout = () => {
        signOut({ callbackUrl: "/login" });
    };

    return (
        <button
            onClick={handleLogout}
            style={{
                padding: "10px 20px",
                backgroundColor: "#0070f3",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
            }}
        >
            Logout
        </button>
    );
}