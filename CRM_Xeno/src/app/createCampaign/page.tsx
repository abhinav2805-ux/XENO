'use client';
import { useState, useEffect } from 'react';
import {
  QueryBuilder,
  RuleGroupType,
  Field, // Import Field type for field objects
  FieldSelectorProps, // Import props type for the custom field selector
} from 'react-querybuilder';
import { useRouter } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'react-querybuilder/dist/query-builder.css';

const defaultFields: Field[] = [ // Explicitly type with Field[]
  { name: 'spend', label: 'Spend', inputType: 'number' },
  { name: 'visits', label: 'Visits', inputType: 'number' },
  { name: 'inactiveDays', label: 'Inactive Days', inputType: 'number' },
  { name: 'email', label: 'Email', inputType: 'text' },
  { name: 'name', label: 'Name', inputType: 'text' },
];

// Custom Field Selector Component
// This component ensures that only the field's label (a string) is rendered in the options.
const CustomFieldSelector: React.FC<FieldSelectorProps> = ({
  options,
  value,
  handleOnChange,
  className,
  // title, // title might also be passed, can be added to select if needed
}) => {
  return (
    <select
      className={className} // Use the className passed by QueryBuilder for consistent styling
      value={value}
      onChange={e => handleOnChange(e.target.value)}
      // title={title} // Optional: if you want to pass the title through
    >
      {options.map((field) => ( // options are already typed as Field[] implicitly by FieldSelectorProps
        <option key={field.name} value={field.name}>
          {field.label} {/* This is the crucial part: ensuring field.label is rendered */}
        </option>
      ))}
    </select>
  );
};


export default function CreateCampaign() {
  const [activeStep, setActiveStep] = useState(1);
  const [campaignName, setCampaignName] = useState('');
  const [campaignDesc, setCampaignDesc] = useState('');
  const [customMessage, setCustomMessage] = useState("Hi {{name}}, here's 10% off on your next order!");
  const [file, setFile] = useState<File | null>(null); // Type file state
  const [fileName, setFileName] = useState('');
  const [csvFields, setCsvFields] = useState<string[]>([]); // Assuming csvFields are strings
  const [fields, setFields] = useState<Field[]>(defaultFields); // Type fields state
  const [query, setQuery] = useState<RuleGroupType>({ combinator: 'and', rules: [] });
  const [preview, setPreview] = useState<any[]>([]);
  const [filteredPreview, setFilteredPreview] = useState<any[]>([]);
  const [message, setMessage] = useState(''); // This state seems unused, consider removing if so
  const [isLoading, setIsLoading] = useState(false);
  const [csvImportId, setCsvImportId] = useState<string | null>(null); // Assuming csvImportId is a string
  const router = useRouter();

  // Form validation states
  const [stepsCompleted, setStepsCompleted] = useState({
    1: false,
    2: false,
    3: true, // Filter step is optional, so mark as true by default
    4: false,
  });

  // Check if step 1 is completed
  useEffect(() => {
    setStepsCompleted(prev => ({
      ...prev,
      1: campaignName.trim() !== '' && customMessage.trim() !== ''
    }));
  }, [campaignName, customMessage]);

  // Check if step 2 is completed
 useEffect(() => {
  setStepsCompleted(prev => ({
    ...prev,
    2: preview.length > 0 && Boolean(csvImportId)
  }));
}, [preview.length, csvImportId]);

  // Check if step 4 is completed
  useEffect(() => {
    setStepsCompleted(prev => ({
      ...prev,
      4: filteredPreview.length > 0 || (query.rules.length === 0 && preview.length > 0) // Adjusted logic: step 4 complete if filtered OR no filters & full preview
    }));
  }, [filteredPreview, preview, query.rules.length]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => { // Type event
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
      setFileName(e.target.files[0].name);
      // setMessage(''); // Consider if setMessage is needed
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error('Please select a CSV file to upload.');
      return;
    }
    setIsLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const res = await fetch('/api/campaigns/upload-csv', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });
      
      const data = await res.json();
      
      if (res.ok) {
        toast.success('CSV uploaded successfully!');
        
        if (data.fields && Array.isArray(data.fields)) {
          setCsvFields(data.fields);
          // Ensure newly added fields are also of type Field
          const newCsvFields: Field[] = data.fields
            .filter((f: string) => !defaultFields.some(df => df.name === f))
            .map((f: string) => ({ name: f, label: f, inputType: 'text' } as Field)); // Cast to Field
          setFields([...defaultFields, ...newCsvFields]);
        }
        
        if (data.preview) {
          setPreview(data.preview);
        }
        
        if (data.csvImportId) {
          setCsvImportId(data.csvImportId);
        }

        if (data.preview?.length > 0 && data.csvImportId) {
          setStepsCompleted(prev => ({
            ...prev,
            2: true
          }));
        }
      } else {
        toast.error(data.message || 'Failed to upload CSV');
      }
    } catch (err) {
      toast.error('Network error. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPreview = async () => {
    if (!csvImportId) {
      toast.error("Please upload a CSV first.");
      return;
    }
    
    setIsLoading(true);
    try {
      const res = await fetch(`/api/campaigns/preview?rules=${encodeURIComponent(JSON.stringify(query))}&csvImportId=${csvImportId}`);
      const data = await res.json();
      
      if (res.ok) {
        const resultData = data.data || [];
        setFilteredPreview(resultData);
        toast.success(`Filtered ${resultData.length} recipients from your CSV.`);
        
        setStepsCompleted(prev => ({
          ...prev,
          // Step 3 (Filter Audience) is considered "complete" if filters are applied,
          // or if the user proceeds without applying filters (which is allowed).
          // Step 4 completion depends on having data (either filtered or full preview).
          3: true, // Mark filter step as complete once filters are applied or attempted
          4: resultData.length > 0 || (query.rules.length === 0 && preview.length > 0)
        }));
      } else {
        toast.error(data.message || 'Error fetching preview');
      }
    } catch (err) {
      toast.error('Error applying filters. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateCampaign = async () => {
    setIsLoading(true);
    try {
      const recipientsToUse = query.rules.length > 0 && filteredPreview.length > 0 ? filteredPreview : preview;
      const useFiltered = query.rules.length > 0 && filteredPreview.length > 0;
      
      if (recipientsToUse.length === 0) {
        toast.error("No recipients selected for the campaign.");
        setIsLoading(false);
        return;
      }

      const campaignData = {
        name: campaignName,
        description: campaignDesc,
        message: customMessage,
        filters: query,
        csvImportId: csvImportId,
        preview: recipientsToUse, // Send the actual list of recipients
        useFiltered: useFiltered
      };
      
      const res = await fetch('/api/campaigns/send', {
        method: 'POST',
        body: JSON.stringify(campaignData),
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      });
      
      const data = await res.json();
      
      if (res.ok) {
        toast.success('🚀 Campaign created and sent successfully!');
        setTimeout(() => router.push('/dashboard'), 1500);
      } else {
        toast.error(data.message || 'Failed to create campaign');
      }
    } catch (err) {
      toast.error('Error creating campaign. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = () => {
    if (activeStep === 3 && query.rules.length === 0 && preview.length > 0) {
      // If user is on step 3, has not applied filters, but has a preview,
      // mark step 4 as completable with the full preview.
      setFilteredPreview([]); // Clear any stale filtered preview
       setStepsCompleted(prev => ({
        ...prev,
        4: true // Allow moving to step 4 with full preview
      }));
    }
    if (activeStep < 4) setActiveStep(activeStep + 1);
  };

  const prevStep = () => {
    if (activeStep > 1) setActiveStep(activeStep - 1);
  };

  const goToStep = (step: number) => { // Type step
    const canAccessStep = Object.entries(stepsCompleted)
      .filter(([stepNum, completed]) => parseInt(stepNum) < step)
      .every(([_, completed]) => completed);
      
    if (canAccessStep || step <= activeStep) {
      setActiveStep(step);
    }
  };

  const StepNavigation = () => (
    <div className="flex justify-between mt-8">
      {activeStep > 1 && (
        <button
          onClick={prevStep}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
        >
          Back
        </button>
      )}
      
      {activeStep < 4 ? (
        <button
          onClick={nextStep}
          disabled={!stepsCompleted[activeStep]}
          className={`ml-auto px-6 py-2 rounded font-medium transition-colors ${
            stepsCompleted[activeStep]
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-blue-300 text-white cursor-not-allowed'
          }`}
        >
          Continue
        </button>
      ) : (
        <button
          onClick={handleCreateCampaign}
          disabled={isLoading || !(filteredPreview.length > 0 || (query.rules.length === 0 && preview.length > 0))}
          className="ml-auto px-6 py-2 bg-green-600 text-white rounded font-medium hover:bg-green-700 transition-colors disabled:bg-green-300 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Creating...' : 'Create & Send Campaign'}
        </button>
      )}
    </div>
  );

 const renderValue = (val: any): string => {
  if (val === null || val === undefined) {
    return '';
  }
  if (val instanceof Date) {
    return val.toLocaleString();
  }
  // Ensure val is not null and has _id before trying to access it
  if (typeof val === 'object' && val !== null && val._id) {
    return String(val._id); // Convert to string
  }
  if (Array.isArray(val)) {
    return val.join(', ');
  }
  if (typeof val === 'object') {
    try {
      return JSON.stringify(val);
    } catch {
      return '[Object]';
    }
  }
  return String(val);
};

const renderCsvTable = (data: any[]) => {
  if (!data || data.length === 0) return <div className="text-gray-500 italic">No data to display.</div>;
  
  const headers = Object.keys(data[0] || {})
    .filter(key => !key.startsWith('_'));

  return (
    <div className="overflow-x-auto rounded border mt-4">
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            {headers.map((key) => (
                <th key={key} className="px-3 py-2 border-b bg-gray-100 text-gray-700 text-left text-sm font-medium">
                  {key}
                </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.slice(0, 5).map((row, idx) => (
            <tr key={idx} className="hover:bg-blue-50">
              {headers.map((key) => ( // Iterate using filtered headers to maintain order and filter
                  <td key={`${idx}-${key}`} className="px-3 py-2 border-b text-sm">
                    {renderValue(row[key])}
                  </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {data.length > 5 && (
        <div className="py-2 px-3 text-gray-500 text-sm bg-gray-50 border-t">
          Showing 5 of {data.length} rows
        </div>
      )}
    </div>
  );
};
  const debugInfo = () => (
    <div className="mt-4 p-2 bg-gray-100 text-xs text-gray-700 rounded">
      <div>Step 1 completed: {stepsCompleted[1] ? '✅' : '❌'}</div>
      <div>Step 2 completed: {stepsCompleted[2] ? '✅' : '❌'}</div>
      <div>Step 3 completed (can proceed): {stepsCompleted[3] ? '✅' : '❌'}</div>
      <div>Step 4 completed (can send): {stepsCompleted[4] ? '✅' : '❌'}</div>
      <div>CSV Import ID: {csvImportId ? `✅ (${csvImportId})` : '❌'}</div>
      <div>Preview count: {preview.length}</div>
      <div>Filtered count: {filteredPreview.length}</div>
      <div>Query Rules: {JSON.stringify(query.rules)}</div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 bg-white rounded-lg shadow my-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Create Campaign</h1>
      
      <div className="flex mb-10">
        {[1, 2, 3, 4].map((step) => (
          <div key={step} className={`flex-1 ${step < 4 ? 'md:pr-4' : ''}`}>
            <div 
              onClick={() => goToStep(step)}
              className={`
                flex flex-col items-center cursor-pointer
                ${activeStep >= step ? (stepsCompleted[step] || activeStep === step ? 'text-blue-600' : 'text-orange-500') : 'text-gray-400'}
              `}
            >
              <div className={`
                rounded-full w-10 h-10 flex items-center justify-center text-lg mb-2
                border-2
                ${activeStep > step && stepsCompleted[step] ? 'bg-blue-600 text-white border-blue-600' : ''}
                ${activeStep === step ? 'border-blue-600 text-blue-600' : ''}
                ${activeStep < step ? 'border-gray-300 text-gray-400' : ''}
                ${activeStep > step && !stepsCompleted[step] ? 'bg-orange-400 text-white border-orange-400' : ''} 
              `}>
                {activeStep > step && stepsCompleted[step] ? '✓' : step}
              </div>
              <div className="text-center text-sm">
                {step === 1 && 'Details'}
                {step === 2 && 'Upload'}
                {step === 3 && 'Filter'}
                {step === 4 && 'Review'}
              </div>
            </div>
            {step < 4 && (
               <div className="hidden md:block relative h-1 bg-gray-200 mt-5 mx-auto w-[calc(100%-2.5rem)]">
                <div
                  className={`absolute top-0 left-0 h-full transition-colors duration-300 ${
                    activeStep > step && stepsCompleted[step] ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                  style={{ width: activeStep > step && stepsCompleted[step] ? '100%' : '0%' }}
                />
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 min-h-[400px]">
        {activeStep === 1 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800">Campaign Information</h2>
            <div>
              <label htmlFor="campaignName" className="block text-sm font-medium text-gray-700 mb-1">Campaign Name *</label>
              <input
                id="campaignName"
                type="text"
                placeholder="Summer Promotion 2025"
                value={campaignName}
                onChange={e => setCampaignName(e.target.value)}
                className="w-full border border-gray-300 px-4 py-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                required
              />
            </div>
            <div>
              <label htmlFor="campaignDesc" className="block text-sm font-medium text-gray-700 mb-1">Description (optional)</label>
              <textarea
                id="campaignDesc"
                placeholder="Special discount for customers..."
                value={campaignDesc}
                onChange={e => setCampaignDesc(e.target.value)}
                className="w-full border border-gray-300 px-4 py-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors h-24"
              />
            </div>
            <div>
              <label htmlFor="customMessage" className="block text-sm font-medium text-gray-700 mb-1">Message Template *</label>
              <div className="mb-2 text-sm text-gray-500">
                Use <code className="bg-gray-200 px-1 py-0.5 rounded">&#123;&#123;name&#125;&#125;</code> for personalization.
              </div>
              <textarea
                id="customMessage"
                placeholder="Hi {{name}}, here's 10% off on your next order!"
                value={customMessage}
                onChange={e => setCustomMessage(e.target.value)}
                className="w-full border border-gray-300 px-4 py-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                rows={4}
                required
              />
              {customMessage && (
                <div className="mt-4 p-4 bg-white border rounded-md">
                  <div className="text-sm font-medium text-gray-500 mb-2">Preview:</div>
                  <div className="text-gray-800 whitespace-pre-wrap">
                    {customMessage.replace(/\{\{name\}\}/g, 'John Doe')}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        
        {activeStep === 2 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800">Upload Customer Data</h2>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <input
                type="file"
                id="csv-upload"
                accept=".csv, text/csv"
                onChange={handleFileChange}
                className="hidden"
              />
              <label 
                htmlFor="csv-upload" 
                className="cursor-pointer flex flex-col items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                {fileName ? (
                  <span className="font-medium text-blue-600">{fileName}</span>
                ) : (
                  <>
                    <span className="font-medium text-blue-600">Click to upload CSV</span>
                    <span className="text-gray-500 text-sm mt-2">or drag and drop</span>
                  </>
                )}
              </label>
            </div>
            <div className="flex">
              <button
                onClick={handleUpload}
                disabled={isLoading || !file}
                className={`flex items-center justify-center px-6 py-2 rounded-md ${
                  isLoading || !file
                    ? 'bg-blue-300 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                } text-white font-medium transition-colors`}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  'Upload & Process'
                )}
              </button>
            </div>
            {preview.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-2">CSV Preview (First 5 Rows)</h3>
                {renderCsvTable(preview)}
                <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mt-4 flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <div className="text-sm text-blue-800">
                    <p className="font-medium">CSV imported successfully!</p>
                    <p className="mt-1">You've imported {preview.length} customer records. Continue to filter these customers or send to all.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        
        {activeStep === 3 && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800">Filter Your Audience</h2>
              <span className="text-sm text-gray-500">Optional: Skip to send to all uploaded recipients.</span>
            </div>
            <div className="bg-white p-4 border rounded-md">
              <QueryBuilder
                fields={fields}
                query={query}
                onQueryChange={q => {
                  setQuery(q);
                  // When query changes, step 4 is no longer "complete" until filters are applied or skipped
                  setStepsCompleted(prev => ({...prev, 4: false}));
                }}
                controlElements={{ // ADD THIS
                  fieldSelector: CustomFieldSelector, // Use the custom field selector
                }}
              />
            </div>
            <div className="flex">
              <button
                onClick={fetchPreview}
                disabled={isLoading || !csvImportId || query.rules.length === 0}
                className={`flex items-center justify-center px-6 py-2 rounded-md ${
                  isLoading || !csvImportId || query.rules.length === 0
                    ? 'bg-blue-300 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                } text-white font-medium transition-colors`}
              >
                {isLoading ? 'Applying...' : 'Apply Filter & Preview'}
              </button>
            </div>
            {query.rules.length > 0 && filteredPreview.length > 0 && (
              <div className="mt-4">
                <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-4 flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div className="text-sm text-green-800">
                    <p className="font-medium">Filtered {filteredPreview.length} customers.</p>
                    <p className="mt-1">Your campaign will be sent to this filtered audience if you continue.</p>
                  </div>
                </div>
                <h3 className="text-lg font-medium mb-2">Filtered Audience Preview (First 5 Rows)</h3>
                {renderCsvTable(filteredPreview)}
              </div>
            )}
             {query.rules.length > 0 && !isLoading && !filteredPreview.length && (
                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-md text-sm">
                  No customers match the current filter criteria. Adjust your filters or proceed to send to all uploaded recipients.
                </div>
            )}
          </div>
        )}
        
        {activeStep === 4 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800">Review & Send Campaign</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-4 border rounded-md">
                <h3 className="font-medium text-gray-800 mb-2">Campaign Details</h3>
                <dl className="space-y-2 text-sm">
                  <div className="flex">
                    <dt className="w-1/3 text-gray-500">Name:</dt>
                    <dd className="w-2/3 font-medium">{campaignName}</dd>
                  </div>
                  {campaignDesc && (
                    <div className="flex">
                      <dt className="w-1/3 text-gray-500">Description:</dt>
                      <dd className="w-2/3">{campaignDesc}</dd>
                    </div>
                  )}
                  <div className="flex">
                    <dt className="w-1/3 text-gray-500">Recipients:</dt>
                    <dd className="w-2/3 font-medium">
                      {(query.rules.length > 0 && filteredPreview.length > 0)
                        ? `${filteredPreview.length} customers (filtered)`
                        : `${preview.length} customers (all uploaded)`}
                    </dd>
                  </div>
                </dl>
              </div>
              <div className="bg-white p-4 border rounded-md">
                <h3 className="font-medium text-gray-800 mb-2">Message Preview</h3>
                <div className="p-3 bg-gray-100 rounded border text-gray-800 whitespace-pre-wrap">
                  {customMessage.replace(/\{\{name\}\}/g, 'Customer Name')}
                </div>
                <div className="mt-3 text-sm text-gray-500">
                  The placeholder <code className="bg-gray-200 px-1 py-0.5 rounded">&#123;&#123;name&#125;&#125;</code> will be replaced.
                </div>
              </div>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-4">
              <h3 className="font-medium text-blue-800 mb-2">Audience Summary (First 5 Rows)</h3>
              {renderCsvTable( (query.rules.length > 0 && filteredPreview.length > 0) ? filteredPreview : preview )}
            </div>
          </div>
        )}
        
        <StepNavigation />
      </div>

      {/* Uncomment for debugging step completion states */}
      {/* {debugInfo()} */}
      
      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
}