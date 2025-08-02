import { atom } from "jotai";
import { LoginType } from "@/interfaces/UserContainer/Auth/LoginType";
import { RegisterType } from "@/interfaces/UserContainer/Auth/RegisterType";

export const loginFormAtom = atom<LoginType>({ email: "", password: "" });
export const registerFormAtom = atom<RegisterType>({
  fullName: "",
  email: "",
  password: "",
  passwordConfirm: "",
});
