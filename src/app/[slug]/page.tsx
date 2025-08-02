import { getBusinessTypeImage } from "@/components/business/BackgroundImage";
import { notFound } from "next/navigation";
import { Oleo_Script } from "next/font/google";
import BusinessMenuAccordion from "@/components/business/BusinessMenuAccordion";
import { BusinessResponseType } from "@/interfaces/BusinessContainer/Business/BusinessResponseType";
import { ApiResponseType } from "@/interfaces/ResponseType";

const oleoScript = Oleo_Script({
  subsets: ["latin"],
  weight: ["700", "400"],
});

async function getBusinessData(
  slug: string
): Promise<BusinessResponseType | null> {
  try {
    const res = await fetch(
      `https://localhost:44327/api/Business/by-slug?slug=${slug}`,
      {
        cache: "no-store",
        headers: {
          Accept: "application/json",
        },
      }
    );

    if (!res.ok) {
      console.error(`API Error: ${res.status} ${res.statusText}`);
      return null;
    }

    const data: ApiResponseType<BusinessResponseType> = await res.json();

    if (data.isSuccess && data.data) {
      return data.data;
    }

    return null;
  } catch (error) {
    console.error("API çağrısında hata:", error);
    return null;
  }
}

interface PageProps {
  params: {
    slug: string;
  };
}

export default async function MenuPage(props: PageProps) {
  const { slug } = await props.params; // ✅ await ile çözüm
  const businessData = await getBusinessData(slug);

  if (!businessData) {
    notFound();
  }

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundImage: `url(${getBusinessTypeImage(businessData.type)})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="container mx-auto p-4 bg-[#fff8e3]">
        <header className="flex flex-col md:flex-row items-center gap-4 pb-6">
          {businessData.logoUrl && (
            <img
              src={businessData.logoUrl}
              alt="logo"
              className="w-40 h-40 rounded-2xl"
            />
          )}
          <div className="flex flex-col items-center md:items-start">
            <h1 className={`${oleoScript.className} text-5xl text-yellow-950`}>
              {businessData.name}
            </h1>
            <p className="text-yellow-900 text-lg md:text-xl">
              {businessData.description}
            </p>
          </div>
        </header>
        <main className="flex flex-col">
          <BusinessMenuAccordion categories={businessData.categories} />
        </main>
      </div>
    </div>
  );
}

export async function generateMetadata(props: PageProps) {
  const { slug } = await props.params; // ✅ await ile çözüm
  const businessData = await getBusinessData(slug);

  if (!businessData) {
    return {
      title: "İşletme Bulunamadı",
      description: "Aradığınız işletme bulunamadı.",
    };
  }

  return {
    title: `${businessData.name} - Menü`,
    description:
      businessData.description !== "string"
        ? businessData.description
        : `${businessData.name} menüsünü keşfedin ve lezzetli yemekleri inceleyin.`,
    openGraph: {
      title: `${businessData.name} - Menü`,
      description:
        businessData.description !== "string"
          ? businessData.description
          : `${businessData.name} menüsünü keşfedin.`,
      images: businessData.logoUrl !== "string" ? [businessData.logoUrl] : [],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${businessData.name} - Menü`,
      description:
        businessData.description !== "string"
          ? businessData.description
          : `${businessData.name} menüsünü keşfedin.`,
    },
  };
}
