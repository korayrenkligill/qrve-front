"use client";

import React, { useState } from "react";
import { Coffee, ArrowLeft } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { useSetAtom } from "jotai";
import {
  loginFormAtom,
  registerFormAtom,
} from "@/store/component/loginRegisterStore";

import LoginForm from "./login/LoginForm";
import RegisterForm from "./login/RegisterForm";

export default function LoginRegisterPage(): React.ReactNode {
  const [isLogin, setIsLogin] = useState<boolean>(true);

  const setRegisterForm = useSetAtom(registerFormAtom);
  const setLoginForm = useSetAtom(loginFormAtom);

  const switchMode = (): void => {
    setIsLogin(!isLogin);
    setLoginForm({ email: "", password: "" });
    setRegisterForm({
      fullName: "",
      email: "",
      password: "",
      passwordConfirm: "",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-100 flex items-center justify-center p-4">
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d97706' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 text-amber-700 hover:text-amber-800 transition-colors mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            Ana Sayfaya Dön
          </button>

          <div className="flex items-center justify-center gap-2 mb-6">
            <Coffee className="w-8 h-8 text-amber-700" />
            <span className="text-2xl font-bold text-amber-900">MenuCafe</span>
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-white/20">
          {/* Tab Switcher */}
          <div className="flex bg-amber-100 rounded-xl p-1 mb-8">
            <button
              onClick={() => isLogin || switchMode()}
              className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-300 ${
                isLogin
                  ? "bg-white text-amber-900 shadow-sm"
                  : "text-amber-700 hover:text-amber-900"
              }`}
            >
              Giriş Yap
            </button>
            <button
              onClick={() => !isLogin || switchMode()}
              className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-300 ${
                !isLogin
                  ? "bg-white text-amber-900 shadow-sm"
                  : "text-amber-700 hover:text-amber-900"
              }`}
            >
              Kayıt Ol
            </button>
          </div>

          {/* Form */}
          <div className="overflow-hidden">
            <div className="flex transition-all duration-300">
              <AnimatePresence mode="wait">
                {isLogin ? <LoginForm /> : <RegisterForm />}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Additional Links */}
        <div className="text-center mt-6 text-amber-700">
          <a href="#" className="hover:text-amber-800 transition-colors">
            Şifremi Unuttum
          </a>
        </div>
      </div>
    </div>
  );
}
