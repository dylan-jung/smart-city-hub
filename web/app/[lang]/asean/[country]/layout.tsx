import Image from "next/image";
import Link from "next/link";

import Container from "@components/container";
import { initTranslation } from "@locales";
import { Locale } from "core/model";

import { repo } from "@/di";
import { aseanFlags } from "@resources/images/asean-flags";
import { getPageCoverImage } from "@resources/images/page-covers";

function toLocale(lang: string): Locale {
  if (lang === "ko" || lang === "en") return lang as Locale;
  throw new Error("Invalid language");
}

export default async function Layout(
  props: {
    children: React.ReactNode;
    params: Promise<{ lang: string; country: string }>;
  }
) {
  const params = await props.params;

  const {
    children
  } = props;

  const { lang, country } = params;
  const locale = toLocale(lang);

  const { t } = await initTranslation(locale);

  return (
    <>
      <header className="relative h-48 md:h-72 border-b">
        <Image
          className="w-full h-full object-cover"
          src={getPageCoverImage("asean")}
          alt="Page Cover Image"
          height={288}
        />
        <div className="flex flex-col items-center justify-center absolute top-0 left-0 w-full h-full text-white bg-uos-gray/50">
          <h1 className="font-bold text-4xl md:text-6xl">{t("아세안 국가 정보")}</h1>
          <h2 className="font-medium text-2xl mt-3">{t("스마트시티 네트워크")}</h2>
        </div>
      </header>
      <Container className="mt-6 grid gap-2 grid-cols-2 lg:grid-cols-5">
        {repo.aseanBanner.getItemAll(lang).map((item, idx) => (
          <Link
            href={`/asean/${item.id}`}
            key={idx}
            className={`flex items-center px-3 py-1.5 hover:bg-slate-100 rounded transition ${
              country === item.id ? "bg-slate-100 ring-2 ring-slate-300" : ""
            }`}
          >
            <Image
              src={aseanFlags[item.id]}
              alt={item.countryName}
              width={48}
              height={48}
              className="rounded-full border w-12"
            />
            <div className="ml-3">
              <h3 className="font-bold">{item.countryName}</h3>
              {item.description.map((desc, idx) => (
                <p key={idx} className="text-xs">
                  {desc}
                </p>
              ))}
            </div>
          </Link>
        ))}
      </Container>
      <Container className="mt-8">{children}</Container>
    </>
  );
}
