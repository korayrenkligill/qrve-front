"use client";

import React, { useEffect, useState } from "react";
import {
  Coffee,
  Menu as MenuIcon,
  Smartphone,
  Star,
  ArrowRight,
  CheckCircle,
  Globe,
  Zap,
  CloudLightning,
  RefreshCcw,
  QrCode,
  LightbulbIcon,
} from "lucide-react";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { Avatar, Loader, Menu } from "@mantine/core";
import { Oleo_Script } from "next/font/google";
import { BusinessUserResponseType } from "@/interfaces/BusinessContainer/BusinessUser/BusinessUserResponseType";
import { businessUserApi } from "@/api/businessUserApi";
import { NormalizedToken } from "@/utils/normalizeJwt";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

const oleoScript = Oleo_Script({
  subsets: ["latin"],
  weight: ["700", "400"],
});

export default function CafeHomepage() {
  const features = [
    {
      icon: <MenuIcon className="w-8 h-8" />,
      title: "Dijital Menü",
      description: "QR kod ile müşterileriniz menünüze kolayca ulaşsın",
    },
    {
      icon: <Smartphone className="w-8 h-8" />,
      title: "Mobil Uyumlu",
      description: "Tüm cihazlarda mükemmel görünüm",
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Kendi Domaininiz",
      description: "qrve.com/markanız formatında özel URL",
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Kolay Güncelleme",
      description: "Menü değişikliklerini anında yayınlayın",
    },
    {
      icon: <CloudLightning className="w-8 h-8" />,
      title: "Yüksek Performans",
      description:
        "Son teknoloji ile geliştirilen SSR altyapısı sayesinde ışık hızında",
    },
    {
      icon: <RefreshCcw className="w-8 h-8" />,
      title: "Anlık Yenilik",
      description:
        "En güncel teknolojiler ile sürekli güncellenen yapısı sayesinde geleceğe hazır",
    },
    {
      icon: <QrCode className="w-8 h-8" />,
      title: "Hazır QR Entegrasyonu",
      description:
        "QR kodlar otomatik oluşturulur, doğrudan kullanıma hazır şekilde sunulur",
    },
    {
      icon: <LightbulbIcon className="w-8 h-8" />,
      title: "Kolay Düzenleme",
      description:
        "Menünüzü yönetim panelinden anında düzenleyin, hiçbir teknik bilgi gerekmez",
    },
  ];
  const plans = [
    {
      name: "Başlangıç",
      price: "50",
      period: "aylık",
      description: "Küçük kafeler için ideal",
      features: ["1 İşletme", "Dijital Menü", "QR Kod", "Temel Analitik"],
      popular: false,
    },
    {
      name: "Profesyonel",
      price: "200",
      period: "aylık",
      description: "Büyüyen işletmeler için",
      features: [
        "3 İşletmeye Kadar",
        "Özel Tasarım",
        "Gelişmiş Analitik",
        "Sosyal Medya Entegrasyonu",
        "Öncelikli Destek",
      ],
      popular: true,
    },
    {
      name: "Enterprise",
      price: "600",
      period: "aylık",
      description: "Zincir işletmeler için",
      features: [
        "Sınırsız İşletme",
        "API Erişimi",
        "Özel Entegrasyonlar",
        "Kişisel Hesap Yöneticisi",
        "7/24 Destek",
      ],
      popular: false,
    },
  ];
  const testimonials = [
    {
      name: "Ahmet Kaya",
      business: "Bohem Kafe",
      comment:
        "Müşteri memnuniyetimiz %40 arttı. Menü güncellemeleri artık dakikalar içinde yapılıyor!",
      rating: 5,
    },
    {
      name: "Elif Özkan",
      business: "Latte Art Studio",
      comment: "Profesyonel görünüm ve kolay kullanım. Tam aradığımız çözümdü.",
      rating: 5,
    },
    {
      name: "Murat Demir",
      business: "Corner Coffee",
      comment:
        "QR menü sayesinde siparişlerimiz %25 hızlandı. Harika bir yatırım!",
      rating: 5,
    },
  ];

  const router = useRouter();

  const [user, setUser] = useState<NormalizedToken | null>();
  const [businesses, setBusinesses] = useState<BusinessUserResponseType[]>([]);
  const [loading, setLoading] = useState(true);
  const getBusinesses = async () => {
    const response = await businessUserApi.getUserBusinesses();
    if (response.data) setBusinesses(response.data);
  };

  useEffect(() => {
    if (user) {
      getBusinesses();
    }
  }, [user]);

  useEffect(() => {
    const _user = getCurrentUser();
    setUser(_user);
    setLoading(false);
  }, []);

  if (loading)
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <Loader />
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-100">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Coffee className="w-8 h-8 text-amber-700" />
            <span className="text-2xl font-bold text-amber-900">Qrve</span>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <a
              href="#features"
              className="text-amber-800 hover:text-amber-900 transition-colors"
            >
              Özellikler
            </a>
            <a
              href="#pricing"
              className="text-amber-800 hover:text-amber-900 transition-colors"
            >
              Fiyatlar
            </a>
            {user ? (
              <Menu shadow="md" width={200}>
                <Menu.Target>
                  <div className="flex items-center gap-2 cursor-pointer">
                    <p
                      className={`${oleoScript.className} text-lg font-bold text-amber-800 hover:text-amber-900 transition-colors`}
                    >
                      {user.name}
                    </p>
                    <Avatar size="md" name={user.name} color="orange" />
                  </div>
                </Menu.Target>

                <Menu.Dropdown>
                  {businesses.length > 0 && (
                    <>
                      <Menu.Label>Yönetim</Menu.Label>
                      <Menu.Item
                        leftSection={<MenuIcon size={14} />}
                        onClick={() => router.push("/panel")}
                      >
                        Yönetim Paneli
                      </Menu.Item>
                    </>
                  )}
                  <Menu.Label>Hesap</Menu.Label>
                  <Menu.Item leftSection={<MenuIcon size={14} />}>
                    Profil
                  </Menu.Item>
                  <Menu.Item
                    color="red"
                    leftSection={<MenuIcon size={14} />}
                    onClick={() => {
                      Cookies.remove("accessToken");
                      Cookies.remove("accessTokenExpire");
                      Cookies.remove("refreshToken");
                      Cookies.remove("refreshTokenExpire");

                      setUser(null);
                      setBusinesses([]);
                    }}
                  >
                    Çıkış Yap
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            ) : (
              <Link
                href="/login"
                className="bg-amber-700 text-white px-6 py-2 rounded-lg hover:bg-amber-800 transition-colors"
              >
                Giriş Yap
              </Link>
            )}
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold text-amber-900 mb-6">
            Kafeninizi
            <span className="block text-gradient bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
              Dijitale Taşı
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-amber-800 mb-8 leading-relaxed">
            QR kodlu dijital menü ile müşteri deneyimini geliştir, siparişleri
            hızlandır ve işletmeni modernleştir.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="cursor-pointer bg-gradient-to-r from-amber-600 to-orange-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-amber-700 hover:to-orange-700 transition-all transform hover:scale-105 shadow-lg">
              Ücretsiz Dene
              <ArrowRight className="w-5 h-5 ml-2 inline" />
            </button>
            <Link
              href="/pause"
              className="border-2 border-amber-700 text-amber-700 px-7 py-3 rounded-xl font-semibold hover:bg-amber-700 hover:text-white transition-all"
            >
              Demo Menü
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-amber-900 mb-4">
              Neden Qrve?
            </h2>
            <p className="text-xl text-amber-700 max-w-2xl mx-auto">
              Modern kafenizin ihtiyaç duyduğu tüm dijital çözümler bir arada
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-2"
              >
                <div className="text-amber-600 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-amber-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-amber-700">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-amber-900 mb-4">
              Size Uygun Planı Seçin
            </h2>
            <p className="text-xl text-amber-700">
              Her büyüklükteki işletme için esnek fiyatlandırma
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`relative bg-white rounded-2xl shadow-xl p-8 ${
                  plan.popular ? "ring-4 ring-amber-400 scale-105" : ""
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-2 rounded-full text-sm font-semibold">
                      En Popüler
                    </span>
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-amber-900 mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-amber-700 mb-4">{plan.description}</p>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold text-amber-900">
                      ₺{plan.price}
                    </span>
                    <span className="text-amber-700">/{plan.period}</span>
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-amber-800">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  className={`w-full py-4 rounded-xl font-semibold transition-all ${
                    plan.popular
                      ? "bg-gradient-to-r from-amber-600 to-orange-600 text-white hover:from-amber-700 hover:to-orange-700"
                      : "border-2 border-amber-600 text-amber-600 hover:bg-amber-600 hover:text-white"
                  }`}
                >
                  Başla
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-white/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-amber-900 mb-4">
              Müşterilerimiz Ne Diyor?
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
                <p className="text-amber-800 mb-6 italic">
                  &quot;{testimonial.comment}&quot;
                </p>
                <div>
                  <div className="font-semibold text-amber-900">
                    {testimonial.name}
                  </div>
                  <div className="text-amber-700 text-sm">
                    {testimonial.business}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-amber-600 to-orange-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Hazır mısın?
          </h2>
          <p className="text-xl text-amber-100 mb-8 max-w-2xl mx-auto">
            Kafeninizi dijital dünyaya taşıyarak müşteri deneyimini geliştir.
            Ücretsiz deneme ile başla!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-amber-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-amber-50 transition-all transform hover:scale-105">
              Ücretsiz Başla
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-white hover:text-amber-600 transition-all">
              İletişime Geç
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-amber-900 text-amber-100 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Coffee className="w-6 h-6" />
                <span className="text-xl font-bold">Qrve</span>
              </div>
              <p className="text-amber-200">
                Kafenizi dijital dünyaya taşıyoruz
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Ürün</h4>
              <ul className="space-y-2 text-amber-200">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Özellikler
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Fiyatlar
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Demo
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Destek</h4>
              <ul className="space-y-2 text-amber-200">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    İletişim
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Rehberler
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Şirket</h4>
              <ul className="space-y-2 text-amber-200">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Hakkımızda
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Hizmetler
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Ürünler
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-amber-800 mt-8 pt-8 text-center text-amber-200">
            <p>&copy; 2025 Qrve. Tüm hakları saklıdır.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
