"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, Lock, Mail, X } from "lucide-react";
import { LoginType } from "@/interfaces/UserContainer/Auth/LoginType";
import { ValidationErrors } from "@/interfaces/component/auth/ValidationTypes";
import { loginFormAtom } from "@/store/component/loginRegisterStore";
import { useAtom } from "jotai";
import { authApi } from "@/api/authApi";

type Props = {};

const LoginForm = (props: Props) => {
  const [loginForm, setLoginForm] = useAtom<LoginType>(loginFormAtom);

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const validateEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (): Promise<void> => {
    setIsLoading(true);
    setErrors({});

    const newErrors: ValidationErrors = {};
    if (!loginForm.email) newErrors.email = "E-posta adresi gerekli";
    else if (!validateEmail(loginForm.email))
      newErrors.email = "Geçerli bir e-posta adresi girin";
    if (!loginForm.password) newErrors.password = "Şifre gerekli";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    await authApi.login(loginForm).finally(() => setIsLoading(false));
  };
  return (
    <motion.div
      key={"login"}
      initial={{ opacity: 0, x: -100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className="w-full flex-shrink-0"
    >
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-amber-900 mb-6">
          Tekrar Hoş Geldin!
        </h2>

        <div>
          <label className="block text-amber-800 font-medium mb-2">
            E-posta Adresi
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-amber-600" />
            <input
              type="email"
              value={loginForm.email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setLoginForm({
                  ...loginForm,
                  email: e.target.value,
                })
              }
              className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                errors.email
                  ? "border-red-300 focus:ring-red-200"
                  : "border-amber-200 focus:ring-amber-200 focus:border-amber-400"
              }`}
              placeholder="ornek@email.com"
            />
          </div>
          {errors.email && (
            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
              <X className="w-4 h-4" />
              {errors.email}
            </p>
          )}
        </div>

        <div>
          <label className="block text-amber-800 font-medium mb-2">Şifre</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-amber-600" />
            <input
              type={showPassword ? "text" : "password"}
              value={loginForm.password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setLoginForm({
                  ...loginForm,
                  password: e.target.value,
                })
              }
              className={`w-full pl-12 pr-12 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                errors.password
                  ? "border-red-300 focus:ring-red-200"
                  : "border-amber-200 focus:ring-amber-200 focus:border-amber-400"
              }`}
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-amber-600 hover:text-amber-700"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
              <X className="w-4 h-4" />
              {errors.password}
            </p>
          )}
        </div>

        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-amber-600 to-orange-600 text-white py-3 rounded-xl font-semibold hover:from-amber-700 hover:to-orange-700 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Giriş Yapılıyor...
            </div>
          ) : (
            "Giriş Yap"
          )}
        </button>
      </div>
    </motion.div>
  );
};

export default LoginForm;
