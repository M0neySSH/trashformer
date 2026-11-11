"use client"

import { useState, useEffect, useMemo } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Leaf, TrendingUp, Calendar, Users } from "lucide-react"
import {
  getEcoPoints,
  getWasteProcessedCount,
  getCommunityUsers,
  syncActiveUserToCommunity,
  subscribeToEcoPoints,
  type CommunityUserEntry,
} from "@/lib/points"
import { getAuthUser, subscribeToAuth, type UserSession } from "@/lib/auth"

export default function LeaderboardsPage() {
  const [timeframe, setTimeframe] = useState("weekly")
  const [userPoints, setUserPoints] = useState(120)
  const [processedCount, setProcessedCount] = useState(0)
  const [user, setUser] = useState<UserSession | null>(null)
  const [communityUsers, setCommunityUsers] = useState<CommunityUserEntry[]>([])

  useEffect(() => {
    const syncState = () => {
      const currentUser = getAuthUser()
      const pts = getEcoPoints()
      const processed = getWasteProcessedCount()
      if (currentUser) {
        syncActiveUserToCommunity(currentUser.name, pts, processed, currentUser.avatar)
      }
      setUser(currentUser)
      setUserPoints(pts)
      setProcessedCount(processed)
      setCommunityUsers(getCommunityUsers())
    }

    syncState()
    const unsubAuth = subscribeToAuth(syncState)
    const unsubPoints = subscribeToEcoPoints(syncState)
    return () => {
      unsubAuth()
      unsubPoints()
    }
  }, [])

  // Mock leaderboard data
  const leaderboardData = {
    weekly: [
      { rank: 1, name: "Alex Johnson", points: 320, avatar: "/placeholder.svg?height=40&width=40", change: "up" },
      { rank: 2, name: "Samantha Lee", points: 285, avatar: "/placeholder.svg?height=40&width=40", change: "up" },
      { rank: 3, name: "Michael Chen", points: 260, avatar: "/placeholder.svg?height=40&width=40", change: "down" },
      { rank: 4, name: "Emma Rodriguez", points: 245, avatar: "/placeholder.svg?height=40&width=40", change: "same" },
      { rank: 5, name: "David Wilson", points: 230, avatar: "/placeholder.svg?height=40&width=40", change: "up" },
      { rank: 6, name: "Priya Sharma", points: 210, avatar: "/placeholder.svg?height=40&width=40", change: "down" },
      { rank: 7, name: "James Taylor", points: 195, avatar: "/placeholder.svg?height=40&width=40", change: "up" },
      { rank: 8, name: "Olivia Brown", points: 180, avatar: "/placeholder.svg?height=40&width=40", change: "same" },
      { rank: 9, name: "Daniel Kim", points: 165, avatar: "/placeholder.svg?height=40&width=40", change: "down" },
      { rank: 10, name: "Sophia Martinez", points: 150, avatar: "/placeholder.svg?height=40&width=40", change: "up" },
    ],
    monthly: [
      { rank: 1, name: "Samantha Lee", points: 1250, avatar: "/placeholder.svg?height=40&width=40", change: "up" },
      { rank: 2, name: "Alex Johnson", points: 1120, avatar: "/placeholder.svg?height=40&width=40", change: "down" },
      { rank: 3, name: "David Wilson", points: 980, avatar: "/placeholder.svg?height=40&width=40", change: "up" },
      { rank: 4, name: "Michael Chen", points: 920, avatar: "/placeholder.svg?height=40&width=40", change: "same" },
      { rank: 5, name: "Emma Rodriguez", points: 870, avatar: "/placeholder.svg?height=40&width=40", change: "up" },
      { rank: 6, name: "James Taylor", points: 810, avatar: "/placeholder.svg?height=40&width=40", change: "up" },
      { rank: 7, name: "Priya Sharma", points: 780, avatar: "/placeholder.svg?height=40&width=40", change: "down" },
      { rank: 8, name: "Sophia Martinez", points: 720, avatar: "/placeholder.svg?height=40&width=40", change: "up" },
      { rank: 9, name: "Olivia Brown", points: 690, avatar: "/placeholder.svg?height=40&width=40", change: "down" },
      { rank: 10, name: "Daniel Kim", points: 650, avatar: "/placeholder.svg?height=40&width=40", change: "same" },
    ],
    allTime: [
      { rank: 1, name: "Alex Johnson", points: 5840, avatar: "/placeholder.svg?height=40&width=40", change: "same" },
      { rank: 2, name: "Samantha Lee", points: 5320, avatar: "/placeholder.svg?height=40&width=40", change: "up" },
      { rank: 3, name: "David Wilson", points: 4950, avatar: "/placeholder.svg?height=40&width=40", change: "up" },
      { rank: 4, name: "Priya Sharma", points: 4680, avatar: "/placeholder.svg?height=40&width=40", change: "down" },
      { rank: 5, name: "Michael Chen", points: 4510, avatar: "/placeholder.svg?height=40&width=40", change: "down" },
      { rank: 6, name: "Emma Rodriguez", points: 4320, avatar: "/placeholder.svg?height=40&width=40", change: "same" },
      { rank: 7, name: "James Taylor", points: 3980, avatar: "/placeholder.svg?height=40&width=40", change: "up" },
      { rank: 8, name: "Sophia Martinez", points: 3750, avatar: "/placeholder.svg?height=40&width=40", change: "up" },
      { rank: 9, name: "Olivia Brown", points: 3620, avatar: "/placeholder.svg?height=40&width=40", change: "same" },
      { rank: 10, name: "Daniel Kim", points: 3480, avatar: "/placeholder.svg?height=40&width=40", change: "down" },
    ],
  }

  const activeLeaderboard = useMemo(() => {
    const baseEntries = leaderboardData[timeframe as keyof typeof leaderboardData].map((entry) => ({
      ...entry,
      isCurrentUser: false,
      isCommunityMember: false,
    }))

    const communityEntries = communityUsers.map((cu) => ({
      rank: 0,
      name: cu.name,
      points: cu.points,
      avatar: cu.avatar || "/placeholder.svg?height=40&width=40",
      change: "up",
      isCurrentUser: Boolean(user && cu.name.toLowerCase() === user.name.toLowerCase()),
      isCommunityMember: true,
    }))

    const merged = [...baseEntries, ...communityEntries].sort((a, b) => b.points - a.points)
    return merged.map((entry, idx) => ({
      ...entry,
      rank: idx + 1,
    }))
  }, [timeframe, communityUsers, user])

  const myRankingEntry = activeLeaderboard.find((e) => e.isCurrentUser)
  const aboveEntry =
    myRankingEntry && myRankingEntry.rank > 1 ? activeLeaderboard[myRankingEntry.rank - 2] : null

  const getChangeIcon = (change: string) => {
    switch (change) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-green-500" />
      case "down":
        return <TrendingUp className="h-4 w-4 text-red-500 transform rotate-180" />
      default:
        return null
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
        <h1 className="text-4xl font-bold tracking-tight">Leaderboards</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          See who's making the biggest impact in our eco-friendly community.
        </p>
      </motion.div>

      <div className="grid gap-8 md:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="col-span-full md:col-span-2"
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Leaf className="h-5 w-5 text-leaf-light" />
                  Top Contributors
                </CardTitle>
                <Tabs value={timeframe} onValueChange={setTimeframe}>
                  <TabsList>
                    <TabsTrigger value="weekly" className="text-xs">
                      <Calendar className="h-3 w-3 mr-1" />
                      Weekly
                    </TabsTrigger>
                    <TabsTrigger value="monthly" className="text-xs">
                      <Calendar className="h-3 w-3 mr-1" />
                      Monthly
                    </TabsTrigger>
                    <TabsTrigger value="allTime" className="text-xs">
                      <Calendar className="h-3 w-3 mr-1" />
                      All Time
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              <CardDescription>Users ranked by contribution points</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {activeLeaderboard.map((entry, index) => (
                  <motion.div
                    key={`${entry.name}-${entry.isCommunityMember ? "member" : "mock"}-${index}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.03 }}
                    className={`flex items-center justify-between p-3 rounded-lg border ${
                      entry.isCurrentUser ? "border-primary bg-primary/5" : ""
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm">
                        {entry.rank}
                      </div>
                      <Avatar>
                        <AvatarImage src={entry.avatar} alt={entry.name} />
                        <AvatarFallback>{entry.name.charAt(0).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{entry.name}</p>
                          {entry.isCurrentUser && (
                            <Badge variant="default" className="text-[10px] px-1.5 py-0">
                              You
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <span>Rank {entry.rank}</span>
                          {getChangeIcon(entry.change)}
                        </div>
                      </div>
                    </div>
                    <Badge variant={entry.isCurrentUser ? "default" : "secondary"} className="px-3 py-1">
                      {entry.points} points
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="col-span-full md:col-span-1"
        >
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Community Stats
                </CardTitle>
                <CardDescription>Overall community impact</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Total Users</span>
                    <span className="font-medium">1,245</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Active Contributors</span>
                    <span className="font-medium">876</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Waste Analyzed</span>
                    <span className="font-medium">12,450 kg</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>CO2 Saved</span>
                    <span className="font-medium">3,240 kg</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Leaf className="h-5 w-5 text-leaf-light" />
                  Your Ranking
                </CardTitle>
                <CardDescription>Your contribution stats</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {user ? (
                  <>
                    <div className="p-4 rounded-lg bg-secondary/50 text-center">
                      <p className="text-sm text-muted-foreground mb-1">{user.name}&apos;s Current Rank</p>
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-3xl font-bold">#{myRankingEntry?.rank ?? activeLeaderboard.length}</span>
                        <TrendingUp className="h-5 w-5 text-green-500" />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {myRankingEntry?.rank === 1 ? "Top contributor!" : "Ranked live by your Eco Points"}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Your Points</span>
                        <span className="font-medium">{userPoints}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Waste Processed</span>
                        <span className="font-medium">{processedCount} items</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>CO2 Impact Reduced</span>
                        <span className="font-medium">{(processedCount * 0.8).toFixed(1)} kg</span>
                      </div>
                    </div>

                    <div className="rounded-lg border p-3">
                      <p className="text-sm font-medium mb-2">Next Milestone</p>
                      {aboveEntry ? (
                        <div className="space-y-2">
                          <p className="text-xs text-muted-foreground">
                            Pass {aboveEntry.name} ({aboveEntry.points} pts) for rank #{aboveEntry.rank}
                          </p>
                          <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary rounded-full"
                              style={{
                                width: `${Math.min(100, Math.round((userPoints / Math.max(1, aboveEntry.points)) * 100))}%`,
                              }}
                            ></div>
                          </div>
                          <p className="text-xs text-right text-muted-foreground">
                            {Math.max(1, aboveEntry.points - userPoints + 1)} points to go
                          </p>
                        </div>
                      ) : (
                        <p className="text-xs text-primary font-medium">
                          You are #1 on this leaderboard!
                        </p>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="p-4 rounded-lg bg-secondary/40 text-center space-y-3">
                    <p className="text-sm text-muted-foreground">
                      Sign in to track your Eco Points, waste processed count, and community rank.
                    </p>
                    <Button asChild className="w-full">
                      <Link href="/login">Join &amp; Sign In</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

