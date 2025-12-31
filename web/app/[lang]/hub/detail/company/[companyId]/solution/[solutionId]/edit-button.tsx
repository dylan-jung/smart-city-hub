"use client";

import { SecretButton } from "@components/secret-components";
import { useRouter } from "next/navigation";

type Props = {
  companyId: string | number;
  solutionId: string | number;
  label: string;
};

export default function EditButton({ companyId, solutionId, label }: Props) {
  const router = useRouter();

  return (
    <SecretButton
      className="bg-uos-blue hover:bg-uos-signiture-blue text-white px-6 py-2.5 rounded-lg font-medium shadow-sm transition-colors flex items-center"
      onClick={() => {
        router.push(
          `/hub/detail/company/${companyId}/solution/${solutionId}/edit`
        );
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4 mr-2"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
        />
      </svg>
      {label}
    </SecretButton>
  );
}
