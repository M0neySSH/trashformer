"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover" 
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Leaf, Recycle, AlertTriangle, CheckCircle } from "lucide-react"
import ImageUpload from "@/components/image-upload"
import { toast } from "sonner"
import Link from "next/link"
import { invoke_llm } from "@/lib/llm"
import { SYSTEM_PROMPTS } from "@/lib/prompts"
import { getImageAsBase64 } from "@/lib/utils"
import { addEcoPoints } from "@/lib/points"
import { getAuthUser, subscribeToAuth } from "@/lib/auth"

interface WasteProcessingSchema {
  is_waste: boolean;
  rejection_reason?: string;
  classification: string;
  recyclability_percentage: number;
  composition: [string, number][];
  contribution_score: number;
  reason: string;
  recommendations: [string, string, string];
}

const useRequireAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [authChecked, setAuthChecked] = useState(false)

  useEffect(() => {
    setIsAuthenticated(Boolean(getAuthUser()))
    setAuthChecked(true)
    return subscribeToAuth((u) => setIsAuthenticated(Boolean(u)))
  }, [])

  return { isAuthenticated, authChecked }
}

export default function ProcessPage() {
  const { isAuthenticated, authChecked } = useRequireAuth()

  const [isProcessing, setIsProcessing] = useState(false)
  const [processComplete, setProcessComplete] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [processingResults, setProcessingResults] = useState<WasteProcessingSchema | null>(null);
  const [rejectionError, setRejectionError] = useState<string | null>(null);
  const [pointsClaimed, setPointsClaimed] = useState(false);

  const handleImageSelected = (file: File) => {
    setSelectedFile(file)
    setProcessComplete(false)
    setRejectionError(null)
    setPointsClaimed(false)
  }

  const handleClaimPoints = () => {
    if (!processingResults || pointsClaimed) return;
    const newTotal = addEcoPoints(processingResults.contribution_score);
    setPointsClaimed(true);
    toast.success(`Claimed +${processingResults.contribution_score} Eco Points!`, {
      description: `Your updated balance is ${newTotal} points.`,
    });
  }

  const handleProcessWaste = async () => {
    if (!selectedFile) return;
    setIsProcessing(true);
    setRejectionError(null);
    setPointsClaimed(false);

    try {
      const b64image = await getImageAsBase64(selectedFile);
      const resp = await invoke_llm(SYSTEM_PROMPTS.WASTE_PROCESSING, "Please analyze this attached image.", b64image);
      const cleaned = resp.replace(/```(?:json)?/gi, "").trim();
      const parsedResults: WasteProcessingSchema = JSON.parse(cleaned);
      const isRejected =
        parsedResults.is_waste !== true ||
        Boolean(parsedResults.rejection_reason?.trim()) ||
        parsedResults.classification?.toLowerCase().includes("not waste") ||
        parsedResults.contribution_score === 0 ||
        parsedResults.reason?.toLowerCase().includes("no waste");

      if (isRejected) {
        const msg =
          parsedResults.rejection_reason?.trim() ||
          "The uploaded image does not appear to contain waste or recyclable materials. Please upload a clear image of waste.";
        toast.error(msg);
        setRejectionError(msg);
        setProcessingResults(null);
        setProcessComplete(false);
        return;
      }
      setProcessingResults(parsedResults);
      setProcessComplete(true);
    } catch (error: any) {
      console.error("Error occurred while processing:", error);
      toast.error(error?.message || "Failed to process waste image. Please try again.");
      setProcessingResults(null);
      setProcessComplete(false);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!authChecked) {
    return null
  }

  if (!isAuthenticated) {
    return (
      <div className="container py-12">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>You need to be logged in to process waste and claim Eco Points</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button asChild className="w-full">
              <Link href="/login">Login to Continue</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="container py-12 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-4 text-center"
      >
        <h1 className="text-4xl font-bold tracking-tight">Process Waste</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Upload images of waste for analysis and earn contribution points for sustainable actions.
        </p>
      </motion.div>

      <div className="grid gap-8 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Upload Waste Image</CardTitle>
              <CardDescription>Take a photo of waste or upload an existing image for processing</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ImageUpload onImageSelected={handleImageSelected} buttonText="Select Image" />
              <Button onClick={handleProcessWaste} disabled={!selectedFile || isProcessing} className="w-full mt-4">
                {isProcessing ? "Processing..." : "Process Waste"}
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Processing Results</CardTitle>
              <CardDescription>
                {processComplete
                  ? "Detailed breakdown of your waste and earned points"
                  : "Upload an image and click 'Process Waste' to see results"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isProcessing ? (
                <div className="flex flex-col items-center justify-center h-64 space-y-4">
                  <div className="w-16 h-16 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
                  <p className="text-muted-foreground">Processing your waste image...</p>
                </div>
              ) : rejectionError ? (
                <div className="flex flex-col items-center justify-center h-64 space-y-4 text-center p-4">
                  <div className="w-16 h-16 rounded-full bg-destructive/15 flex items-center justify-center">
                    <AlertTriangle className="h-8 w-8 text-destructive" />
                  </div>
                  <div className="space-y-1 max-w-md">
                    <p className="font-semibold text-destructive">Image Denied — Not Waste</p>
                    <p className="text-sm text-muted-foreground">{rejectionError}</p>
                  </div>
                </div>
              ) : processComplete ? (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium">{processingResults?.classification}</h3>
                      <p className="text-sm text-muted-foreground">Waste classification</p>
                    </div>
                    <Badge
                      variant={(processingResults!?.recyclability_percentage * 100) > 50 ? "default" : "destructive"}
                      className="px-3 py-1"
                    >
                      {(processingResults!?.recyclability_percentage * 100)}% Recyclable
                    </Badge>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Waste Composition</h4>
                    <div className="space-y-3">
                      {processingResults?.composition.map((component, index) => (
                        <div key={index} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="flex items-center gap-1">
                              {component?.[0]}
                              {(component?.[1] !== Math.min(...processingResults.composition.map(item => item[1]))) ? (
                                <CheckCircle className="h-3 w-3 text-green-500" />
                              ) : (
                                <AlertTriangle className="h-3 w-3 text-amber-500" />
                              )}
                            </span>
                            <span>{component?.[1] * 100}%</span>
                          </div>
                          <Progress value={component?.[1] * 100} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-lg border p-4 bg-secondary/30 space-y-3">
                    <div className="flex items-center gap-2">
                      <Leaf className="h-5 w-5 text-leaf-light" />
                      <h4 className="font-medium">Contribution Points Awarded</h4>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm text-muted-foreground">For proper waste classification and recycling</p>  
                        <Badge variant="outline" className="text-lg px-3 py-1">
                          <Popover>
                            <PopoverTrigger aria-label="View contribution score reasoning">
                              +{processingResults?.contribution_score} points
                            </PopoverTrigger>
                            <PopoverContent className="mt-2">{processingResults?.reason}</PopoverContent>
                          </Popover>
                        </Badge>
                    </div>
                    <div className="flex items-center justify-between gap-3 pt-1">
                      <Button
                        type="button"
                        onClick={handleClaimPoints}
                        disabled={pointsClaimed}
                        className="w-full"
                        variant={pointsClaimed ? "secondary" : "default"}
                      >
                        {pointsClaimed
                          ? `Claimed +${processingResults?.contribution_score} Eco Points ✓`
                          : `Claim +${processingResults?.contribution_score} Eco Points`}
                      </Button>
                      {pointsClaimed && (
                        <Button asChild variant="outline" className="shrink-0">
                          <Link href="/redeem">Redeem</Link>
                        </Button>
                      )}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Recommendations</h4>
                    <ul className="space-y-2">
                      {processingResults?.recommendations.map((recommendation, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <Recycle className="h-4 w-4 text-primary mt-0.5" />
                          <span>{recommendation}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 space-y-4 text-center">
                  <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center">
                    <Recycle className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">No Processing Results Yet</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Upload an image and process it to see the detailed breakdown
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

