'use client';

interface MealPlannerHeaderProps {
  onClearWeek: () => void;
  onExportPDF: () => void;
}

export function MealPlannerHeader({ onClearWeek, onExportPDF }: MealPlannerHeaderProps) {
  return (
    <div className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">📅 Meal Planner</h1>
            <p className="text-sm text-gray-600 mt-1">
              Plan your weekly meals and organize your cooking schedule
            </p>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={onClearWeek}
              className="px-4 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition-colors font-medium"
            >
              🗑️ Clear Week
            </button>
            <button
              onClick={onExportPDF}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              📄 Export PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
