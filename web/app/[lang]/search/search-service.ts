import { SolutionItem } from "core/model";

// Hardcoded mock data as requested
const MOCK_COMPANY_NAME = "(주)케이티";

const MOCK_SOLUTIONS: (SolutionItem & { companyName: string })[] = [
  {
    "solutionId": 353,
    "companyId": 68,
    "companyName": MOCK_COMPANY_NAME,
    "title": "기가센싱",
    "mainCategoryId": 0,
    "subCategoryId": 1,
    "summary": "기가센싱은 KT 플랫폼 기반의 센서/제어 서비스로, 시설물의 상태 및 제어를 제공하는 서비스입니다.",
    "abstract": "기가센싱은 자동제어 국제 표준 기반의 센서/제어 서비스로, KT 플랫폼 기반으로 시설물의 상태 및 제어를 제공합니다.",
    "feature": "기가센싱의 특징은 표준 프로토콜 기반으로 확장/대체/통합이 용이한 H/W 구성, 이용자용 관제 환경(웹, 문자 알람) 제공과 함께 전문 유인관제 동시 제공입니다. 또한, 주요 키워드는 전문 관제 서비스, 확장성, 개방성입니다.",
    "composition": "기가센싱의 H/W 구성은 KNX 기반 컨트롤러 및 표준 프로토콜 기반 센서/제어입니다. S/W 구성은 이용자 전용 관제(웹/알람시스템) 및 전문 관제 S/W입니다."
  },
];

export type SearchOption = "all" | "country" | "solution";

export type SearchResultSolution = SolutionItem & { companyName: string };

export type SearchResult = {
  solutions: SearchResultSolution[];
};

export function search(keyword: string, option: SearchOption): SearchResult {
  // Always return the mock solutions for the "Solution List" only requirement
  const normalizedKeyword = keyword.trim().toLowerCase();
  
  if (!normalizedKeyword) {
    return { solutions: [] };
  }

  return { solutions: MOCK_SOLUTIONS };
}

export function getSolutionsByCompanyId(companyId: number): SolutionItem[] {
  return MOCK_SOLUTIONS;
}
