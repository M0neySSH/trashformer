"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import Link from "next/link"
import { Leaf, ShoppingBag, Tag } from "lucide-react"
import { toast } from "sonner"
import { getEcoPoints, deductEcoPoints, subscribeToEcoPoints } from "@/lib/points"
import { getAuthUser, subscribeToAuth, type UserSession } from "@/lib/auth"

export default function RedeemPage() {
  const [selectedReward, setSelectedReward] = useState<any>(null)
  const [points, setPoints] = useState<number>(120)
  const [user, setUser] = useState<UserSession | null>(null)

  useEffect(() => {
    setUser(getAuthUser())
    setPoints(getEcoPoints())
    const unsubAuth = subscribeToAuth(setUser)
    const unsubPoints = subscribeToEcoPoints(setPoints)
    return () => {
      unsubAuth()
      unsubPoints()
    }
  }, [])

  // Mock rewards data
  const rewards = {
    discounts: [
      {
        id: 1,
        title: "10% Off Upto Rs. 8000 ",
        description: "Get 10% off on Electricity Bills",
        points: 5000,
        image: "/shop/electricity-bill-voucher.png",
        provider: "   Uttarakhand power corporation limited",
        expiresIn: "30 days",
      },
      {
        id: 2,
        title: "Discount on Pharmacy bills upto 10% ",
        description: "Get instant 10% off on Pharmacy Bills",
        points: 8000,
        image: "/shop/pharmacy-bill-voucher.png",
        provider: "Pradhan Mantri Bhartiya Janaushadhi Pariyojana (PMBJP) Kendras",
        expiresIn: "60 days",
      },
      {
        id: 3,
        title: "Save Upto 7% on Tolls",
        description: "Save Upto 7% on Tolls",
        points: 6000,
        image: "/shop/toll-plaza-voucher.png",
        provider: "National Highways Authority of India",
        expiresIn: "45 days",
      },
    ],
    products: [
      {
        id: 4,
        title: "Green Reward: Get a Free Plant",
        description: "Earn Eco Points and Reedem them for a Free Plant!",
        points: 2000,
        image: "/shop/green-plant-voucher.png",
        provider: "Ministry of Agriculture & Farmer Welfare(MoA&FW)",
        shipping: "Free shipping",
      },
      {
        id: 5,
        title: "Get Recycled Notebook",
        description: "Notebook made from 100% recycled paper",
        points: 2500,
        image: "/shop/recycled-notebook-voucher.png",
        provider: "GreenStationery",
        shipping: "free shipping",
      },
      {
        id: 6,
        title: "Eco Rewards: Get DIY Products",
        description: "Earn Eco Points & Reedem them for Sustainable DIY Products",
        points: 3000,
        image: "/shop/diy-voucher.png",
        provider: "Environmental Conservation Association",
        shipping: "No shipping required",
      },
    ],
    experiences: [
      {
        id: 7,
        title: "Virtual Sustainability Workshop",
        description: "Join an online workshop about sustainable living",
        points: 90,
        image: "/placeholder.svg?height=100&width=100",
        provider: "EcoLearn",
        date: "Multiple dates available",
      },
      {
        id: 8,
        title: "Community Garden Day Pass",
        description: "One-day pass to participate in a local community garden",
        points: 110,
        image: "/placeholder.svg?height=100&width=100",
        provider: "Urban Gardens",
        date: "Valid for 3 months",
      },
      {
        id: 9,
        title: "Eco-Tour Discount",
        description: "50% off on guided tours of local conservation areas",
        points: 200,
        image: "/placeholder.svg?height=100&width=100",
        provider: "Nature Tours",
        date: "Seasonal availability",
      },
    ],
  }

  const handleRedeemReward = () => {
    if (!user) {
      toast.error("Login Required", {
        description: "Please sign in first to redeem Eco Points.",
      })
      return
    }
    if (!selectedReward) return
    const result = deductEcoPoints(selectedReward.points)
    if (!result.success) {
      toast.error("Insufficient Points", {
        description: `You need ${selectedReward.points - points} more points to redeem this reward.`,
      })
      return
    }

    setPoints(result.balance)
    toast.success("Reward Redeemed!", {
      description: `You've successfully redeemed ${selectedReward.title}. Remaining balance: ${result.balance} points.`,
    })

    setSelectedReward(null)
  }

  return (
    <div className="container py-12 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-4 text-center"
      >
        <h1 className="text-4xl font-bold tracking-tight">Redeem Points</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Use your contribution points to claim eco-friendly rewards and discounts.
        </p>
      </motion.div>

      <div className="flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <Leaf className="h-5 w-5 text-leaf-light" />
              Your Points Balance
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            {user ? (
              <>
                <div className="text-5xl font-bold mb-2">{points}</div>
                <p className="text-muted-foreground">Available eco contribution points</p>
              </>
            ) : (
              <>
                <p className="text-sm text-muted-foreground text-center mb-4">
                  Sign in to view your Eco Points balance and redeem sustainable rewards.
                </p>
                <Button asChild>
                  <Link href="/login">Login to View Points</Link>
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="discounts">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="discounts" className="flex items-center gap-1 cursor-pointer">
            <Tag className="h-4 w-4" />
            <span>Discounts</span>
          </TabsTrigger>
          <TabsTrigger value="products" className="flex items-center gap-1 cursor-pointer">
            <ShoppingBag className="h-4 w-4" />
            <span>Products</span>
          </TabsTrigger>
          <TabsTrigger value="experiences" className="flex items-center gap-1 cursor-pointer">
            <Leaf className="h-4 w-4" />
            <span>Experiences</span>
          </TabsTrigger>
        </TabsList>

        {Object.entries(rewards).map(([category, items]) => (
          <TabsContent key={category} value={category} className="mt-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {items.map((reward, index) => (
                <motion.div
                  key={reward.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className="h-full flex flex-col">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-base">{reward.title}</CardTitle>
                          <CardDescription className="text-xs mt-1">Provided by {reward.provider}</CardDescription>
                        </div>
                        <Badge variant={points >= reward.points ? "default" : "secondary"}>
                          {reward.points} pts
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="flex-1">
                      <div className="aspect-square rounded-md overflow-hidden mb-4">
                        <img
                          src={reward.image || "/placeholder.svg"}
                          alt={reward.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <p className="text-sm text-muted-foreground">{reward.description}</p>
                      <div className="mt-2 text-xs text-muted-foreground">
                        {reward.expiresIn && (
                          <div className="flex items-center gap-1">
                            <span>Expires in: {reward.expiresIn}</span>
                          </div>
                        )}
                        {reward.shipping && (
                          <div className="flex items-center gap-1">
                            <span>{reward.shipping}</span>
                          </div>
                        )}
                        {reward.date && (
                          <div className="flex items-center gap-1">
                            <span>{reward.date}</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant={points >= reward.points ? "default" : "outline"}
                            className="w-full"
                            onClick={() => setSelectedReward(reward)}
                          >
                            {points >= reward.points ? "Redeem" : "Not Enough Points"}
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Redeem Reward</DialogTitle>
                            <DialogDescription>Are you sure you want to redeem this reward?</DialogDescription>
                          </DialogHeader>
                          {selectedReward && (
                            <div className="flex items-center gap-4 py-4">
                              <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                                <img
                                  src={selectedReward.image || "/placeholder.svg"}
                                  alt={selectedReward.title}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div>
                                <h4 className="font-medium">{selectedReward.title}</h4>
                                <p className="text-sm text-muted-foreground">{selectedReward.description}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <Badge variant="outline">{selectedReward.points} points</Badge>
                                  <span className="text-xs text-muted-foreground">from {selectedReward.provider}</span>
                                </div>
                              </div>
                            </div>
                          )}
                          <div className="bg-secondary/50 rounded-lg p-3 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Leaf className="h-4 w-4 text-leaf-light" />
                              <span className="text-sm font-medium">Your current balance</span>
                            </div>
                            <span className="font-bold">{points} points</span>
                          </div>
                          <DialogFooter className="gap-2 sm:gap-0">
                            <Button variant="outline" onClick={() => setSelectedReward(null)}>
                              Cancel
                            </Button>
                            <Button onClick={handleRedeemReward}>Confirm Redemption</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}

