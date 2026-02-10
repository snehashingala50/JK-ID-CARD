import { FileSpreadsheet, Download, CheckCircle } from 'lucide-react';

export function ExportInfo() {
  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center flex-shrink-0">
          <FileSpreadsheet className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-gray-900 mb-2">
            📊 Excel Export Feature Available
          </h3>
          <p className="text-sm text-gray-700 mb-4">
            Admin panel में से आप सभी student data को Excel/CSV format में download कर सकते हैं।
          </p>
          
          <div className="space-y-2">
            <div className="flex items-start gap-2 text-sm text-gray-700">
              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span><strong>All student data</strong> including name, class, contact details</span>
            </div>
            <div className="flex items-start gap-2 text-sm text-gray-700">
              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span><strong>Filter & export</strong> specific status (Pending/Approved)</span>
            </div>
            <div className="flex items-start gap-2 text-sm text-gray-700">
              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span><strong>Direct download</strong> in CSV format (Excel compatible)</span>
            </div>
            <div className="flex items-start gap-2 text-sm text-gray-700">
              <Download className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span>File name: <code className="bg-white px-2 py-0.5 rounded text-xs">student_data_YYYY-MM-DD.csv</code></span>
            </div>
          </div>

          <div className="mt-4 p-3 bg-white rounded-lg border border-green-200">
            <p className="text-xs text-gray-600">
              <strong>💡 Tip:</strong> CSV file Excel में सीधे open होगी। यदि characters ठीक से नहीं दिख रहे हैं, तो Excel में "Data" → "From Text/CSV" का उपयोग करें और UTF-8 encoding select करें।
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
