"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Leaf, Code2, Rocket, Users, Server, Database, Bot, BarChart2, ArrowBigDown } from "lucide-react"
import { Separator } from "@/components/ui/separator";

const StepCard = ({ text }: { text: string }) => (
  <Card className="w-full max-w-xl mx-auto">
    <CardContent className="p-4 text-center font-medium">{text}</CardContent>
  </Card>
);

export default function AboutPage() {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <div className="container py-12 space-y-12">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        transition={{ duration: 0.5 }}
        className="space-y-4 text-center"
      >
        <h1 className="text-4xl font-bold tracking-tight">About Trashformer</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Learn about our mission to promote environmental sustainability through technology and community engagement.
        </p>
      </motion.div>

      <Tabs defaultValue="about" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="about">About Project</TabsTrigger>
          <TabsTrigger value="architecture">Architecture</TabsTrigger>
          <TabsTrigger value="future">Future Scope</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
        </TabsList>

        <TabsContent value="about" className="mt-6 space-y-8">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Leaf className="h-5 w-5 text-leaf-light" />
                  Our Mission
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  "Trashformer is dedicated to promoting environmental sustainability by leveraging cutting-edge AI technology to track, analyze, and reduce waste. Our platform empowers individuals and communities to make informed decisions about waste management and recycling."
                </p>
                <p>
                "Through our innovative AI-powered tools, we aim to create awareness about the environmental impact of everyday waste and provide actionable insights to reduce carbon footprints."
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: <Bot className="h-5 w-5 text-leaf-light" />,
                title: "AI-Powered Analysis",
                description:
                  "Our platform uses LLM's to analyze waste images and provide accurate carbon footprint estimations. Understand the environmental impact of your waste with detailed content breakdown and actionable insights.",
              },
              {
                icon: <BarChart2 className="h-5 w-5 text-leaf-light" />,
                title: "Contribution Points",
                description:
                  "Earn points for your eco-friendly actions and compete with others on our leaderboard system. Redeem your points for rewards and contribute to a healthier planet.",
              },
              {
                icon: <Users className="h-5 w-5 text-leaf-light" />,
                title: "Community Engagement",
                description:
                  "Join a community of environmentally conscious individuals working together for a sustainable future. Share tips, participate in challenges, and inspire others to make a differencen a community of environmentally conscious individuals working together for a sustainable future.",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {feature.icon}
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="architecture" className="mt-6">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Server className="h-5 w-5 text-leaf-light" />
                  System Architecture
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p>
                  Trashformer is built using a modern tech stack that ensures scalability, performance, and reliability.
                  Here's an overview of our architecture:
                </p>

                <div className="grid gap-6 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <Code2 className="h-4 w-4 text-leaf-light" />
                        Frontend
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="list-disc pl-5 space-y-2">
                        <li>Next.js for server-side rendering and routing</li>
                        <li>React for component-based UI development</li>
                        <li>Tailwind CSS for utility-first styling</li>
                        <li>shadcn/ui for accessible UI components</li>
                        <li>Framer Motion for smooth animations</li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <Database className="h-4 w-4 text-leaf-light" />
                        Backend
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="list-disc pl-5 space-y-2">
                        <li>Next.js API routes for serverless functions</li>
                        <li>NextAuth.js for authentication</li>
                        <li>Database for storing user data and contributions</li>
                        <li>AI models for image analysis and carbon footprint estimation</li>
                        <li>RESTful API design for client-server communication</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                <div className="rounded-lg border p-4">
                  <h3 className="text-lg font-medium mb-2">Cost Analysis (per unit)</h3>
                  <Table>
                    <TableCaption>A list of hardware components for the Trashformer Smart Bin.</TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[220px]">Component</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Method</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">ESP32-CAM (w/ 2MP camera)</TableCell>
                        <TableCell>Required</TableCell>
                        <TableCell>MCU + WiFi + Camera</TableCell>
                        <TableCell className="text-right">₹250</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">RFID Reader (13.56 MHz)</TableCell>
                        <TableCell>Required</TableCell>
                        <TableCell>Aadhar Card Tap</TableCell>
                        <TableCell className="text-right">₹100</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Servo Motor (SG90)</TableCell>
                        <TableCell>Required</TableCell>
                        <TableCell>Lid Actuation</TableCell>
                        <TableCell className="text-right">₹80</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">18650 Li-ion Battery (2500mAh)</TableCell>
                        <TableCell>Required</TableCell>
                        <TableCell>Power Storage</TableCell>
                        <TableCell className="text-right">₹200</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Solar Panel (3W)</TableCell>
                        <TableCell>Recommended</TableCell>
                        <TableCell>Power Generation</TableCell>
                        <TableCell className="text-right">₹516</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Charge Controller IC (TP4056)</TableCell>
                        <TableCell>Required</TableCell>
                        <TableCell>Battery Charging</TableCell>
                        <TableCell className="text-right">₹50</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">ABS Enclosure (100×100×70 mm)</TableCell>
                        <TableCell>Required</TableCell>
                        <TableCell>Weatherproof Casing</TableCell>
                        <TableCell className="text-right">₹239</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">SIM800L GSM Module</TableCell>
                        <TableCell>Optional</TableCell>
                        <TableCell>Network Connectivity</TableCell>
                        <TableCell className="text-right">₹350</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">GPS Module</TableCell>
                        <TableCell>Optional</TableCell>
                        <TableCell>Location Tracking</TableCell>
                        <TableCell className="text-right">₹300</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">LCD Display (16×2)</TableCell>
                        <TableCell>Optional</TableCell>
                        <TableCell>User Feedback</TableCell>
                        <TableCell className="text-right">₹100</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">LEDs, Buzzer, etc.</TableCell>
                        <TableCell>Required</TableCell>
                        <TableCell>Status Indication</TableCell>
                        <TableCell className="text-right">₹20</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Total Estimated Cost</TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell className="text-right font-semibold">₹1905</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell colSpan={4} className="text-center font-medium italic">
                          Estimated bulk cost would be <strong>₹750</strong> per unit when producing about <strong>10,000 units</strong> and removing a few non-essential components.
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>

                <div className="rounded-lg border p-4">
                  <h3 className="text-lg font-medium mb-2">Data Flow</h3>
                  <div className="flex flex-col items-center space-y-4 py-8">
                  <StepCard text="The user approaches the Trashformer smart dustbin." />
                  <ArrowBigDown />
                  <StepCard text="User taps Aadhar-linked RFID / Scans QR." />
                  <ArrowBigDown />
                  <StepCard text="User is authenticated and logged in." />
                  <ArrowBigDown />
                  <StepCard text="Servo motor opens the lid." />
                  <ArrowBigDown />
                  <StepCard text="The waste is deposited by the user." />
                  <ArrowBigDown />
                  <StepCard text="Servo motor closes the lid." />
                  <ArrowBigDown />
                  <StepCard text="ESP32-CAM module captures the image." />
                  <ArrowBigDown />
                  <StepCard text="Image is sent to the LLM Inference & Reasoning module via API." />
                  <ArrowBigDown />
                  <StepCard text="AI classifies the waste & generates a contribution score." />

                  {/* Parallel Branching */}
                  <div className="flex flex-row justify-center items-start gap-8 mt-4">
                    <div className="flex flex-col items-center space-y-2">
                      <ArrowBigDown />
                      <StepCard text="Contribution score is displayed locally." />
                    </div>

                    <div className="flex flex-col items-center space-y-2">
                      <ArrowBigDown />
                      <StepCard text="Data is logged into the database for dashboard." />
                    </div>
                  </div>

                  <Separator className="my-4 w-1/2" />
                  <ArrowBigDown />
                  <StepCard text="Servo motor closes the lid and the user session is logged out." />
                </div>
                  {/* Add data flow Image here */}
                  {/* <ol className="list-decimal pl-5 space-y-2">
                    <li>User uploads an image of waste through the UI</li>
                    <li>Image is processed and sent to the AI analysis service</li>
                    <li>AI model identifies waste components and calculates carbon impact</li>
                    <li>Results are returned to the user with sustainability recommendations</li>
                    <li>User actions and contributions are recorded in the database</li>
                    <li>Contribution points are awarded based on eco-friendly actions</li>
                  </ol> */}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="future" className="mt-6">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Rocket className="h-5 w-5 text-leaf-light" />
                  Scaling Impact: The Future of Trashformer
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p>
                We're not just building a platform, we're building a movement. Our vision for Trashformer extends beyond individual users, aiming to create a systemic impact through strategic partnerships and innovative features.
                </p>

                <div className="grid gap-4 md:grid-cols-2">
                  {[
                    {
                      title: "Government Integration (Smart City Waste Management)",
                      description:
                        "Integrate Trashformer with municipal waste management systems to optimize collection routes, reduce landfill waste, and improve overall city sustainability. Leverage AI-powered analytics to provide real-time data insights to government agencies for informed decision-making",
                    },
                    {
                      title: "Corporate Sustainability Programs (Employee Engagement)",
                      description:
                        "Partner with corporations to integrate Trashformer into their employee sustainability programs. Offer employees incentives for waste reduction and recycling, fostering a culture of environmental responsibility within businesses. Provide companies with data-driven reports on their collective impact.",
                    },
                    {
                      title: "Aadhar-Authenticated Waste Deposit Stations",
                      description:
                        "Develop smart waste deposit stations equipped with Aadhar authentication for user login. This ensures accountability and traceability for every waste deposit. Users receive contribution points directly to their Trashformer accounts upon successful authentication and disposal.",
                    },
                    {
                      title: "AI-Powered Waste Sorting & Analysis at Deposit Stations",
                      description:
                        "Integrate AI-powered image recognition and sensors within the deposit stations to classify waste in real-time. This ensures proper segregation and allows for immediate point allocation based on the type and quantity of waste deposited.",
                    },
                    {
                      title: "User-Friendly Hardware Interface (Accessibility)",
                      description:
                        "Design a user-friendly hardware interface for the deposit stations, ensuring accessibility for all users. Provide clear instructions and visual feedback to guide the disposal process. Offer multilingual support and accommodate users with disabilities.",
                    },
                    {
                      title: "Predictive Waste Analytics for Proactive Intervention (Early Warning System)",
                      description:
                        "Use AI to analyze large datasets of waste generation patterns and predict future waste hotspots or potential environmental hazards. Enable proactive interventions and resource allocation.",
                    },
                  ].map((item, index) => (
                    <div key={index} className="rounded-lg border p-4">
                      <h3 className="text-lg font-medium mb-2">{item.title}</h3>
                      <p className="text-muted-foreground">{item.description}</p>
                    </div>
                  ))}
                </div>

                <div className="bg-secondary/50 rounded-lg p-6 text-center">
                  <h3 className="text-xl font-bold mb-2">Help Shape Our Future</h3>
                  <p className="mb-4">
                    We value your input! If you have ideas for new features or improvements, we'd love to hear from you.
                  </p>
                  <a href="#" className="text-primary font-medium hover:underline">
                    Submit Feedback
                  </a>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="team" className="mt-6">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-leaf-light" />
                  Project Maintainers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {[
                    {
                      name: "Rudransh Joshi",
                      role: "AI Engineer",
                      image: "/placeholder.svg?height=100&width=100",
                      bio: "Specializes in computer vision and machine learning for environmental applications.",
                    },
                    {
                      name: "Uttam Tiwari",
                      role: "Environment Scientist",
                      image: "/placeholder.svg?height=100&width=100",
                      bio: "Environmental scientist with a passion for technology and sustainability.",
                    },
                    {
                      name: "Manish Singh Bisht",
                      role: "Frontend Developer",
                      image: "/placeholder.svg?height=100&width=100",
                      bio: "Creates intuitive and accessible user interfaces with a focus on user experience.",
                    },
                  ].map((member, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="flex flex-col items-center text-center p-4 rounded-lg border"
                    >
                      <div className="w-24 h-24 rounded-full overflow-hidden mb-4">
                        <img
                          src={member.image || "/placeholder.svg"}
                          alt={member.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h3 className="text-lg font-bold">{member.name}</h3>
                      <p className="text-sm text-primary mb-2">{member.role}</p>
                      <p className="text-sm text-muted-foreground">{member.bio}</p>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

