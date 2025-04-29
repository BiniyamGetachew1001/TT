import React, { useState } from 'react';
import { runConnectionDiagnostics } from '../../services/connectionTestService';
import { AlertTriangle, CheckCircle, XCircle, RefreshCw } from 'lucide-react';

interface ConnectionDiagnosticsProps {
  supabaseUrl: string;
  apiKey: string;
}

const ConnectionDiagnostics: React.FC<ConnectionDiagnosticsProps> = ({ 
  supabaseUrl, 
  apiKey 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<{
    externalApiWorking: boolean;
    supabaseApiWorking: boolean;
    supabaseAuthWorking: boolean;
    details: string[];
  } | null>(null);

  const runDiagnostics = async () => {
    setIsRunning(true);
    try {
      const diagnosticResults = await runConnectionDiagnostics(supabaseUrl, apiKey);
      setResults(diagnosticResults);
    } catch (error) {
      console.error('Error running diagnostics:', error);
    } finally {
      setIsRunning(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-md bg-blue-900/80 px-3 py-2 text-sm text-blue-100 shadow-lg transition-all duration-300 hover:bg-blue-800/80"
      >
        <AlertTriangle size={16} />
        <span>Connection Diagnostics</span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 left-4 z-50 w-80 rounded-md bg-[#2d1e14] p-4 shadow-lg">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-white">Connection Diagnostics</h3>
        <button
          onClick={() => setIsOpen(false)}
          className="rounded-full p-1 hover:bg-black/20"
          aria-label="Close"
        >
          &times;
        </button>
      </div>

      {!results ? (
        <div className="flex flex-col items-center gap-3 py-4">
          <p className="text-gray-300 text-sm">
            Run diagnostics to check your connection to Supabase and external APIs.
          </p>
          <button
            onClick={runDiagnostics}
            disabled={isRunning}
            className="gold-button flex items-center gap-2"
          >
            {isRunning ? (
              <>
                <RefreshCw size={16} className="animate-spin" /> Running...
              </>
            ) : (
              <>
                <RefreshCw size={16} /> Run Diagnostics
              </>
            )}
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              {results.externalApiWorking ? (
                <CheckCircle size={16} className="text-green-400" />
              ) : (
                <XCircle size={16} className="text-red-400" />
              )}
              <span className="text-sm text-gray-200">External API Connection</span>
            </div>

            <div className="flex items-center gap-2">
              {results.supabaseApiWorking ? (
                <CheckCircle size={16} className="text-green-400" />
              ) : (
                <XCircle size={16} className="text-red-400" />
              )}
              <span className="text-sm text-gray-200">Supabase REST API</span>
            </div>

            <div className="flex items-center gap-2">
              {results.supabaseAuthWorking ? (
                <CheckCircle size={16} className="text-green-400" />
              ) : (
                <XCircle size={16} className="text-red-400" />
              )}
              <span className="text-sm text-gray-200">Supabase Auth API</span>
            </div>
          </div>

          <div className="mt-3 border-t border-[#7a4528]/30 pt-3">
            <p className="text-xs text-gray-400 mb-2">Detailed Results:</p>
            <div className="max-h-40 overflow-y-auto text-xs text-gray-300 bg-black/20 p-2 rounded">
              {results.details.map((detail, index) => (
                <div key={index} className="mb-1">
                  {detail}
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between pt-2">
            <button
              onClick={() => setResults(null)}
              className="text-xs text-gray-400 hover:text-gray-300"
            >
              Clear Results
            </button>
            <button
              onClick={runDiagnostics}
              disabled={isRunning}
              className="flex items-center gap-1 text-xs text-[#c9a52c] hover:text-[#e0b93e]"
            >
              {isRunning ? (
                <>
                  <RefreshCw size={12} className="animate-spin" /> Running...
                </>
              ) : (
                <>
                  <RefreshCw size={12} /> Run Again
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConnectionDiagnostics;
