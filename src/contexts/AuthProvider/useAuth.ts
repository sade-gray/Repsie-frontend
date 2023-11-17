import {useContext} from "react";
import {AuthContextValues} from "./authTypes";
import {AuthContext} from "./AuthProvider.tsx";

export default function useAuth() {
    return useContext<AuthContextValues>(AuthContext);
}
