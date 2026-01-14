"use client";

import { SolutionCompany } from "core/model";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createCompany, deleteCompany, getBilingualCompany, updateCompany } from "../actions";

export default function CompanyTable({ companies, total, currentPage, lang }: { companies: SolutionCompany[]; total: number; currentPage: number; lang: string }) {
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const emptyContent = { name: "", ceo: "", address: "", tel: "", fax: "", website: "" };
  const [formData, setFormData] = useState<Partial<SolutionCompany>>({ 
      ko: { ...emptyContent }, 
      en: { ...emptyContent } 
  });
  
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'ko' | 'en'>('ko');
  const router = useRouter();

  const handleEdit = async (company: SolutionCompany) => {
    setLoading(true);
    try {
        const bilingualData = await getBilingualCompany(company.companyId);
        if (bilingualData) {
            setEditingId(bilingualData.companyId);
            setFormData(bilingualData);
            setIsCreating(false);
        } else {
            // If getBilingual returns null, maybe fallback to using the company object we have if it's already bilingual?
            // Since company IS SolutionCompany now (bilingual), we can use it directly.
            setEditingId(company.companyId);
            setFormData(company);
            setIsCreating(false);
        }
    } catch (e) {
        console.error(e);
        alert("Error fetching data");
    } finally {
        setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingId(null);
    setFormData({
      companyId: "",
      ko: { ...emptyContent },
      en: { ...emptyContent },
    });
    setIsCreating(true);
    setActiveTab('ko');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'companyId') {
        setFormData(prev => ({ ...prev, companyId: value }));
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
    try {
        if (isCreating) {
            await createCompany(formData as SolutionCompany, lang);
        } else {
            await updateCompany({ ...formData, companyId: editingId! } as any, lang);
        }
        setEditingId(null);
        setIsCreating(false);
        setFormData({ ko: { ...emptyContent }, en: { ...emptyContent } });
    } catch (e) {
        console.error(e);
        alert("Failed to save");
    } finally {
        setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Delete this company?")) {
      setLoading(true);
      await deleteCompany(id, lang);
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(total / 10);

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
      <div className="p-4 flex justify-between items-center bg-gray-50 border-b">
        <h2 className="text-lg font-semibold">Companies ({total})</h2>
        <button onClick={handleCreate} className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 font-medium text-sm">
          + Add Company
        </button>
      </div>

      {(isCreating || editingId) && (
        <div className="p-4 bg-blue-50 border-b space-y-4">
          <div className="flex justify-between items-center">
              <h3 className="font-bold text-sm text-blue-800">{isCreating ? "New Company" : "Edit Company"}</h3>
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
            {/* Common Field - ID */}
             <div className="col-span-2">
                <label className="block text-xs font-medium text-gray-700 mb-1">Company ID (Shared)</label>
                <input 
                    name="companyId" 
                    type="text" 
                    placeholder="Company ID" 
                    value={formData.companyId || ""} 
                    disabled={!isCreating}
                    onChange={handleChange} 
                    className="w-full p-2 border rounded bg-white disabled:bg-gray-100" 
                />
            </div>

            {/* Localized Fields */}
            <input name="name" placeholder="Name" value={formData[activeTab]?.name || ""} onChange={handleChange} className="p-2 border rounded" required />
            <input name="ceo" placeholder="CEO" value={formData[activeTab]?.ceo || ""} onChange={handleChange} className="p-2 border rounded" />
            <input name="address" placeholder="Address" value={formData[activeTab]?.address || ""} onChange={handleChange} className="p-2 border rounded" />
            <input name="tel" placeholder="Tel" value={formData[activeTab]?.tel || ""} onChange={handleChange} className="p-2 border rounded" />
            <input name="fax" placeholder="Fax" value={formData[activeTab]?.fax || ""} onChange={handleChange} className="p-2 border rounded" />
            <input name="website" placeholder="Website" value={formData[activeTab]?.website || ""} onChange={handleChange} className="p-2 border rounded" />
          </div>
          <div className="flex justify-end gap-2">
            <button onClick={() => { setIsCreating(false); setEditingId(null); setFormData({ ko: { ...emptyContent }, en: { ...emptyContent } }); }} className="px-3 py-1 text-gray-600 border rounded hover:bg-gray-100">Cancel</button>
            <button onClick={handleSave} disabled={loading} className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">{loading ? "Saving..." : "Save"}</button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CEO</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {companies.map((company) => {
               const content = lang === 'en' ? (company.en || company.ko) : company.ko;
               return (
                  <tr key={company.companyId} className="hover:bg-gray-50 cursor-pointer" onClick={(e) => {
                       if ((e.target as HTMLElement).closest('button')) return;
                       router.push(`/${lang}/hub/admin/company/${company.companyId}`);
                  }}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{company.companyId}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{content.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{content.ceo}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button onClick={() => handleEdit(company)} className="text-indigo-600 hover:text-indigo-900 mr-4">Edit</button>
                      <button onClick={() => handleDelete(company.companyId)} className="text-red-600 hover:text-red-900">Delete</button>
                    </td>
                  </tr>
               );
            })}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      <div className="p-4 flex justify-center items-center space-x-2 border-t text-sm">
        <button
          onClick={() => currentPage > 1 && router.push(`/${lang}/hub/admin?page=${currentPage - 1}`)}
          disabled={currentPage === 1}
          className="px-3 py-1 rounded border bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          &lt;
        </button>
        
        {(() => {
          const pageNumbers = [];
          const maxVisiblePages = 5;
          
          if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
              pageNumbers.push(i);
            }
          } else {
            if (currentPage <= 3) {
              for (let i = 1; i <= 4; i++) {
                pageNumbers.push(i);
              }
              pageNumbers.push(-1); // Ellipsis
              pageNumbers.push(totalPages);
            } else if (currentPage >= totalPages - 2) {
              pageNumbers.push(1);
              pageNumbers.push(-1); // Ellipsis
              for (let i = totalPages - 3; i <= totalPages; i++) {
                pageNumbers.push(i);
              }
            } else {
              pageNumbers.push(1);
              pageNumbers.push(-1); // Ellipsis
              pageNumbers.push(currentPage - 1);
              pageNumbers.push(currentPage);
              pageNumbers.push(currentPage + 1);
              pageNumbers.push(-1); // Ellipsis
              pageNumbers.push(totalPages);
            }
          }

          return pageNumbers.map((p, index) => (
            p === -1 ? (
              <span key={`ellipsis-${index}`} className="px-2">...</span>
            ) : (
              <button
                key={p}
                onClick={() => router.push(`/${lang}/hub/admin?page=${p}`)}
                className={`px-3 py-1 rounded border ${
                    p === currentPage 
                    ? 'bg-blue-600 text-white border-blue-600' 
                    : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'
                }`}
              >
                {p}
              </button>
            )
          ));
        })()}

        <button
          onClick={() => currentPage < totalPages && router.push(`/${lang}/hub/admin?page=${currentPage + 1}`)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 rounded border bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          &gt;
        </button>
      </div>
    </div>
  );
}
