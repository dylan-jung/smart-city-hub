"use server";

import { getSolutionsByCompanyId } from "./search-service";

export async function getSolutionsForCompany(companyId: number) {
  return getSolutionsByCompanyId(companyId);
}
