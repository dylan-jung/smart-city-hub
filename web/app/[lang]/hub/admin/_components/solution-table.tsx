"use client";

import { getSolutionsByCompany } from "@/actions";
import { SolutionCompany, SolutionItem } from "core/model";
import Link from "next/link";
import { useState } from "react";
import { createSolution, deleteSolution } from "../actions";

type Props = {
  companies: SolutionCompany[];
  lang: string;
};

export default function SolutionTable({ companies, lang }: Props) {
  const [solutions, setSolutions] = useState<SolutionItem[]>([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>("");
  const [mainCategoryId, setMainCategoryId] = useState<string>("0");
  const [loading, setLoading] = useState(false);

  // ... (isCreating, formData logic) ...
  const [isCreating, setIsCreating] = useState(false);
  
  const emptyContent = { title: "", summary: "", abstract: "", feature: "", composition: "" };
  const [formData, setFormData] = useState<Partial<SolutionItem>>({ 
      ko: { ...emptyContent }, 
      en: { ...emptyContent } 
  });
  
  const [activeTab, setActiveTab] = useState<'ko' | 'en'>('ko');

  const fetchSolutions = async (companyId: string, mainCate: string) => {
    if (!companyId || !mainCate) return;
    setLoading(true);
    try {
      const res = await getSolutionsByCompany(
        companyId,
        parseInt(mainCate),
      );
      setSolutions(res);
    } catch (e) {
      console.error(e);
      setSolutions([]);
    }
    setLoading(false);
  };
 
  // ... (handleFilterChange, handleCreate, handleChange, handleSave, handleDelete) ...
  const handleFilterChange = (compId: string, mainCate: string) => {
    setSelectedCompanyId(compId);
    setMainCategoryId(mainCate);
    if (compId) {
      fetchSolutions(compId, mainCate);
    } else {
        setSolutions([]);
    }
  };

  const handleCreate = () => {
    setFormData({
      solutionId: "",
      companyId: selectedCompanyId ? selectedCompanyId : undefined,
      mainCategoryId: parseInt(mainCategoryId),
      subCategoryId: 0,
      ko: { ...emptyContent },
      en: { ...emptyContent },
    });
    setIsCreating(true);
    setActiveTab('ko');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    // Top level fields
    if (['solutionId', 'subCategoryId'].includes(name)) {
        setFormData(prev => ({ 
            ...prev, 
            [name]: name === 'subCategoryId' ? parseInt(value) : value 
        }));
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
      // Refresh list
      fetchSolutions(selectedCompanyId, mainCategoryId);
      setFormData({ ko: { ...emptyContent }, en: { ...emptyContent } });
  };

  const handleDelete = async (id: string) => {
       if (confirm("Delete this solution?")) {
      setLoading(true);
      await deleteSolution(id, lang);
      setLoading(false);
      // Refresh list
      fetchSolutions(selectedCompanyId, mainCategoryId);
    }
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden mt-8">
       {/* ... (Header with filters) ... */}
       <div className="p-4 bg-gray-50 border-b">
         <h2 className="text-lg font-semibold mb-4">Solutions</h2>
         <div className="flex gap-4 items-end">
            <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Company</label>
                <select 
                    className="p-2 border rounded w-64" 
                    value={selectedCompanyId} 
                    onChange={(e) => handleFilterChange(e.target.value, mainCategoryId)}
                >
                    <option value="">Select Company</option>
                    {companies.map(c => {
                       const companyName = lang === 'en' ? (c.en?.name || c.ko.name) : c.ko.name;
                       return <option key={c.companyId} value={c.companyId}>{companyName}</option>
                    })}
                </select>
            </div>
            <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Main Category ID</label>
                <input 
                    type="number" 
                    className="p-2 border rounded w-32" 
                    value={mainCategoryId}
                    onChange={(e) => handleFilterChange(selectedCompanyId, e.target.value)}
                />
            </div>
            <button 
                onClick={handleCreate} 
                disabled={!selectedCompanyId}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed ml-auto"
            >
                + New Solution
            </button>
         </div>
       </div>

       {/* ... (Create Form) ... */}
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
                 <input name="solutionId" type="text" placeholder="Solution ID" value={formData.solutionId || ""} onChange={handleChange} className="p-2 border rounded" required />
                 {/* Creating logic assumes connected company/category */}
                 <div className="text-sm text-center content-center text-gray-500">
                    Parent: {formData.companyId}, Main Cat: {formData.mainCategoryId}
                 </div>
                 <div className="col-span-2">
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sub Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
             {solutions.length === 0 && (
                <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                        {selectedCompanyId ? "No solutions found" : "Select a company to view solutions"}
                    </td>
                </tr>
             )}
            {solutions.map((solution) => {
               const content = lang === 'en' ? (solution.en || solution.ko) : solution.ko;
               return (
                  <tr key={solution.solutionId}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{solution.solutionId}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{content.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{solution.subCategoryId}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link href={`/${lang}/hub/detail/company/${solution.companyId}/solution/${solution.solutionId}/edit`} className="text-indigo-600 hover:text-indigo-900 mr-4">
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
