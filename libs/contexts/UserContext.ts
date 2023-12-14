import { createContext } from "react";
import { User } from "../../domain/Users";

export default createContext<User>({username:'',bio:''});