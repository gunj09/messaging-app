"use client"

import { useState } from "react"
import { MessagingSidebar } from "./messaging-sidebar"
import { ChatWindow } from "./chat-window"
import { ThemeToggle } from "./theme-toggle"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent } from "@/components/ui/sheet"

export type Conversation = {
  id: string
  name: string
  avatar: string
  lastMessage: string
  timestamp: string
  unread: number
  isGroup: boolean
  participants?: {
    id: string
    name: string
    avatar: string
  }[]
  isTyping?: boolean
}

export type Message = {
  id: string
  senderId: string
  senderName: string
  senderAvatar: string
  content: string
  timestamp: string
  status: "sent" | "delivered" | "read"
  type: "text" | "image" | "video" | "file" | "emoji"
  fileUrl?: string
  fileName?: string
}

export function MessagingApp() {
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: "1",
      name: "Sarah Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
      lastMessage: "Are we still meeting tomorrow?",
      timestamp: "10:42 AM",
      unread: 2,
      isGroup: false,
      isTyping: false,
    },
    {
      id: "2",
      name: "Design Team",
      avatar: "/placeholder.svg?height=40&width=40",
      lastMessage: "Alex: I've updated the mockups",
      timestamp: "9:30 AM",
      unread: 0,
      isGroup: true,
      participants: [
        {
          id: "101",
          name: "Alex Chen",
          avatar: "/placeholder.svg?height=32&width=32",
        },
        {
          id: "102",
          name: "Maya Patel",
          avatar: "/placeholder.svg?height=32&width=32",
        },
        {
          id: "103",
          name: "Jordan Lee",
          avatar: "/placeholder.svg?height=32&width=32",
        },
      ],
      isTyping: true,
    },
    {
      id: "3",
      name: "Michael Rodriguez",
      avatar: "/placeholder.svg?height=40&width=40",
      lastMessage: "Thanks for your help!",
      timestamp: "Yesterday",
      unread: 0,
      isGroup: false,
    },
    {
      id: "4",
      name: "Project Sync",
      avatar: "/placeholder.svg?height=40&width=40",
      lastMessage: "Emma: Let's schedule the next sprint",
      timestamp: "Yesterday",
      unread: 0,
      isGroup: true,
      participants: [
        {
          id: "201",
          name: "Emma Wilson",
          avatar: "/placeholder.svg?height=32&width=32",
        },
        {
          id: "202",
          name: "David Kim",
          avatar: "/placeholder.svg?height=32&width=32",
        },
        {
          id: "203",
          name: "Sophia Garcia",
          avatar: "/placeholder.svg?height=32&width=32",
        },
      ],
    },
    {
      id: "5",
      name: "Lisa Taylor",
      avatar: "/placeholder.svg?height=40&width=40",
      lastMessage: "Can you send me the files?",
      timestamp: "Monday",
      unread: 0,
      isGroup: false,
    },
  ])

  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(conversations[0])
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "m1",
      senderId: "user",
      senderName: "You",
      senderAvatar: "/placeholder.svg?height=32&width=32",
      content: "Hi Sarah, how are you doing?",
      timestamp: "10:30 AM",
      status: "read",
      type: "text",
    },
    {
      id: "m2",
      senderId: "1",
      senderName: "Sarah Johnson",
      senderAvatar: "/placeholder.svg?height=32&width=32",
      content: "I'm good, thanks! Just finishing up some work.",
      timestamp: "10:35 AM",
      status: "read",
      type: "text",
    },
    {
      id: "m3",
      senderId: "user",
      senderName: "You",
      senderAvatar: "/placeholder.svg?height=32&width=32",
      content: "Great! Here's the document we discussed.",
      timestamp: "10:38 AM",
      status: "read",
      type: "file",
      fileUrl: "#",
      fileName: "project_proposal.pdf",
    },
    {
      id: "m4",
      senderId: "1",
      senderName: "Sarah Johnson",
      senderAvatar: "/placeholder.svg?height=32&width=32",
      content: "Thanks! Are we still meeting tomorrow?",
      timestamp: "10:42 AM",
      status: "delivered",
      type: "text",
    },
  ])

  const [sidebarOpen, setSidebarOpen] = useState(false)
  const isDesktop = useMediaQuery("(min-width: 768px)")

  const handleSendMessage = (content: string, type: Message["type"] = "text", fileUrl?: string, fileName?: string) => {
    if (!content && type === "text") return

    const newMessage: Message = {
      id: `m${messages.length + 1}`,
      senderId: "user",
      senderName: "You",
      senderAvatar: "/placeholder.svg?height=32&width=32",
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      status: "sent",
      type,
      fileUrl,
      fileName,
    }

    setMessages([...messages, newMessage])

    // Simulate received message
    if (selectedConversation) {
      setTimeout(() => {
        const isTyping = { ...selectedConversation, isTyping: true }
        setSelectedConversation(isTyping)

        const updatedConversations = conversations.map((conv) =>
          conv.id === selectedConversation.id ? isTyping : conv,
        )
        setConversations(updatedConversations)

        setTimeout(() => {
          const responseMessage: Message = {
            id: `m${messages.length + 2}`,
            senderId: selectedConversation.id,
            senderName: selectedConversation.name,
            senderAvatar: selectedConversation.avatar,
            content: type === "text" ? "Thanks for your message! I'll get back to you soon." : "Thanks for sharing!",
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            status: "sent",
            type: "text",
          }

          setMessages((prev) => [...prev, responseMessage])

          const notTyping = { ...selectedConversation, isTyping: false }
          setSelectedConversation(notTyping)

          const finalConversations = conversations.map((conv) =>
            conv.id === selectedConversation.id ? notTyping : conv,
          )
          setConversations(finalConversations)
        }, 2000)
      }, 1000)
    }
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {isDesktop ? (
        <div className="w-80 border-r">
          <MessagingSidebar
            conversations={conversations}
            selectedConversationId={selectedConversation?.id}
            onSelectConversation={(conversation) => {
              setSelectedConversation(conversation)
              setSidebarOpen(false)
            }}
          />
        </div>
      ) : (
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetContent side="left" className="p-0 w-[280px]">
            <MessagingSidebar
              conversations={conversations}
              selectedConversationId={selectedConversation?.id}
              onSelectConversation={(conversation) => {
                setSelectedConversation(conversation)
                setSidebarOpen(false)
              }}
            />
          </SheetContent>
        </Sheet>
      )}

      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <ChatWindow
            conversation={selectedConversation}
            messages={messages}
            onSendMessage={handleSendMessage}
            sidebarTrigger={
              !isDesktop && (
                <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)} className="mr-2">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Open sidebar</span>
                </Button>
              )
            }
            themeToggle={<ThemeToggle />}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center flex-col gap-4">
            {!isDesktop && (
              <Button variant="outline" onClick={() => setSidebarOpen(true)} className="mb-4">
                <Menu className="h-5 w-5 mr-2" />
                Select a conversation
              </Button>
            )}
            <p className="text-muted-foreground">Select a conversation to start messaging</p>
            <div className="absolute top-4 right-4">
              <ThemeToggle />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
