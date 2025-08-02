"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Check, Eye, EyeOff, Lock, Mail, User, X } from "lucide-react";
import { RegisterType } from "@/interfaces/UserContainer/Auth/RegisterType";
import { useAtom } from "jotai";
import { registerFormAtom } from "@/store/component/loginRegisterStore";
import {
  PasswordValidation,
  ValidationErrors,
} from "@/interfaces/component/auth/ValidationTypes";

type Props = {};

const RegisterForm = (props: Props) => {
  const [registerForm, setRegisterForm] =
    useAtom<RegisterType>(registerFormAtom);

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const validatePassword = (password: string): PasswordValidation => {
    const minLength = password.length >= 8;
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /\d/.test(password);

    return {
      minLength,
      hasLetter,
      hasNumber,
      isValid: minLength && hasLetter && hasNumber,
    };
  };

  const passwordValidation: PasswordValidation = validatePassword(
    registerForm.password
  );

  const validateEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (): Promise<void> => {
    setIsLoading(true);
    setErrors({});

    const newErrors: ValidationErrors = {};
    if (!registerForm.fullName) newErrors.fullName = "Ad Soyad gerekli";
    if (!registerForm.email) newErrors.email = "E-posta adresi gerekli";
    else if (!validateEmail(registerForm.email))
      newErrors.email = "Geçerli bir e-posta adresi girin";
    if (!registerForm.password) newErrors.password = "Şifre gerekli";
    else if (!passwordValidation.isValid)
      newErrors.password = "Şifre gereksinimleri karşılanmıyor";
    if (!registerForm.passwordConfirm)
      newErrors.passwordConfirm = "Şifre tekrarı gerekli";
    else if (registerForm.password !== registerForm.passwordConfirm)
      newErrors.passwordConfirm = "Şifreler eşleşmiyor";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  };

  return (
    <motion.div
      key={"register"}
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      className="w-full flex-shrink-0"
    >
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-amber-900 mb-6">
          Hesap Oluştur
        </h2>

        {/* Full Name */}
        <div>
          <label className="block text-amber-800 font-medium mb-2">
            Ad Soyad
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-amber-600" />
            <input
              type="text"
              value={registerForm.fullName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setRegisterForm({
                  ...registerForm,
                  fullName: e.target.value,
                })
              }
              className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                errors.fullName
                  ? "border-red-300 focus:ring-red-200"
                  : "border-amber-200 focus:ring-amber-200 focus:border-amber-400"
              }`}
              placeholder="Adınız Soyadınız"
            />
          </div>
          {errors.fullName && (
            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
              <X className="w-4 h-4" />
              {errors.fullName}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-amber-800 font-medium mb-2">
            E-posta Adresi
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-amber-600" />
            <input
              type="email"
              value={registerForm.email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setRegisterForm({
                  ...registerForm,
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

        {/* Password */}
        <div>
          <label className="block text-amber-800 font-medium mb-2">Şifre</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-amber-600" />
            <input
              type={showPassword ? "text" : "password"}
              value={registerForm.password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setRegisterForm({
                  ...registerForm,
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

          {/* Password Requirements */}
          {registerForm.password && (
            <div className="mt-2 space-y-1">
              <div
                className={`flex items-center gap-2 text-sm ${
                  passwordValidation.minLength
                    ? "text-green-600"
                    : "text-red-500"
                }`}
              >
                {passwordValidation.minLength ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <X className="w-4 h-4" />
                )}
                En az 8 karakter
              </div>
              <div
                className={`flex items-center gap-2 text-sm ${
                  passwordValidation.hasLetter
                    ? "text-green-600"
                    : "text-red-500"
                }`}
              >
                {passwordValidation.hasLetter ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <X className="w-4 h-4" />
                )}
                En az 1 harf
              </div>
              <div
                className={`flex items-center gap-2 text-sm ${
                  passwordValidation.hasNumber
                    ? "text-green-600"
                    : "text-red-500"
                }`}
              >
                {passwordValidation.hasNumber ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <X className="w-4 h-4" />
                )}
                En az 1 sayı
              </div>
            </div>
          )}

          {errors.password && (
            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
              <X className="w-4 h-4" />
              {errors.password}
            </p>
          )}
        </div>

        {/* Password Confirm */}
        <div>
          <label className="block text-amber-800 font-medium mb-2">
            Şifre Tekrar
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-amber-600" />
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={registerForm.passwordConfirm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setRegisterForm({
                  ...registerForm,
                  passwordConfirm: e.target.value,
                })
              }
              className={`w-full pl-12 pr-12 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                errors.passwordConfirm
                  ? "border-red-300 focus:ring-red-200"
                  : "border-amber-200 focus:ring-amber-200 focus:border-amber-400"
              }`}
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-amber-600 hover:text-amber-700"
            >
              {showConfirmPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
          {errors.passwordConfirm && (
            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
              <X className="w-4 h-4" />
              {errors.passwordConfirm}
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
              Hesap Oluşturuluyor...
            </div>
          ) : (
            "Hesap Oluştur"
          )}
        </button>
      </div>
    </motion.div>
  );
};

export default RegisterForm;
