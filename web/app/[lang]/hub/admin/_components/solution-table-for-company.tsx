"use client";

import { Locale, SolutionItem } from "core/model";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { getSolutionCategoryAll } from "../../categories";
import { deleteSolution } from "../actions";

type Props = {
  solutions: SolutionItem[];
  lang: string;
  companyId: string;
};

export function SolutionTableForCompany({ solutions: initialSolutions, lang, companyId }: Props) {
  const [solutions, setSolutions] = useState<SolutionItem[]>(initialSolutions);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const categories = getSolutionCategoryAll(lang as Locale);

  const handleDelete = async (id: string) => {
       if (confirm("Delete this solution?")) {
      setLoading(true);
      await deleteSolution(id, lang);
      setLoading(false);
      router.refresh();
      setSolutions(solutions.filter(s => s.solutionId !== id));
    }
  }

  return (
    <div className="bg-white">
       <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
            <div></div>
            <Link 
                href={`/${lang}/hub/admin/company/${companyId}/solution/create`} 
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 font-medium text-sm"
            >
                + New Solution
            </Link>
       </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>

              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
             {solutions.length === 0 && (
                <tr>
                    <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
                        No solutions found.
                    </td>
                </tr>
             )}
            {solutions.map((solution) => {
               const content = lang === 'en' ? (solution.en || solution.ko) : solution.ko;
               return (
                  <tr key={solution.solutionId}>

                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{content.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {/* Show readable Category Name instead of ID if possible, but the user requirement said "Use readable text for UI", which mostly implies form. 
                            However, the table also shows category ID. I'll stick to ID for now or I can map it too. 
                            The user said "mainCategoryId, subCategoryId is hard to understand as numbers. @[categories.ts] ... UI allows text ... internal uses ID".
                            Usually this means inputs. But table display is also UI.
                            I can use getSolutionCategoryAll here too.
                        */}
                        {categories[solution.mainCategoryId]?.name || solution.mainCategoryId} - {categories[solution.mainCategoryId]?.subCategories[solution.subCategoryId]?.name || solution.subCategoryId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link href={`/${lang}/hub/admin/company/${companyId}/solution/${solution.solutionId}/edit`} className="text-indigo-600 hover:text-indigo-900 mr-4">
                        Edit
                      </Link>
                       <button onClick={() => handleDelete(solution.solutionId)} className="text-red-600 hover:text-red-900">Delete</button>
                    </td>
                  </tr>
               );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
