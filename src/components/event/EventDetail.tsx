import React from "react";
import { LucideIcon } from "lucide-react";

function EventDetail({
  icon: Icon,
  detailName,
  detailValue,
}: {
  icon: LucideIcon;
  detailName: string;
  detailValue: string;
}) {
  return (
    <div className="rounded-lg border border-gray-200 bg-gray-100 p-4">
      <div className="mb-1 flex items-center text-gray-600">
        <Icon className="mr-2 h-5 w-5 text-yellow-500" />
        <span className="text-sm">{detailName}</span>
      </div>
      <p className="text-gray-900">{detailValue}</p>
    </div>
  );
}

export default EventDetail;
