"use client"

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import type { Conversation } from "./messaging-app"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

interface MessagingSidebarProps {
  conversations: Conversation[]
  selectedConversationId?: string
  onSelectConversation: (conversation: Conversation) => void
}

export function MessagingSidebar({
  conversations,
  selectedConversationId,
  onSelectConversation,
}: MessagingSidebarProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <h1 className="text-xl font-semibold mb-4">Messages</h1>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Search conversations..." className="pl-8" />
        </div>
      </div>
      <div className="flex-1 overflow-auto">
        {conversations.map((conversation) => (
          <button
            key={conversation.id}
            className={cn(
              "w-full flex items-start gap-3 p-3 hover:bg-accent transition-colors text-left",
              selectedConversationId === conversation.id && "bg-accent",
            )}
            onClick={() => onSelectConversation(conversation)}
          >
            <Avatar className="h-10 w-10 flex-shrink-0">
              <AvatarImage src={conversation.avatar} alt={conversation.name} />
              <AvatarFallback>{conversation.name.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-baseline">
                <span className="font-medium truncate">{conversation.name}</span>
                <span className="text-xs text-muted-foreground flex-shrink-0">{conversation.timestamp}</span>
              </div>
              <div className="flex justify-between items-center mt-1">
                <p className="text-sm text-muted-foreground truncate">
                  {conversation.isTyping ? (
                    <span className="text-primary italic">Typing...</span>
                  ) : (
                    conversation.lastMessage
                  )}
                </p>
                {conversation.unread > 0 && (
                  <Badge variant="default" className="ml-2 flex-shrink-0">
                    {conversation.unread}
                  </Badge>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
