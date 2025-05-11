/* eslint-disable @typescript-eslint/no-explicit-any /
/ eslint-disable @typescript-eslint/no-unused-vars */
"use client"
import { useState, useEffect } from "react"
import type React from "react"

import { QueryBuilder, type RuleGroupType, type Field, type FieldSelectorProps } from "react-querybuilder"
import { useRouter } from "next/navigation"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import "react-querybuilder/dist/query-builder.css"
import {
  Upload,
  Filter,
  MessageSquare,
  CheckCircle,
  ChevronRight,
  ChevronLeft,
  Info,
  Save,
  Wand2,
  X,
  Check,
  HelpCircle,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// Update the defaultFields with more options
const defaultFields: Field[] = [
  { name: "visits", label: "Number of Visits", inputType: "number" },
  { name: "inactive_days", label: "Days Since Last Visit", inputType: "number" },
  { name: "email", label: "Email", inputType: "text" },
  { name: "name", label: "Customer Name", inputType: "text" },
  { name: "last_order_date", label: "Last Order Date", inputType: "date" },
  { name: "order_count", label: "Total Orders", inputType: "number" },
  { name: "average_order_value", label: "Average Order Value", inputType: "number" },
]

// Add custom operators
const customOperators = [
  { name: "equal", label: "=" },
  { name: "notEqual", label: "≠" },
  { name: "greaterThan", label: ">" },
  { name: "lessThan", label: "<" },
  { name: "greaterThanOrEqual", label: "≥" },
  { name: "lessThanOrEqual", label: "≤" },
  { name: "contains", label: "Contains" },
  { name: "notContains", label: "Does not contain" },
  { name: "beginsWith", label: "Begins with" },
  { name: "endsWith", label: "Ends with" },
]

// Custom Field Selector Component
const CustomFieldSelector: React.FC<FieldSelectorProps> = ({ options, value, handleOnChange, className }) => {
  return (
    <select
      className={`${className} px-3 py-2 rounded-md border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-slate-400`}
      value={value}
      onChange={(e) => handleOnChange(e.target.value)}
    >
      {options.map((field) => (
        <option key={field.name} value={field.name}>
          {field.label}
        </option>
      ))}
    </select>
  )
}

const CustomCombinatorSelector: React.FC<any> = ({ value, handleOnChange, options, className }) => (
  <select
    className={`${className} px-3 py-2 rounded-md border border-black bg-white text-sm focus:outline-none focus:ring-2 focus:ring-slate-400`}
    value={value}
    onChange={(e) => handleOnChange(e.target.value)}
  >
    {options.map((option: any) => (
      <option key={option.name} value={option.name}>
        {option.label}
      </option>
    ))}
  </select>
)

const CustomAddRuleButton: React.FC<any> = ({ handleOnClick }) => (
  <Button variant="secondary" size="sm" onClick={handleOnClick} className="flex items-center gap-1 text-xs">
    <Plus className="h-3 w-3" /> Add Rule
  </Button>
)

const CustomAddGroupButton: React.FC<any> = ({ handleOnClick }) => (
  <Button variant="outline" size="sm" onClick={handleOnClick} className="flex items-center gap-1 text-xs">
    <Plus className="h-3 w-3" /> Add Group
  </Button>
)

const CustomRemoveButton: React.FC<any> = ({ handleOnClick }) => (
  <Button
    variant="ghost"
    size="icon"
    onClick={handleOnClick}
    className="h-6 w-6 text-slate-500 hover:text-red-500 hover:bg-red-50"
  >
    <X className="h-4 w-4" />
  </Button>
)

// Plus icon component for the add buttons
const Plus = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
)

export default function CreateCampaign() {
  const [useAiMessage, setUseAiMessage] = useState(false)
  const [aiGeneratedMessage, setAiGeneratedMessage] = useState("")
  const [isGeneratingMessage, setIsGeneratingMessage] = useState(false)
  const [userMessagePrompt, setUserMessagePrompt] = useState("")
  const [activeStep, setActiveStep] = useState(1)
  const [campaignName, setCampaignName] = useState("")
  const [campaignDesc, setCampaignDesc] = useState("")
  const [customMessage, setCustomMessage] = useState("Hi {{name}}, here's 10% off on your next order!")
  const [file, setFile] = useState<File | null>(null)
  const [fileName, setFileName] = useState("")
  const [csvFields, setCsvFields] = useState<string[]>([])
  const [showPromptInput, setShowPromptInput] = useState(false)
  const [promptText, setPromptText] = useState("")
  const [fields, setFields] = useState<Field[]>(defaultFields)
  const [query, setQuery] = useState<RuleGroupType>({ combinator: "and", rules: [] })
  const [preview, setPreview] = useState<any[]>([])
  const [filteredPreview, setFilteredPreview] = useState<any[]>([])
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [csvImportId, setCsvImportId] = useState<string | null>(null)
  const router = useRouter()

  // Form validation states
  const [stepsCompleted, setStepsCompleted] = useState({
    1: false,
    2: false,
    3: true, // Filter step is optional, so mark as true by default
    4: false,
  })

  // Check if step 1 is completed
  useEffect(() => {
    setStepsCompleted((prev) => ({
      ...prev,
      1: campaignName.trim() !== "" && customMessage.trim() !== "",
    }))
  }, [campaignName, customMessage])

  // Check if step 2 is completed
  useEffect(() => {
    setStepsCompleted((prev) => ({
      ...prev,
      2: preview.length > 0 && Boolean(csvImportId),
    }))
  }, [preview.length, csvImportId])

  // Check if step 4 is completed
  useEffect(() => {
    setStepsCompleted((prev) => ({
      ...prev,
      4: filteredPreview.length > 0 || (query.rules.length === 0 && preview.length > 0),
    }))
  }, [filteredPreview, preview, query.rules.length])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0])
      setFileName(e.target.files[0].name)
    }
  }

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a CSV file to upload.")
      return
    }
    setIsLoading(true)
    const formData = new FormData()
    formData.append("file", file)

    try {
      const res = await fetch("/api/campaigns/upload-csv", {
        method: "POST",
        body: formData,
        credentials: "include",
      })

      const data = await res.json()

      if (res.ok) {
        toast.success("CSV uploaded successfully!")

        if (data.fields && Array.isArray(data.fields)) {
          setCsvFields(data.fields)
          const newCsvFields: Field[] = data.fields
            .filter((f: string) => !defaultFields.some((df) => df.name === f))
            .map((f: string) => ({ name: f, label: f, inputType: "text" }) as Field)
          setFields([...defaultFields, ...newCsvFields])
        }

        if (data.preview) {
          setPreview(data.preview)
        }

        if (data.csvImportId) {
          setCsvImportId(data.csvImportId)
        }

        if (data.preview?.length > 0 && data.csvImportId) {
          setStepsCompleted((prev) => ({
            ...prev,
            2: true,
          }))
        }
      } else {
        toast.error(data.message || "Failed to upload CSV")
      }
    } catch (err) {
      toast.error("Network error. Please try again.")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const generateAiMessage = async () => {
    setIsGeneratingMessage(true)
    try {
      const res = await fetch("/api/llm/suggest-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          campaignName,
          description: campaignDesc,
          audience: `${preview.length} customers from CSV upload`,
          userMessage: userMessagePrompt,
        }),
      })

      const data = await res.json()
      if (res.ok) {
        setAiGeneratedMessage(data.message)
        setCustomMessage(data.message)
      } else {
        toast.error("Failed to generate message")
      }
    } catch (error) {
      toast.error("Error generating message")
    } finally {
      setIsGeneratingMessage(false)
    }
  }

  const handlePromptToFilter = async () => {
    if (!promptText.trim()) {
      toast.warning("Please enter a filter description")
      return
    }

    setIsLoading(true)
    try {
      // First generate the filter
      const filterRes = await fetch("/api/llm/generate-filter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: promptText,
          availableFields: fields,
        }),
      })

      const filterData = await filterRes.json()

      if (!filterRes.ok) {
        throw new Error(filterData.error || "Failed to generate filter")
      }

      if (filterData.query) {
        setQuery(filterData.query)
        setShowPromptInput(false)

        // Immediately fetch preview with the new query
        const previewRes = await fetch(
          `/api/campaigns/preview?rules=${encodeURIComponent(JSON.stringify(filterData.query))}&csvImportId=${csvImportId}`,
        )
        const previewData = await previewRes.json()

        if (previewRes.ok) {
          const resultData = previewData.data || []
          setFilteredPreview(resultData)
          toast.success(`Filter applied! Found ${resultData.length} matching customers.`)
        } else {
          toast.error(previewData.message || "Error fetching preview")
        }
      }
    } catch (error: any) {
      console.error("Filter generation error:", error)
      toast.error(error.message || "Error generating filter")
    } finally {
      setIsLoading(false)
    }
  }

  const fetchPreview = async () => {
    if (!csvImportId) {
      toast.error("Please upload a CSV first.")
      return
    }

    setIsLoading(true)
    try {
      console.log("Sending query:", query)

      const res = await fetch(
        `/api/campaigns/preview?rules=${encodeURIComponent(JSON.stringify(query))}&csvImportId=${csvImportId}`,
      )
      const data = await res.json()

      console.log("Preview response:", data)

      if (res.ok) {
        const resultData = data.data || []
        setFilteredPreview(resultData)
        toast.success(`Filtered ${resultData.length} recipients from your CSV.`)

        setStepsCompleted((prev) => ({
          ...prev,
          3: true,
          4: resultData.length > 0 || (query.rules.length === 0 && preview.length > 0),
        }))
      } else {
        toast.error(data.message || "Error fetching preview")
      }
    } catch (err) {
      console.error("Preview error:", err)
      toast.error("Error applying filters. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateCampaign = async () => {
    setIsLoading(true)
    try {
      const recipientsToUse = query.rules.length > 0 && filteredPreview.length > 0 ? filteredPreview : preview
      const useFiltered = query.rules.length > 0 && filteredPreview.length > 0

      if (recipientsToUse.length === 0) {
        toast.error("No recipients selected for the campaign.")
        setIsLoading(false)
        return
      }

      const campaignData = {
        name: campaignName,
        description: campaignDesc,
        message: customMessage,
        filters: query,
        csvImportId: csvImportId,
        preview: recipientsToUse,
        useFiltered: useFiltered,
      }

      const res = await fetch("/api/campaigns/send", {
        method: "POST",
        body: JSON.stringify(campaignData),
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      })

      const data = await res.json()

      if (res.ok) {
        toast.success("🚀 Campaign created and sent successfully!")
        setTimeout(() => router.push("/dashboard"), 1500)
      } else {
        toast.error(data.message || "Failed to create campaign")
      }
    } catch (err) {
      toast.error("Error creating campaign. Please try again.")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const nextStep = () => {
    if (activeStep === 3 && query.rules.length === 0 && preview.length > 0) {
      setFilteredPreview([])
      setStepsCompleted((prev) => ({
        ...prev,
        4: true,
      }))
    }
    if (activeStep < 4) setActiveStep(activeStep + 1)
  }

  const prevStep = () => {
    if (activeStep > 1) setActiveStep(activeStep - 1)
  }

  const goToStep = (step: number) => {
    const canAccessStep = Object.entries(stepsCompleted)
      .filter(([stepNum, completed]) => Number.parseInt(stepNum) < step)
      .every(([_, completed]) => completed)

    if (canAccessStep || step <= activeStep) {
      setActiveStep(step)
    }
  }

  const StepNavigation = () => (
    <div className="flex justify-between mt-8">
      {activeStep > 1 && (
        <Button onClick={prevStep} variant="outline" className="flex items-center gap-2">
          <ChevronLeft className="h-4 w-4" /> Back
        </Button>
      )}

      {activeStep < 4 ? (
        <Button
          onClick={nextStep}
          disabled={!stepsCompleted[activeStep]}
          className={`ml-auto flex items-center gap-2`}
          variant={stepsCompleted[activeStep] ? "default" : "secondary"}
        >
          Continue <ChevronRight className="h-4 w-4" />
        </Button>
      ) : (
        <Button
          onClick={handleCreateCampaign}
          disabled={isLoading || !(filteredPreview.length > 0 || (query.rules.length === 0 && preview.length > 0))}
          className="ml-auto"
          variant="default"
        >
          {isLoading ? "Creating..." : "Create & Send Campaign"}
        </Button>
      )}
    </div>
  )

  const renderValue = (val: any): string => {
    if (val === null || val === undefined) {
      return ""
    }
    if (val instanceof Date) {
      return val.toLocaleString()
    }
    if (typeof val === "object" && val !== null && val._id) {
      return String(val._id)
    }
    if (Array.isArray(val)) {
      return val.join(", ")
    }
    if (typeof val === "object") {
      try {
        return JSON.stringify(val)
      } catch {
        return "[Object]"
      }
    }
    return String(val)
  }

  const renderCsvTable = (data: any[]) => {
    if (!data || data.length === 0)
      return <div className="text-slate-500 italic text-center py-8">No data to display.</div>

    const headers = Object.keys(data[0] || {}).filter((key) => !key.startsWith("_"))

    return (
      <div className="overflow-x-auto rounded-md border border-slate-200 mt-4">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              {headers.map((key) => (
                <th
                  key={key}
                  className="px-3 py-2 border-b border-slate-200 bg-slate-50 text-slate-700 text-left text-sm font-medium"
                >
                  {key}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.slice(0, 5).map((row, idx) => (
              <tr key={idx} className="hover:bg-slate-50">
                {headers.map((key) => (
                  <td key={`${idx}-${key}`} className="px-3 py-2 border-b border-slate-100 text-sm text-slate-700">
                    {renderValue(row[key])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        {data.length > 5 && (
          <div className="py-2 px-3 text-slate-500 text-sm bg-slate-50 border-t border-slate-200">
            Showing 5 of {data.length} rows
          </div>
        )}
      </div>
    )
  }

  const saveFilter = () => {
    if (query.rules.length === 0) {
      toast.warning("No filter rules to save")
      return
    }

    toast.success("Filter saved successfully")
  }

  const renderPreviewResults = () => {
    if (isLoading) {
      return (
        <div className="mt-6 text-center text-slate-500 py-8">
          <div className="animate-spin h-8 w-8 border-2 border-slate-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          Loading preview...
        </div>
      )
    }

    if (filteredPreview.length > 0) {
      return (
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-2 text-slate-800">Filtered Results Preview (First 5 Rows)</h3>
          {renderCsvTable(filteredPreview)}
          <Alert variant="success" className="mt-4">
            <CheckCircle className="h-4 w-4" />
            <AlertTitle>Filter applied successfully!</AlertTitle>
            <AlertDescription>Found {filteredPreview.length} matching customers.</AlertDescription>
          </Alert>
        </div>
      )
    }

    if (query.rules.length > 0) {
      return (
        <div className="mt-6">
          <Alert variant="warning">
            <Info className="h-4 w-4" />
            <AlertTitle>No matches found</AlertTitle>
            <AlertDescription>Try adjusting your filter criteria.</AlertDescription>
          </Alert>
        </div>
      )
    }

    return (
      <div className="mt-6">
        <div className="text-slate-500 text-sm">
          Build your filter above and click "Apply Filter & Preview" to see results.
        </div>
      </div>
    )
  }

  const steps = [
    { number: 1, title: "Details", icon: <MessageSquare className="h-4 w-4" /> },
    { number: 2, title: "Upload", icon: <Upload className="h-4 w-4" /> },
    { number: 3, title: "Filter", icon: <Filter className="h-4 w-4" /> },
    { number: 4, title: "Review", icon: <CheckCircle className="h-4 w-4" /> },
  ]

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-lg shadow-sm my-8">
      <h1 className="text-3xl font-bold mb-8 text-slate-800">Create Campaign</h1>

      {/* Step Indicator */}
      <div className="flex mb-10">
        {steps.map((step, index) => (
          <div key={step.number} className={`flex-1 ${index < steps.length - 1 ? "md:pr-4" : ""}`}>
            <div
              onClick={() => goToStep(step.number)}
              className={`
                flex flex-col items-center cursor-pointer
                ${activeStep >= step.number ? (stepsCompleted[step.number] || activeStep === step.number ? "text-slate-800" : "text-amber-500") : "text-slate-400"}
              `}
            >
              <div
                className={`
                rounded-full w-10 h-10 flex items-center justify-center text-sm mb-2
                border-2 transition-all duration-200
                ${activeStep > step.number && stepsCompleted[step.number] ? "bg-emerald-600 text-white border-emerald-600" : ""}
                ${activeStep === step.number ? "border-slate-800 text-slate-800" : ""}
                ${activeStep < step.number ? "border-slate-200 text-slate-400" : ""}
                ${activeStep > step.number && !stepsCompleted[step.number] ? "bg-amber-500 text-white border-amber-500" : ""} 
              `}
              >
                {activeStep > step.number && stepsCompleted[step.number] ? <Check className="h-5 w-5" /> : step.icon}
              </div>
              <div className="text-center text-sm font-medium">{step.title}</div>
            </div>
            {index < steps.length - 1 && (
              <div className="hidden md:block relative h-0.5 bg-slate-200 mt-5 mx-auto w-[calc(100%-2.5rem)]">
                <div
                  className={`absolute top-0 left-0 h-full transition-all duration-300 ${
                    activeStep > step.number && stepsCompleted[step.number] ? "bg-emerald-600" : "bg-slate-200"
                  }`}
                  style={{ width: activeStep > step.number && stepsCompleted[step.number] ? "100%" : "0%" }}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <Card className="border-slate-200">
        <CardContent className="p-6">
          {activeStep === 1 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-slate-800">Campaign Information</h2>
                <Badge variant="outline" className="text-slate-600 bg-slate-50">
                  Step 1 of 4
                </Badge>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="campaignName">Campaign Name *</Label>
                  <Input
                    id="campaignName"
                    placeholder="Summer Promotion 2025"
                    value={campaignName}
                    onChange={(e) => setCampaignName(e.target.value)}
                    className="w-full"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="campaignDesc">Description (optional)</Label>
                  <Textarea
                    id="campaignDesc"
                    placeholder="Special discount for customers..."
                    value={campaignDesc}
                    onChange={(e) => setCampaignDesc(e.target.value)}
                    className="w-full h-24"
                  />
                </div>

                {/* Message Template Section */}
                <div className="space-y-4 pt-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="customMessage">Message Template *</Label>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-slate-600">AI Assisted</span>
                      <Switch checked={useAiMessage} onCheckedChange={setUseAiMessage} id="ai-toggle" />
                    </div>
                  </div>

                  {useAiMessage ? (
                    <div className="space-y-4">
                      <Textarea
                        value={userMessagePrompt}
                        onChange={(e) => setUserMessagePrompt(e.target.value)}
                        placeholder="Write your rough message here. AI will enhance it..."
                        className="w-full"
                        rows={3}
                      />
                      <Button
                        onClick={generateAiMessage}
                        disabled={isGeneratingMessage || !userMessagePrompt.trim()}
                        className="flex items-center gap-2"
                        variant="default"
                      >
                        {isGeneratingMessage ? (
                          <>
                            <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
                            Enhancing...
                          </>
                        ) : (
                          <>
                            <Wand2 className="h-4 w-4" /> Enhance Message
                          </>
                        )}
                      </Button>

                      {aiGeneratedMessage && (
                        <Card className="border-slate-200 bg-slate-50">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-slate-700">Enhanced Message:</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <Textarea
                              value={aiGeneratedMessage}
                              onChange={(e) => {
                                setAiGeneratedMessage(e.target.value)
                                setCustomMessage(e.target.value)
                              }}
                              className="w-full"
                              rows={4}
                            />
                          </CardContent>
                          <CardFooter>
                            <Button
                              onClick={() => setCustomMessage(aiGeneratedMessage)}
                              variant="secondary"
                              size="sm"
                              className="w-full"
                            >
                              Use This Message
                            </Button>
                          </CardFooter>
                        </Card>
                      )}
                    </div>
                  ) : (
                    <Textarea
                      id="customMessage"
                      placeholder="Hi {{name}}, here's 10% off on your next order!"
                      value={customMessage}
                      onChange={(e) => setCustomMessage(e.target.value)}
                      className="w-full"
                      rows={4}
                      required
                    />
                  )}

                  {customMessage && (
                    <Card className="border-slate-200">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-slate-700">Preview:</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-slate-800 whitespace-pre-wrap">
                          {customMessage.replace(/\{\{name\}\}/g, "John Doe")}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeStep === 2 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-slate-800">Upload Customer Data</h2>
                <Badge variant="outline" className="text-slate-600 bg-slate-50">
                  Step 2 of 4
                </Badge>
              </div>

              <Card className="border-dashed border-2 border-slate-300 bg-slate-50">
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                  <input
                    type="file"
                    id="csv-upload"
                    accept=".csv, text/csv"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label htmlFor="csv-upload" className="cursor-pointer flex flex-col items-center justify-center">
                    <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                      <Upload className="h-8 w-8 text-slate-400" />
                    </div>
                    {fileName ? (
                      <span className="font-medium text-slate-800">{fileName}</span>
                    ) : (
                      <>
                        <span className="font-medium text-slate-800">Click to upload CSV</span>
                        <span className="text-slate-500 text-sm mt-2">or drag and drop</span>
                      </>
                    )}
                    <span className="text-xs text-slate-500 mt-4">CSV files only, max 10MB</span>
                  </label>
                </CardContent>
              </Card>

              <div className="flex justify-center">
                <Button
                  onClick={handleUpload}
                  disabled={isLoading || !file}
                  className="flex items-center gap-2"
                  variant="default"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4" /> Upload & Process
                    </>
                  )}
                </Button>
              </div>

              {preview.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-4 text-slate-800">CSV Preview (First 5 Rows)</h3>
                  {renderCsvTable(preview)}
                  <Alert variant="info" className="mt-4">
                    <Info className="h-4 w-4" />
                    <AlertTitle>CSV imported successfully!</AlertTitle>
                    <AlertDescription>
                      You've imported {preview.length} customer records. Continue to filter these customers or send to
                      all.
                    </AlertDescription>
                  </Alert>
                </div>
              )}
            </div>
          )}

          {activeStep === 3 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-slate-800">Filter Your Audience</h2>
                <Badge variant="outline" className="text-slate-600 bg-slate-50">
                  Step 3 of 4
                </Badge>
              </div>

              <div className="flex justify-between items-center">
                <h3 className="text-base font-medium text-slate-700">Create Filter Rules</h3>
               <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600">Use AI</span>
                <Switch checked={showPromptInput} onCheckedChange={setShowPromptInput} id="ai-filter-toggle" />
              </div>
              </div>

              {showPromptInput ? (
                <Card className="border-slate-200">
                  <CardContent className="p-4 space-y-4">
                    <Textarea
                      value={promptText}
                      onChange={(e) => setPromptText(e.target.value)}
                      placeholder="Describe your filter in natural language... (e.g., 'Show me customers who spent more than 10000 and visited less than 3 times in the last 90 days')"
                      className="w-full h-32"
                    />
                    <Button onClick={handlePromptToFilter} className="flex items-center gap-2" variant="default">
                      <Wand2 className="h-4 w-4" /> Convert to Filter
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <Card className="border-slate-200">
                  <CardContent className="p-4">
                    <QueryBuilder
                      fields={fields}
                      query={query}
                      onQueryChange={(q) => {
                        setQuery(q)
                        setStepsCompleted((prev) => ({ ...prev, 4: false }))
                      }}
                      operators={customOperators}
                      controlElements={{
                        fieldSelector: CustomFieldSelector,
                        combinatorSelector: CustomCombinatorSelector,
                        addRuleAction: CustomAddRuleButton,
                        addGroupAction: CustomAddGroupButton,
                        removeRuleAction: CustomRemoveButton,
                        removeGroupAction: CustomRemoveButton,
                      }}
                      controlClassnames={{
                        queryBuilder: "queryBuilder-branches",
                        ruleGroup: "p-4 border rounded-md bg-slate-50 my-2",
                        rule: "flex  items-center space-x-2 my-2",
                      }}
                    />
                  </CardContent>
                </Card>
              )}

              <div className="flex items-center space-x-4">
                <Button
                  onClick={fetchPreview}
                  disabled={isLoading || !csvImportId || query.rules.length === 0}
                  className="flex items-center gap-2"
                  variant="default"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
                      Applying...
                    </>
                  ) : (
                    <>
                      <Filter className="h-4 w-4" /> Apply Filter & Preview
                    </>
                  )}
                </Button>

                <Button
                  onClick={saveFilter}
                  disabled={query.rules.length === 0}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Save className="h-4 w-4" /> Save Filter
                </Button>
              </div>

              {/* Preview Results Section */}
              {renderPreviewResults()}
            </div>
          )}

          {activeStep === 4 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-slate-800">Review & Send Campaign</h2>
                <Badge variant="outline" className="text-slate-600 bg-slate-50">
                  Step 4 of 4
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-slate-200">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Campaign Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <dl className="space-y-2 text-sm">
                      <div className="flex border-b border-slate-100 pb-2">
                        <dt className="w-1/3 text-slate-500 font-medium">Name:</dt>
                        <dd className="w-2/3 font-medium text-slate-800">{campaignName}</dd>
                      </div>
                      {campaignDesc && (
                        <div className="flex border-b border-slate-100 pb-2">
                          <dt className="w-1/3 text-slate-500 font-medium">Description:</dt>
                          <dd className="w-2/3 text-slate-700">{campaignDesc}</dd>
                        </div>
                      )}
                      <div className="flex">
                        <dt className="w-1/3 text-slate-500 font-medium">Recipients:</dt>
                        <dd className="w-2/3 font-medium text-slate-800">
                          {query.rules.length > 0 && filteredPreview.length > 0
                            ? `${filteredPreview.length} customers (filtered)`
                            : `${preview.length} customers (all uploaded)`}
                        </dd>
                      </div>
                    </dl>
                  </CardContent>
                </Card>

                <Card className="border-slate-200">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Message Preview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="p-3 bg-slate-50 rounded-md border border-slate-200 text-slate-800 whitespace-pre-wrap">
                      {customMessage.replace(/\{\{name\}\}/g, "Customer Name")}
                    </div>
                    <div className="mt-3 text-xs text-slate-500 flex items-center gap-1">
                      <Info className="h-3 w-3" />
                      The placeholder{" "}
                      <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-700">
                        &#123;&#123;name&#125;&#125;
                      </code>{" "}
                      will be replaced with each customer's name.
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="border-slate-200 bg-slate-50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Audience Summary (First 5 Rows)</CardTitle>
                </CardHeader>
                <CardContent>
                  {renderCsvTable(query.rules.length > 0 && filteredPreview.length > 0 ? filteredPreview : preview)}
                </CardContent>
              </Card>

              <Alert variant="info">
                <Info className="h-4 w-4" />
                <AlertTitle>Ready to send</AlertTitle>
                <AlertDescription>
                  Your campaign is ready to be sent to{" "}
                  {query.rules.length > 0 && filteredPreview.length > 0 ? filteredPreview.length : preview.length}{" "}
                  recipients.
                </AlertDescription>
              </Alert>
            </div>
          )}

          <StepNavigation />
        </CardContent>
      </Card>

      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  )
}
