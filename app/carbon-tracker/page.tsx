"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Leaf, AlertTriangle, Info } from "lucide-react"
import { toast } from "sonner"
import ImageUpload from "@/components/image-upload"
import { invoke_llm } from "@/lib/llm"
import { SYSTEM_PROMPTS } from "@/lib/prompts"
import { getImageAsBase64 } from "@/lib/utils"

interface CarbonTrackerSchema {
  is_waste: boolean;
  rejection_reason?: string;
  carbon_footprint: number;
  impact_score: number;
  meaning: string;
  composition: [number, number, number, number];
  recommendation: ["Recycling" | "Reducing" | "Reusing", string];
  facts: [string, string, string];
}

export default function CarbonTrackerPage() {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisComplete, setAnalysisComplete] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [analysisResults, setAnalysisResults] = useState<CarbonTrackerSchema | null>(null)
  const [rejectionError, setRejectionError] = useState<string | null>(null)

  const handleImageSelected = (file: File) => {
    setSelectedFile(file)
    setAnalysisComplete(false)
    setRejectionError(null)
  }

  const handleTrackCarbon = async () => {
    if (!selectedFile) return

    setIsAnalyzing(true)
    setRejectionError(null)

    try {
      const b64image = await getImageAsBase64(selectedFile);
      const resp = await invoke_llm(SYSTEM_PROMPTS.CARBON_TRACKER, "Please analyze this attached image.", b64image);
      const cleaned = resp.replace(/```(?:json)?/gi, "").trim();
      const parsedResults: CarbonTrackerSchema = JSON.parse(cleaned);
      const isRejected =
        parsedResults.is_waste !== true ||
        Boolean(parsedResults.rejection_reason?.trim()) ||
        (parsedResults.carbon_footprint === 0 && parsedResults.impact_score === 0) ||
        parsedResults.composition?.every((v) => v === 0) ||
        parsedResults.recommendation?.[1]?.toLowerCase().includes("no waste");

      if (isRejected) {
        const msg =
          parsedResults.rejection_reason?.trim() ||
          (parsedResults.recommendation?.[1]?.toLowerCase().includes("no waste")
            ? parsedResults.recommendation[1]
            : "") ||
          "The uploaded image does not appear to contain waste or recyclable materials. Please upload an image of waste.";
        toast.error(msg);
        setRejectionError(msg);
        setAnalysisResults(null);
        setAnalysisComplete(false);
        return;
      }
      setAnalysisResults(parsedResults);
      setAnalysisComplete(true);
    } catch (error: any) {
      console.error("Error occurred during carbon tracking:", error);
      toast.error(error?.message || "Failed to analyze image. Please try again.");
      setAnalysisResults(null);
      setAnalysisComplete(false);
    } finally {
      setIsAnalyzing(false);
    }
  }

  return (
    <div className="container py-12 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-4 text-center"
      >
        <h1 className="text-4xl font-bold tracking-tight">Carbon Footprint Tracker</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Upload an image of waste to analyze its environmental impact and carbon footprint.
        </p>
      </motion.div>

      <div className="grid gap-8 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Upload Waste Image</CardTitle>
              <CardDescription>Take a photo of waste or upload an existing image for analysis</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ImageUpload onImageSelected={handleImageSelected} buttonText="Select Image" />

              <Button onClick={handleTrackCarbon} disabled={!selectedFile || isAnalyzing} className="w-full mt-4">
                {isAnalyzing ? "Analyzing..." : "Track Carbon Footprint"}
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Analysis Results</CardTitle>
              <CardDescription>
                {analysisComplete
                  ? "Environmental impact assessment of your waste"
                  : "Upload an image and click 'Track Carbon Footprint' to see results"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isAnalyzing ? (
                <div className="flex flex-col items-center justify-center h-64 space-y-4">
                  <div className="w-16 h-16 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
                  <p className="text-muted-foreground">Analyzing your waste image...</p>
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
              ) : analysisComplete ? (
                <Tabs defaultValue="footprint">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="footprint">Footprint</TabsTrigger>
                    <TabsTrigger value="breakdown">Breakdown</TabsTrigger>
                    <TabsTrigger value="facts">Facts</TabsTrigger>
                  </TabsList>

                  <TabsContent value="footprint" className="space-y-4 pt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-medium">Carbon Footprint</h3>
                        <p className="text-sm text-muted-foreground">Estimated CO2 equivalent</p>
                      </div>
                      <div className="flex items-center gap-2 bg-primary/10 px-3 py-1 rounded-full">
                        <Leaf className="h-4 w-4 text-leaf-light" />
                        <span className="font-bold">{analysisResults?.carbon_footprint} kg CO2e</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Low Impact</span>
                        <span>High Impact</span>
                      </div>
                      <div className="relative h-2 w-full bg-secondary rounded-full overflow-hidden">
                        <div
                          className="absolute h-full bg-primary rounded-full"
                          style={{ width: `${analysisResults!.impact_score * 100}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="rounded-lg border p-4 mt-4">
                      <div className="flex items-start gap-3">
                        <Info className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <h4 className="font-medium">What does this mean?</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            {analysisResults?.meaning}
                          </p>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="breakdown" className="space-y-4 pt-4">
                    <h3 className="text-lg font-medium">Waste Composition</h3>
                    <div className="space-y-3">
                      {["Plastic", "Paper", "Organic", "Metal"].map((item, index) => (
                        <div key={index} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>{item}</span>
                            <span>{(analysisResults?.composition!?.[index]) * 100}%</span>
                          </div>
                          <Progress value={(analysisResults?.composition!?.[index]) * 100} className="h-2" />
                        </div>
                      ))}
                    </div>

                    <div className="rounded-lg border p-4 mt-4">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
                        <div>
                          <h4 className="font-medium">{analysisResults?.recommendation?.[0]} Recommendation</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            {analysisResults?.recommendation?.[1]}
                          </p>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="facts" className="space-y-4 pt-4">
                    <h3 className="text-lg font-medium">Sustainability Facts</h3>
                    <div className="space-y-4">
                      {analysisResults?.facts.map((fact, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50">
                          <Leaf className="h-5 w-5 text-leaf-light mt-0.5" />
                          <p className="text-sm">{fact}</p>
                        </div>
                      ))}
                    </div>

                    <div className="rounded-lg border p-4 mt-4">
                      <div className="flex items-start gap-3">
                        <Info className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <h4 className="font-medium">Take Action</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            Small changes in waste management can have a significant impact on the environment. Consider
                            reducing, reusing, and recycling whenever possible.
                          </p>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 space-y-4 text-center">
                  <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center">
                    <Leaf className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">No Analysis Results Yet</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Upload an image and track its carbon footprint to see the analysis
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

