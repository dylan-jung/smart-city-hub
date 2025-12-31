"use client";

import { getSolutionsByCompany } from "@/actions";
import { SecretButton } from "@components/secret-components";
import { SolutionCompany, SolutionItem } from "core/model";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function CompanyBox(props: {
  company: SolutionCompany;
  mainCategoryId: number;
  subCategoryId?: number;
}) {
  const { company, mainCategoryId, subCategoryId } = props;
  const [isExpanded, setIsExpanded] = useState(false);
  const [solutions, setSolutions] = useState<SolutionItem[]>([]);

  const { t, i18n } = useTranslation();

  useEffect(() => {
    if (isExpanded) {
      getSolutionsByCompany(company.companyId, mainCategoryId, subCategoryId).then(setSolutions);
    }
  }, [isExpanded]);

  return (
    <div className="border rounded-lg px-4 py-3 mb-4 shadow-sm ring-gray-200 hover:bg-gray-50 hover:ring-2 transition">
      <div className="font-medium text-lg">
        <a href={company.website} target="_blank" rel="noreferrer" className="hover:underline">
          {i18n.language === "en" ? company.nameEng : company.name}
        </a>
      </div>
      <div className="flex flex-wrap gap-3 mt-4 mb-1">
        {[
          [t("대표"), company.ceo],
          [t("주소"), company.address],
          [t("전화"), company.tel],
          [t("팩스"), company.fax],
        ].map(([label, value]) => (
          <div key={label} className="text-sm font-medium">
            <span className="bg-uos-gray-mist text-gray-800 px-2.5 py-0.5 rounded-l">{label}</span>
            <span className="bg-gray-100 text-gray-800 px-2.5 py-0.5 rounded-r">{value}</span>
          </div>
        ))}
      </div>
      <button
        className="mt-2 text-sm font-medium text-uos-blue hover:underline"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {isExpanded ? t("접기") : t("보유 솔루션 보기")}
      </button>
      {isExpanded && (
        <div className="mt-4 mb-2">
          {solutions.map((solution) => (
            <div key={solution.solutionId} className="border-t px-2 pt-4 mt-4 text-sm">
              <div className="font-semibold text-lg text-uos-signiture-blue hover:underline cursor-pointer flex items-center group">
                 <Link href={`/hub/detail/company/${company.companyId}/solution/${solution.solutionId}`}>
                  {solution.title}
                  <span className="font-normal ml-2 inline-block transition-transform group-hover:translate-x-1">{">>"}</span>
                 </Link>
              </div>
              <div className="mt-1">{solution.summary}</div>
              <div className="mt-3 font-bold">✓ 솔루션 개요</div>
              <div>{solution.abstract}</div>
              <div className="mt-3 font-bold">✓ 솔루션 특징</div>
              <div>{solution.feature}</div>
              <div className="mt-3 font-bold">✓ 솔루션 구성</div>
              <div>{solution.composition}</div>
            </div>
          ))}
          <div className="mt-4 flex justify-end px-2">
            <SecretButton
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded shadow-sm transition-colors"
              onClick={() => {
                alert("Add functionality to be implemented");
              }}
            >
              + {t("추가")}
            </SecretButton>
          </div>

        </div>
      )}
    </div>
  );
}
