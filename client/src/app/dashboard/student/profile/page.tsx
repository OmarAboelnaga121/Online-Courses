"use client"

import LoadingSpinner from "@/app/components/ui/LoadingSpinner";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";

export default function Profile() {
     // Variables
    const [loading, setLoading] = useState(false);
    const { userProfile, isLoggedIn, loading: authLoading } = useAuth();
    const [courses, setCourses] = useState([]);

    
    if(authLoading || loading) {
        return <LoadingSpinner />;
    }
}