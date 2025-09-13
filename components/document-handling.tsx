"use client"

import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { FileText, Download, Upload, Eye, CheckCircle, AlertCircle, Clock, ArrowRight } from "lucide-react"
import type { OnboardingData } from "./onboarding-flow"

interface DocumentHandlingProps {
  data: OnboardingData
  updateData: (updates: Partial<OnboardingData>) => void
  onNext: () => void
  canProceed: boolean
  uploadMode?: boolean
}

const documents = [
  {
    id: "ownership-agreement",
    name: "Ownership Agreement",
    description: "Legal terms and conditions of your timeshare ownership",
    content: `TIMESHARE OWNERSHIP AGREEMENT

This agreement outlines the terms and conditions of your timeshare ownership with Tiny Share Properties.

1. OWNERSHIP RIGHTS
Your ownership entitles you to the usage rights as specified in your selected share level.

2. USAGE TERMS
- Booking must be made in advance
- Usage is subject to availability
- Maintenance periods may restrict access

3. FINANCIAL OBLIGATIONS
- Annual maintenance fees apply
- Property taxes are shared proportionally
- Special assessments may be levied

4. TRANSFER RIGHTS
- Ownership may be transferred with proper documentation
- Transfer fees apply as per current rate schedule

5. TERMINATION
- Agreement may be terminated under specific conditions
- Refund policies apply as outlined in Section 12

This is a legally binding agreement. Please read carefully before signing.`,
  },
  {
    id: "maintenance-terms",
    name: "Maintenance Terms",
    description: "Details about property maintenance and associated costs",
    content: `MAINTENANCE TERMS AND CONDITIONS

1. MAINTENANCE RESPONSIBILITIES
The property management company is responsible for:
- Regular upkeep and repairs
- Landscaping and exterior maintenance
- Common area maintenance
- Emergency repairs

2. OWNER OBLIGATIONS
- Annual maintenance fee payment
- Reporting of damages during usage
- Compliance with property rules

3. COST ALLOCATION
Maintenance costs are allocated based on ownership percentage.

4. SPECIAL ASSESSMENTS
Major repairs or improvements may require special assessments with 30-day notice.`,
  },
  {
    id: "usage-rights",
    name: "Usage Rights Document",
    description: "Your specific usage rights and booking procedures",
    content: `USAGE RIGHTS AND BOOKING PROCEDURES

1. BOOKING SYSTEM
- Online booking system available 24/7
- Advance booking required (minimum 7 days)
- Peak season restrictions may apply

2. USAGE ALLOCATION
Your usage days are allocated based on your ownership percentage:
- Full Share: 365 days/year
- 1/2 Share: 182 days/year
- 1/4 Share: 91 days/year
- 1/8 Share: 45 days/year

3. GUEST POLICIES
- Guests allowed with owner present
- Maximum occupancy limits apply
- Guest registration required

4. PROPERTY RULES
- No smoking policy
- Pet restrictions apply
- Quiet hours: 10 PM - 8 AM`,
  },
  {
    id: "financial-disclosure",
    name: "Financial Disclosure",
    description: "Complete financial breakdown and fee structure",
    content: `FINANCIAL DISCLOSURE STATEMENT

1. PURCHASE PRICE
Your purchase price includes:
- Ownership rights
- Initial setup fees
- First year maintenance

2. ONGOING COSTS
Annual maintenance fees (estimated):
- Full Share: €2,400/year
- 1/2 Share: €1,200/year
- 1/4 Share: €600/year
- 1/8 Share: €300/year

3. ADDITIONAL FEES
- Booking fees: €25 per reservation
- Cleaning fees: €75 per stay
- Damage deposits: €200 (refundable)

4. PAYMENT TERMS
- Purchase price due at closing
- Maintenance fees due annually
- Late payment penalties apply`,
  },
  {
    id: "legal-terms",
    name: "Legal Terms & Conditions",
    description: "Legal framework and dispute resolution procedures",
    content: `LEGAL TERMS AND CONDITIONS

1. GOVERNING LAW
This agreement is governed by the laws of [Jurisdiction].

2. DISPUTE RESOLUTION
- Mediation required before litigation
- Arbitration clause applies
- Legal fees allocation

3. LIABILITY LIMITATIONS
- Property management liability limits
- Owner insurance requirements
- Indemnification clauses

4. COMPLIANCE
- Local zoning compliance
- HOA regulations
- Environmental regulations

5. AMENDMENTS
- Agreement amendments require written consent
- Majority owner approval for major changes
- Notice requirements for modifications`,
  },
]

export function DocumentHandling({ data, updateData, onNext, canProceed, uploadMode = false }: DocumentHandlingProps) {
  const [selectedDoc, setSelectedDoc] = useState<string | null>(null)
  const [uploadedFiles, setUploadedFiles] = useState<{ [key: string]: File }>({})
  const [downloadedDocs, setDownloadedDocs] = useState<string[]>([])
  const [scrolledToEnd, setScrolledToEnd] = useState<{ [key: string]: boolean }>({})
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const handleScroll = () => {
    if (!scrollContainerRef.current || !selectedDoc) return

    const container = scrollContainerRef.current
    const scrollTop = container.scrollTop
    const scrollHeight = container.scrollHeight
    const clientHeight = container.clientHeight

    const scrollPercentage = (scrollTop / (scrollHeight - clientHeight)) * 100

    console.log("[v0] Scroll percentage:", scrollPercentage, "for doc:", selectedDoc)

    if (scrollPercentage >= 90 && !scrolledToEnd[selectedDoc]) {
      console.log("[v0] Document scrolled to end:", selectedDoc)
      setScrolledToEnd((prev) => ({ ...prev, [selectedDoc]: true }))

      if (!data.documentsRead.includes(selectedDoc)) {
        console.log("[v0] Adding document to read list:", selectedDoc)
        updateData({
          documentsRead: [...data.documentsRead, selectedDoc],
        })
      }
    }
  }

  const handleFileUpload = (docId: string, file: File) => {
    setUploadedFiles((prev) => ({ ...prev, [docId]: file }))
    if (!data.documentsUploaded.includes(docId)) {
      updateData({
        documentsUploaded: [...data.documentsUploaded, docId],
      })
    }
  }

  const handleDownload = (docId: string) => {
    const doc = documents.find((d) => d.id === docId)
    if (doc) {
      const blob = new Blob([doc.content], { type: "text/plain" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${doc.name.replace(/\s+/g, "_")}.txt`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      if (!downloadedDocs.includes(docId)) {
        setDownloadedDocs((prev) => [...prev, docId])
      }
    }
  }

  const totalDocs = documents.length
  const readProgress = (data.documentsRead.length / totalDocs) * 100
  const uploadProgress = (data.documentsUploaded.length / totalDocs) * 100
  const currentProgress = uploadMode ? uploadProgress : readProgress

  const getDocumentStatus = (docId: string) => {
    const isRead = data.documentsRead.includes(docId)
    const isUploaded = data.documentsUploaded.includes(docId)

    if (uploadMode) {
      if (isUploaded) return "completed"
      if (isRead) return "ready"
      return "pending"
    } else {
      if (isRead) return "completed"
      return "pending"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-emerald-500"
      case "ready":
        return "bg-blue-500"
      default:
        return "bg-gray-300"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-white" />
      case "ready":
        return <ArrowRight className="h-4 w-4 text-white" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const allDownloadsComplete = downloadedDocs.length === totalDocs
  const actualCanProceed = uploadMode
    ? data.documentsUploaded.length === totalDocs && allDownloadsComplete
    : data.documentsRead.length === totalDocs

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full text-sm font-medium">
          <FileText className="h-4 w-4" />
          {uploadMode ? "Stage 2: Document Upload" : "Stage 1: Document Review"}
        </div>
        <h2 className="text-3xl font-bold">{uploadMode ? "Upload Signed Documents" : "Review Required Documents"}</h2>
        <p className="text-muted-foreground text-lg">
          {uploadMode
            ? "Upload your signed documents to proceed with payment"
            : "Please read all documents carefully before downloading and signing"}
        </p>
      </div>

      <div className="bg-gradient-to-r from-emerald-50 to-blue-50 p-6 rounded-xl border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">{uploadMode ? "2" : "1"}</span>
            </div>
            <div>
              <h3 className="font-semibold text-lg">
                {uploadMode ? "Document Upload Progress" : "Document Reading Progress"}
              </h3>
              <p className="text-sm text-muted-foreground">
                {uploadMode
                  ? `${data.documentsUploaded.length} of ${totalDocs} documents uploaded`
                  : `${data.documentsRead.length} of ${totalDocs} documents read`}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-emerald-600">{Math.round(currentProgress)}%</div>
            <div className="text-sm text-muted-foreground">Complete</div>
          </div>
        </div>
        <Progress value={currentProgress} className="h-3" />
      </div>

      <div className="space-y-4">
        {documents.map((doc, index) => {
          const isRead = data.documentsRead.includes(doc.id)
          const isUploaded = data.documentsUploaded.includes(doc.id)
          const isDownloaded = downloadedDocs.includes(doc.id)
          const hasScrolledToEnd = scrolledToEnd[doc.id]
          const canDownload = isRead || uploadMode
          const status = getDocumentStatus(doc.id)

          return (
            <Card
              key={doc.id}
              className={`relative transition-all duration-200 ${
                status === "completed"
                  ? "ring-2 ring-emerald-200 bg-emerald-50/30"
                  : status === "ready"
                    ? "ring-2 ring-blue-200 bg-blue-50/30"
                    : "hover:shadow-md"
              }`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getStatusColor(status)}`}>
                      {status === "completed" || status === "ready" ? (
                        getStatusIcon(status)
                      ) : (
                        <span className="text-sm font-medium text-gray-600">{index + 1}</span>
                      )}
                    </div>
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        {doc.name}
                        {status === "completed" && (
                          <Badge variant="secondary" className="gap-1 bg-emerald-100 text-emerald-700">
                            <CheckCircle className="h-3 w-3" />
                            {uploadMode ? "Uploaded" : "Read"}
                          </Badge>
                        )}
                      </CardTitle>
                      <CardDescription>{doc.description}</CardDescription>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    {uploadMode && !isRead && (
                      <Badge variant="outline" className="text-xs">
                        Must read first
                      </Badge>
                    )}
                    {uploadMode && isRead && !isUploaded && (
                      <Badge className="bg-blue-500 text-white text-xs">Ready to upload</Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  {!uploadMode && (
                    <>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant={isRead ? "secondary" : "default"}
                            size="sm"
                            onClick={() => setSelectedDoc(doc.id)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            {hasScrolledToEnd || isRead ? "Read Again" : "Read Document"}
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[80vh]">
                          <DialogHeader>
                            <DialogTitle>{doc.name}</DialogTitle>
                            <DialogDescription>{doc.description}</DialogDescription>
                          </DialogHeader>
                          <div
                            ref={scrollContainerRef}
                            className="h-96 w-full rounded-md border overflow-auto p-4"
                            style={{ maxHeight: "400px" }}
                            onScroll={handleScroll}
                          >
                            <pre className="whitespace-pre-wrap text-sm leading-relaxed">{doc.content}</pre>
                            <div className="h-20 w-full" />
                          </div>
                          {!hasScrolledToEnd && !isRead && (
                            <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-md">
                              <AlertCircle className="h-4 w-4 text-amber-600" />
                              <span className="text-sm text-amber-700">Please scroll to the end to mark as read</span>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>

                      <Button
                        variant="outline"
                        size="sm"
                        disabled={!canDownload}
                        onClick={() => handleDownload(doc.id)}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        {isDownloaded ? "Downloaded" : "Download PDF"}
                      </Button>
                    </>
                  )}

                  {uploadMode && (
                    <div className="flex items-center gap-3 w-full">
                      {!isDownloaded && (
                        <Button variant="outline" size="sm" onClick={() => handleDownload(doc.id)} disabled={!isRead}>
                          <Download className="h-4 w-4 mr-2" />
                          Download Here
                        </Button>
                      )}

                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            handleFileUpload(doc.id, file)
                          }
                        }}
                        className="hidden"
                        id={`upload-${doc.id}`}
                        disabled={!isRead || !isDownloaded}
                      />
                      <label
                        htmlFor={`upload-${doc.id}`}
                        className={`flex items-center gap-2 px-4 py-2 border rounded-md cursor-pointer text-sm font-medium transition-colors ${
                          !isRead || !isDownloaded
                            ? "border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed"
                            : isUploaded
                              ? "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                              : "border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100"
                        }`}
                      >
                        <Upload className="h-4 w-4" />
                        {isUploaded ? "Replace File" : "Upload Signed"}
                      </label>

                      {!isRead && <span className="text-xs text-amber-600">Must read document first</span>}
                      {isRead && !isDownloaded && (
                        <span className="text-xs text-blue-600">Click "Download Here" first</span>
                      )}

                      {uploadedFiles[doc.id] && (
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-emerald-500" />
                          <span className="text-sm text-emerald-700 font-medium">{uploadedFiles[doc.id].name}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {!actualCanProceed && (
        <div className="flex items-center gap-3 p-6 bg-amber-50 border border-amber-200 rounded-xl">
          <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
            <AlertCircle className="h-5 w-5 text-amber-600" />
          </div>
          <div>
            <p className="font-medium text-amber-800">{uploadMode ? "Upload Required" : "Reading Required"}</p>
            <p className="text-sm text-amber-700">
              {uploadMode
                ? `Please download and upload all ${totalDocs} signed documents to continue. Downloads: ${downloadedDocs.length}/${totalDocs}, Uploads: ${data.documentsUploaded.length}/${totalDocs} completed.`
                : `Please read all ${totalDocs} documents completely before proceeding. ${data.documentsRead.length}/${totalDocs} completed.`}
            </p>
          </div>
        </div>
      )}

      <div className="flex justify-center pt-6">
        <Button
          onClick={onNext}
          disabled={!actualCanProceed}
          size="lg"
          className={`px-12 py-3 text-lg ${actualCanProceed ? "bg-emerald-600 hover:bg-emerald-700" : ""}`}
        >
          {actualCanProceed && <CheckCircle className="h-5 w-5 mr-2" />}
          {uploadMode ? "Continue to Payment" : "Continue to Upload"}
          {actualCanProceed && <ArrowRight className="h-5 w-5 ml-2" />}
        </Button>
      </div>
    </div>
  )
}
