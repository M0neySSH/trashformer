"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { MessageSquare, Send, Lightbulb, AlertTriangle } from "lucide-react"
import { toast } from "sonner"
import ImageUpload from "@/components/image-upload"
import { invoke_llm } from "@/lib/llm"
import { SYSTEM_PROMPTS } from "@/lib/prompts"
import { getImageAsBase64 } from "@/lib/utils"

interface AskToAnswerSchema {
  is_waste: boolean;
  rejection_reason?: string;
  suggestions: [string, string, string, string, string];
}

export default function AskToAnswerPage() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [query, setQuery] = useState("")
  const [rejectionError, setRejectionError] = useState<string | null>(null)

  const handleImageSelected = (file: File) => {
    setSelectedFile(file)
    setSuggestions([])
    setRejectionError(null)
  }

  const handleSuggest = async () => {
    if (!selectedFile && !query) return

    setIsGenerating(true)
    setRejectionError(null)

    try {
      let b64image = ""
      if (selectedFile) {
        b64image = await getImageAsBase64(selectedFile);
      }

      const resp = await invoke_llm(SYSTEM_PROMPTS.ASK_TO_ANSWER, query, b64image)
      const cleaned = resp.replace(/```(?:json)?/gi, "").trim();
      const parsedResults: AskToAnswerSchema = JSON.parse(cleaned)
      if (parsedResults.is_waste !== true || Boolean(parsedResults.rejection_reason?.trim())) {
        const msg = parsedResults.rejection_reason?.trim() || "This image does not appear to contain waste. Please upload an image of waste or recyclable items.";
        toast.error(msg);
        setRejectionError(msg);
        setSuggestions([]);
        return;
      }
      setSuggestions(parsedResults.suggestions)
    } catch (error: any) {
      console.error("Error occurred at LLM or while parsing:", error)
      toast.error(error?.message || "Failed to generate suggestions. Please try again.")
      setSuggestions([])
    } finally {
      setIsGenerating(false)
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
        <h1 className="text-4xl font-bold tracking-tight">Ask-To-Answer</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Get AI-powered suggestions for waste disposal and recycling recommendations.
        </p>
      </motion.div>

      <div className="grid gap-8 md:grid-cols-2">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Ask a Question</CardTitle>
              <CardDescription>Upload an image of waste and/or ask a specific question</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ImageUpload onImageSelected={handleImageSelected} buttonText="Upload Image" />
              <div className="space-y-2">
                <label htmlFor="query" className="text-sm font-medium">
                  Your Question (Optional)
                </label>
                <Textarea
                  id="query"
                  placeholder="How should I recycle this item? What's the best way to dispose of this waste?"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="resize-none"
                  rows={4}
                />
              </div>
              <Button onClick={handleSuggest} disabled={(!selectedFile && !query) || isGenerating} className="w-full mt-4 gap-2">
                {isGenerating ? "Generating Suggestions..." : "Get Suggestions"}
                <Send className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Suggestions</CardTitle>
              <CardDescription>AI-powered recommendations for waste disposal and recycling</CardDescription>
            </CardHeader>
            <CardContent>
              {isGenerating ? (
                <div className="flex flex-col items-center justify-center h-64 space-y-4">
                  <div className="w-16 h-16 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
                  <p className="text-muted-foreground">Generating suggestions...</p>
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
              ) : suggestions.length > 0 ? (
                <div className="space-y-4">
                  {suggestions.map((suggestion, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="flex items-start gap-3 p-4 rounded-lg bg-secondary/50"
                    >
                      <Lightbulb className="h-5 w-5 text-amber-500 mt-0.5" />
                      <p className="text-sm">{suggestion}</p>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 space-y-4 text-center">
                  <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center">
                    <MessageSquare className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">No Suggestions Yet</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Upload an image and/or ask a question to get recycling and disposal recommendations
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
