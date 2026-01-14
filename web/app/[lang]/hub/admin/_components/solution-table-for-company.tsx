"use client";

import { SolutionItem } from "core/model";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createSolution, deleteSolution } from "../actions";

type Props = {
  solutions: SolutionItem[];
  lang: string;
  companyId: string;
};

export function SolutionTableForCompany({ solutions: initialSolutions, lang, companyId }: Props) {
  const [solutions, setSolutions] = useState<SolutionItem[]>(initialSolutions);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [isCreating, setIsCreating] = useState(false);
  
  const emptyContent = { title: "", summary: "", abstract: "", feature: "", composition: "" };
  const [formData, setFormData] = useState<Partial<SolutionItem>>({ 
      ko: { ...emptyContent },
      en: { ...emptyContent }
  });
  
  const [activeTab, setActiveTab] = useState<'ko' | 'en'>('ko');

  const handleCreate = () => {
    setFormData({
      companyId: companyId,
      mainCategoryId: 0,
      subCategoryId: 0,
      ko: { ...emptyContent },
      en: { ...emptyContent },
    });
    setIsCreating(true);
    setActiveTab('ko');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (['mainCategoryId', 'subCategoryId'].includes(name)) {
        setFormData(prev => ({ ...prev, [name]: parseInt(value) }));
    } else {
        setFormData(prev => ({
            ...prev,
            [activeTab]: {
                ...prev[activeTab] as any,
                [name]: value
            }
        }));
    }
  };
  
  const handleSave = async () => {
      setLoading(true);
      await createSolution(formData as SolutionItem, lang);
      setLoading(false);
      setIsCreating(false);
      router.refresh();
      setFormData({ ko: { ...emptyContent }, en: { ...emptyContent } });
  };

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
            <button 
                onClick={handleCreate} 
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
                + New Solution
            </button>
       </div>

       {(isCreating) && (
        <div className="p-4 bg-blue-50 border-b space-y-4">
          <div className="flex justify-between items-center">
              <h3 className="font-bold text-sm text-blue-800">New Solution</h3>
               <div className="flex space-x-2">
                  <button 
                    onClick={() => setActiveTab('ko')}
                    className={`px-3 py-1 text-sm rounded ${activeTab === 'ko' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border'}`}
                  >
                    Korean
                  </button>
                  <button 
                    onClick={() => setActiveTab('en')}
                    className={`px-3 py-1 text-sm rounded ${activeTab === 'en' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border'}`}
                  >
                    English
                  </button>
              </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
             {/* Shared Fields */}
             <div className="col-span-2 grid grid-cols-2 gap-4 bg-gray-100 p-2 rounded">
                <div>
                    <label className="block text-xs">Main Category ID</label>
                    <input name="mainCategoryId" type="number" value={formData.mainCategoryId || 0} onChange={handleChange} className="p-2 border rounded w-full" />
                </div>
                <div>
                    <label className="block text-xs">Sub Category ID</label>
                    <input name="subCategoryId" type="number" value={formData.subCategoryId || 0} onChange={handleChange} className="p-2 border rounded w-full" />
                </div>
             </div>
             
             {/* Localized Fields */}
             <input name="title" placeholder="Title" value={formData[activeTab]?.title || ""} onChange={handleChange} className="p-2 border rounded col-span-2" required />
             <textarea name="summary" placeholder="Summary" value={formData[activeTab]?.summary || ""} onChange={handleChange} className="p-2 border rounded col-span-2" rows={2} />
             <textarea name="abstract" placeholder="Abstract" value={formData[activeTab]?.abstract || ""} onChange={handleChange} className="p-2 border rounded col-span-2" rows={2} />
             <textarea name="feature" placeholder="Feature" value={formData[activeTab]?.feature || ""} onChange={handleChange} className="p-2 border rounded col-span-2" rows={2} />
             <textarea name="composition" placeholder="Composition" value={formData[activeTab]?.composition || ""} onChange={handleChange} className="p-2 border rounded col-span-2" rows={2} />
          </div>
          <div className="flex justify-end gap-2">
            <button onClick={() => { setIsCreating(false); setFormData({ ko: { ...emptyContent }, en: { ...emptyContent } }); }} className="px-3 py-1 text-gray-600 border rounded hover:bg-gray-100">Cancel</button>
            <button onClick={handleSave} disabled={loading} className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">{loading ? "Saving..." : "Save"}</button>
          </div>
        </div>
      )}

       <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
             {solutions.length === 0 && (
                <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                        No solutions found.
                    </td>
                </tr>
             )}
            {solutions.map((solution) => {
               const content = lang === 'en' ? (solution.en || solution.ko) : solution.ko;
               return (
                  <tr key={solution.solutionId}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{solution.solutionId}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{content.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{solution.mainCategoryId}-{solution.subCategoryId}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link href={`/${lang}/hub/admin/solution/${solution.solutionId}/edit`} className="text-indigo-600 hover:text-indigo-900 mr-4">
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
