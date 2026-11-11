"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ArrowRight, Leaf, BarChart2, MessageSquareText, Box, CheckCircle } from "lucide-react"
import ModelViewer3D from "@/components/model-viewer-3d"
import { getAuthUser, subscribeToAuth, type UserSession } from "@/lib/auth"
import { getEcoPoints, subscribeToEcoPoints } from "@/lib/points"

export default function Home() {
  const [is3DModalOpen, setIs3DModalOpen] = useState(false)
  const [user, setUser] = useState<UserSession | null>(null)
  const [ecoPoints, setEcoPoints] = useState(120)

  useEffect(() => {
    setUser(getAuthUser())
    setEcoPoints(getEcoPoints())
    const unsubAuth = subscribeToAuth(setUser)
    const unsubPoints = subscribeToEcoPoints(setEcoPoints)
    return () => {
      unsubAuth()
      unsubPoints()
    }
  }, [])
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  const features = [
    {
      icon: <Leaf className="h-6 w-6 text-leaf-light" />,
      title: "Carbon Tracking",
      description: "Upload images of waste to analyze their environmental impact and carbon footprint.",
      href: "/carbon-tracker",
    },
    {
      icon: <MessageSquareText className="h-6 w-6 text-leaf-light" />,
      title: "Ask-To-Answer",
      description: "Get AI-powered recommendations for sustainable waste disposal and recycling.",
      href: "/ask-to-answer",
    },
    {
      icon: <BarChart2 className="h-6 w-6 text-leaf-light" />,
      title: "Contribution Points",
      description: "Earn points for your eco-friendly actions and redeem them for rewards.",
      href: "/leaderboards",
    },
  ]

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="flex flex-col justify-center space-y-4"
            >
              <motion.div variants={item}>
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl md:text-6xl text-primary">
                  Transform Your Waste
                </h1>
              </motion.div>
              <motion.div variants={item}>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Trashformer helps you analyze waste images to determine their environmental contribution and earn
                  points for sustainability. Join our community of eco-conscious individuals making a difference.
                </p>
              </motion.div>
              <motion.div variants={item} className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="gap-2">
                  <Link href="/process">
                    Analyze Waste
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="gap-2"
                  onClick={() => setIs3DModalOpen(true)}
                >
                  <Box className="h-4 w-4" />
                  Explore 3D View
                </Button>
              </motion.div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex justify-center lg:justify-end"
            >
              <ModelViewer3D src="/model.glb" className="h-[420px] max-w-[520px] shadow-md" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-secondary/50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Our Features</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed">
                Discover how Trashformer helps you contribute to a sustainable future
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3 lg:gap-12 mt-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex flex-col items-center space-y-4 rounded-lg border bg-background p-6 shadow-sm"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold">{feature.title}</h3>
                <p className="text-muted-foreground text-center">{feature.description}</p>
                <Button asChild variant="link" className="mt-auto">
                  <Link href={feature.href}>
                    Learn more
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            {user ? (
              <>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                  <CheckCircle className="h-4 w-4" />
                  <span>Community Member • {ecoPoints} Eco Points</span>
                </div>
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                    Welcome back, {user.name}!
                  </h2>
                  <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed">
                    You&apos;re part of the Trashformer community. Upload waste to earn more Eco Points or redeem rewards.
                  </p>
                </div>
                <div className="flex flex-wrap justify-center gap-4 mt-4">
                  <Button asChild size="lg">
                    <Link href="/process">Process Waste &amp; Earn Points</Link>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <Link href="/redeem">Redeem Rewards ({ecoPoints} pts)</Link>
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                    Join Our Eco-Friendly Community
                  </h2>
                  <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed">
                    Start tracking your carbon footprint and earn rewards for sustainable actions
                  </p>
                </div>
                <Button asChild size="lg" className="mt-4">
                  <Link href="/login">Get Started</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </section>

      <Dialog open={is3DModalOpen} onOpenChange={setIs3DModalOpen}>
        <DialogContent className="sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle>Trashformer Smart Bin — 3D Model</DialogTitle>
            <DialogDescription>
              Inspect the 3D hardware prototype. Drag to rotate, scroll to zoom, and right-drag to pan.
            </DialogDescription>
          </DialogHeader>
          <div className="h-[520px] w-full">
            <ModelViewer3D src="/model.glb" className="h-full w-full" />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

