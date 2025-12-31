import Container from "@components/container";
import { SecretButton } from "@components/secret-components";
import { initTranslation } from "@locales";
import { Locale } from "core/model";

type Props = {
  params: Promise<{
    lang: string;
    companyId: string;
    solutionId: string;
  }>;
};

export default async function SolutionDetailPage(props: Props) {
  const params = await props.params;
  const lang = params.lang as Locale;
  const { t } = await initTranslation(lang);

  // Hardcoded data for UI demo as requested
  const company = {
    "companyId": 68,
    "name": "(주)케이티",
    "nameEng": "KT",
    "ceo": "황창규",
    "address": "경기도 성남시 분당구 불정로 90",
    "tel": "010-6733-8265",
    "fax": "-",
    "website": "http://www.kt.com"
  };

  const solution = {
    "solutionId": 353,
    "companyId": 68,
    "title": "기가센싱",
    "mainCategoryId": 0,
    "subCategoryId": 1,
    "summary": "기가센싱은 KT 플랫폼 기반의 센서/제어 서비스로, 시설물의 상태 및 제어를 제공하는 서비스입니다.",
    "abstract": "기가센싱은 자동제어 국제 표준 기반의 센서/제어 서비스로, KT 플랫폼 기반으로 시설물의 상태 및 제어를 제공합니다.",
    "feature": "기가센싱의 특징은 표준 프로토콜 기반으로 확장/대체/통합이 용이한 H/W 구성, 이용자용 관제 환경(웹, 문자 알람) 제공과 함께 전문 유인관제 동시 제공입니다. 또한, 주요 키워드는 전문 관제 서비스, 확장성, 개방성입니다.",
    "composition": "기가센싱의 H/W 구성은 KNX 기반 컨트롤러 및 표준 프로토콜 기반 센서/제어입니다. S/W 구성은 이용자 전용 관제(웹/알람시스템) 및 전문 관제 S/W입니다."
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <Container>
        {/* Card Container */}
        <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
          
          {/* Company Section */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">{company.name}</h1>
            
            <div className="flex flex-wrap gap-y-2 gap-x-4 text-sm">
              <div className="flex items-center">
                <span className="bg-gray-100 text-gray-600 font-semibold px-2 py-1 rounded-l-md border border-r-0 border-gray-200">
                  {t("대표")}
                </span>
                <span className="bg-white text-gray-800 px-3 py-1 rounded-r-md border border-gray-200">
                  {company.ceo}
                </span>
              </div>

              <div className="flex items-center">
                <span className="bg-gray-100 text-gray-600 font-semibold px-2 py-1 rounded-l-md border border-r-0 border-gray-200">
                  {t("주소")}
                </span>
                <span className="bg-white text-gray-800 px-3 py-1 rounded-r-md border border-gray-200">
                  {company.address}
                </span>
              </div>

              <div className="flex items-center">
                <span className="bg-gray-100 text-gray-600 font-semibold px-2 py-1 rounded-l-md border border-r-0 border-gray-200">
                  {t("전화")}
                </span>
                <span className="bg-white text-gray-800 px-3 py-1 rounded-r-md border border-gray-200">
                  {company.tel}
                </span>
              </div>

              <div className="flex items-center">
                <span className="bg-gray-100 text-gray-600 font-semibold px-2 py-1 rounded-l-md border border-r-0 border-gray-200">
                  {t("팩스")}
                </span>
                <span className="bg-white text-gray-800 px-3 py-1 rounded-r-md border border-gray-200">
                  {company.fax}
                </span>
              </div>

              <div className="flex items-center">
                <span className="bg-gray-100 text-gray-600 font-semibold px-2 py-1 rounded-l-md border border-r-0 border-gray-200">
                  {t("웹사이트")}
                </span>
                <span className="bg-white text-gray-800 px-3 py-1 rounded-r-md border border-gray-200">
                  <a href={company.website} target="_blank" rel="noreferrer" className="text-uos-blue hover:underline">
                    {company.website}
                  </a>
                </span>
              </div>
            </div>
          </div>

          <hr className="border-gray-100 my-8" />

          {/* Solution Section */}
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-uos-signiture-blue mb-2 hover:underline cursor-pointer">
                {solution.title}
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {solution.summary}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-bold text-gray-900 mb-1 flex items-center">
                <span className="text-uos-blue mr-1">✓</span> {t("솔루션 개요")}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {solution.abstract}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-bold text-gray-900 mb-1 flex items-center">
                <span className="text-uos-blue mr-1">✓</span> {t("솔루션 특징")}
              </h3>
               <p className="text-gray-600 text-sm leading-relaxed">
                {solution.feature}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-bold text-gray-900 mb-1 flex items-center">
                <span className="text-uos-blue mr-1">✓</span> {t("솔루션 구성")}
              </h3>
               <p className="text-gray-600 text-sm leading-relaxed">
                {solution.composition}
              </p>
            </div>
          </div>
          
          {/* Modify Button Section */}
          {/* Modify Button Section */}
          <div className="mt-12 flex justify-end pt-6 border-t border-gray-100">
            <SecretButton 
              className="bg-uos-blue hover:bg-uos-signiture-blue text-white px-6 py-2.5 rounded-lg font-medium shadow-sm transition-colors flex items-center"
              onClick={() => {
                // Modify functionality placeholder
                alert("Modify functionality to be implemented");
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              {t("수정")}
            </SecretButton>
          </div>
          
        </div>
      </Container>
    </div>
  );
}
