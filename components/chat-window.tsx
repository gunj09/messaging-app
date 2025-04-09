"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import type { Conversation, Message } from "./messaging-app"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Paperclip, Send, Smile, ImageIcon, File, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { AvatarGroup } from "./avatar-group"

interface ChatWindowProps {
  conversation: Conversation
  messages: Message[]
  onSendMessage: (content: string, type?: Message["type"], fileUrl?: string, fileName?: string) => void
  sidebarTrigger?: React.ReactNode
  themeToggle?: React.ReactNode
}

export function ChatWindow({ conversation, messages, onSendMessage, sidebarTrigger, themeToggle }: ChatWindowProps) {
  const [inputValue, setInputValue] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const emojis = ["😊", "👍", "❤️", "🎉", "🔥", "😂", "🙏", "✨", "🤔", "👀"]

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = () => {
    if (selectedFile) {
      const fileType = selectedFile.type.startsWith("image/") ? "image" : "file"
      onSendMessage(selectedFile.name, fileType, URL.createObjectURL(selectedFile), selectedFile.name)
      setSelectedFile(null)
    } else if (selectedEmoji) {
      onSendMessage(selectedEmoji, "emoji")
      setSelectedEmoji(null)
    } else if (inputValue.trim()) {
      onSendMessage(inputValue)
      setInputValue("")
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
    }
  }

  const handleEmojiSelect = (emoji: string) => {
    setSelectedEmoji(emoji)
    setInputValue((prev) => prev + emoji)
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-3">
          {sidebarTrigger}
          {conversation.isGroup ? (
            <>
              <AvatarGroup users={conversation.participants || []} limit={3} />
              <div>
                <h2 className="font-medium">{conversation.name}</h2>
                <p className="text-xs text-muted-foreground">{conversation.participants?.length} members</p>
              </div>
            </>
          ) : (
            <>
              <Avatar>
                <AvatarImage src={conversation.avatar} alt={conversation.name} />
                <AvatarFallback>{conversation.name.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="font-medium">{conversation.name}</h2>
                {conversation.isTyping && <p className="text-xs text-primary">Typing...</p>}
              </div>
            </>
          )}
        </div>
        <div className="flex items-center gap-2">{themeToggle}</div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn("flex gap-3 max-w-[80%]", message.senderId === "user" ? "ml-auto flex-row-reverse" : "")}
          >
            <Avatar className="h-8 w-8 flex-shrink-0">
              <AvatarImage src={message.senderAvatar} alt={message.senderName} />
              <AvatarFallback>{message.senderName.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-sm font-medium">{message.senderId === "user" ? "You" : message.senderName}</span>
                <span className="text-xs text-muted-foreground">{message.timestamp}</span>
              </div>
              {message.type === "text" || message.type === "emoji" ? (
                <div
                  className={cn(
                    "mt-1 rounded-lg p-3",
                    message.senderId === "user" ? "bg-primary text-primary-foreground" : "bg-muted",
                  )}
                >
                  {message.content}
                </div>
              ) : message.type === "image" ? (
                <div className="mt-1 rounded-lg overflow-hidden">
                  <img
                    src={message.fileUrl || "/placeholder.svg"}
                    alt="Shared image"
                    className="max-w-full h-auto max-h-[300px] object-contain"
                  />
                </div>
              ) : (
                <div
                  className={cn(
                    "mt-1 rounded-lg p-3 flex items-center gap-2",
                    message.senderId === "user" ? "bg-primary text-primary-foreground" : "bg-muted",
                  )}
                >
                  <File className="h-4 w-4" />
                  <span className="underline">{message.fileName}</span>
                </div>
              )}
              {message.senderId === "user" && (
                <div className="flex justify-end mt-1">
                  {message.status === "sent" && <span className="text-xs text-muted-foreground">✓</span>}
                  {message.status === "delivered" && <span className="text-xs text-muted-foreground">✓✓</span>}
                  {message.status === "read" && <span className="text-xs text-primary">✓✓</span>}
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {selectedFile && (
        <div className="px-4 py-2 border-t flex items-center gap-2">
          <div className="flex-1 bg-muted rounded-md p-2 flex items-center gap-2">
            {selectedFile.type.startsWith("image/") ? <ImageIcon className="h-4 w-4" /> : <File className="h-4 w-4" />}
            <span className="text-sm truncate">{selectedFile.name}</span>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setSelectedFile(null)}>
            <X className="h-4 w-4" />
            <span className="sr-only">Remove file</span>
          </Button>
        </div>
      )}

      <div className="p-4 border-t">
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Smile className="h-5 w-5" />
                <span className="sr-only">Emoji picker</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-2" align="start">
              <div className="flex gap-2 flex-wrap max-w-[200px]">
                {emojis.map((emoji) => (
                  <button
                    key={emoji}
                    className="text-xl hover:bg-accent p-1 rounded"
                    onClick={() => handleEmojiSelect(emoji)}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => fileInputRef.current?.click()}>
            <Paperclip className="h-5 w-5" />
            <span className="sr-only">Attach file</span>
          </Button>
          <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />

          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="flex-1"
          />

          <Button
            onClick={handleSendMessage}
            size="icon"
            className="h-9 w-9"
            disabled={!inputValue && !selectedFile && !selectedEmoji}
          >
            <Send className="h-4 w-4" />
            <span className="sr-only">Send message</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
