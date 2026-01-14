"use client";

import { SolutionItem } from "core/model";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { deleteSolution, updateSolution } from "../actions";

type Props = {
  solution: SolutionItem;
  lang: string;
};

export default function SolutionEditForm({ solution, lang }: Props) {
  // Ensure we have correct initial structure
  const [formData, setFormData] = useState<SolutionItem>(solution);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'ko' | 'en'>('ko');
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    // Top level fields
    if (['mainCategoryId', 'subCategoryId'].includes(name)) {
        setFormData(prev => ({ 
            ...prev, 
            [name]: parseInt(value) 
        }));
    } else if (name === 'solutionId') {
         // ID usually shouldn't change, but if needed:
         setFormData(prev => ({ ...prev, solutionId: value }));
    } else {
        // Localized fields
        setFormData(prev => ({
            ...prev,
            [activeTab]: {
                ...prev[activeTab],
                [name]: value
            }
        }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await updateSolution(formData, lang, solution.companyId);
    setIsLoading(false);
    alert('Solution updated successfully');
    router.push(`/${lang}/hub/admin/company/${solution.companyId}`);
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this solution?")) {
      setIsLoading(true);
      await deleteSolution(solution.solutionId, lang, solution.companyId);
      setIsLoading(false);
      router.push(`/${lang}/hub/admin/company/${solution.companyId}`);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Edit Solution</h1>
        <div className="flex space-x-2">
            <button 
                type="button"
                onClick={() => setActiveTab('ko')}
                className={`px-3 py-1 text-sm rounded ${activeTab === 'ko' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border'}`}
            >
                Korean
            </button>
            <button 
                type="button"
                onClick={() => setActiveTab('en')}
                className={`px-3 py-1 text-sm rounded ${activeTab === 'en' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border'}`}
            >
                English
            </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Shared Fields */}
        <div className="bg-gray-50 p-4 rounded border grid grid-cols-3 gap-4">
             <div className="col-span-3 mb-2 font-medium text-sm text-gray-500">Shared Configuration</div>
             <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company ID</label>
                <input
                    type="text"
                    value={formData.companyId}
                    disabled
                    className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500"
                />
             </div>
             <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Main Category ID</label>
                <input
                    type="number"
                    name="mainCategoryId"
                    value={formData.mainCategoryId}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                />
             </div>
             <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sub Category ID</label>
                <input
                    type="number"
                    name="subCategoryId"
                    value={formData.subCategoryId}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                />
             </div>
        </div>

        {/* Localized Fields */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title ({activeTab.toUpperCase()})</label>
          <input
            type="text"
            name="title"
            value={formData[activeTab]?.title || ""}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Summary ({activeTab.toUpperCase()})</label>
          <textarea
            name="summary"
            value={formData[activeTab]?.summary || ""}
            onChange={handleChange}
            rows={3}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Abstract ({activeTab.toUpperCase()})</label>
          <textarea
            name="abstract"
            value={formData[activeTab]?.abstract || ""}
            onChange={handleChange}
            rows={4}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Feature ({activeTab.toUpperCase()})</label>
          <textarea
            name="feature"
            value={formData[activeTab]?.feature || ""}
            onChange={handleChange}
            rows={4}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
           <label className="block text-sm font-medium text-gray-700 mb-1">Composition ({activeTab.toUpperCase()})</label>
           <textarea
            name="composition"
            value={formData[activeTab]?.composition || ""}
            onChange={handleChange}
            rows={4}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="flex justify-between pt-4 border-t">
          <button
            type="button"
            onClick={handleDelete}
            disabled={isLoading}
            className="px-4 py-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            {isLoading ? "Deleting..." : "Delete Solution"}
          </button>
          
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
             {isLoading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
