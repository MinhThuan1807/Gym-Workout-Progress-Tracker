'use client'

import { useState, useEffect, useRef } from 'react'
import { useSocket } from '@/socket'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '@/store/slices/authSlice'
import { Button } from '@/components/user/ui/button'
import { Card } from '@/components/user/ui/card'
import { Input } from '@/components/user/ui/input'
import { Textarea } from '@/components/user/ui/textarea'
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from '@/components/user/ui/avatar'
import { Badge } from '@/components/user/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription
} from '@/components/user/ui/dialog'
import { Label } from '@/components/user/ui/label'
import {
  MessageSquare,
  Plus,
  Send,
  Search,
  Users,
  Clock,
  TrendingUp,
  Trash2,
  MoreVertical
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/user/ui/dropdown-menu'
import { ScrollArea } from '@/components/user/ui/scroll-area'
import { toast } from 'sonner'
import { commuityApi } from '@/api/community'

interface Message {
  _id: string
  senderId: string
  senderAvatarUrl?: string
  senderName: string
  senderRole: 'member' | 'admin'
  message: string
  timestamp: Date | number
  isRead: boolean
  isDeleted: boolean
}

interface Thread {
  _id: string
  roomId: string
  userId: string
  avatarUrl?: string
  title: string
  type: 'general' | 'nutrition' | 'workout' | 'lifestyle' | 'other'
  messages: Message[]
  createdAt: Date | number
  updatedAt: Date | number | null
}

const types = ['all', 'general', 'nutrition', 'workout', 'lifestyle', 'other']

export default function CommunityPage() {
  const { socket, isConnected } = useSocket()
  const currentUser = useSelector(selectCurrentUser)
  const [selectedThread, setSelectedThread] = useState<Thread | null>(null)
  const [threads, setThreads] = useState<Thread[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newThreadTitle, setNewThreadTitle] = useState('')
  const [newThreadType, setNewThreadType] = useState('general')
  const [newThreadContent, setNewThreadContent] = useState('')
  //   const messagesEndRef = useRef<HTMLDivElement>(null)

  //   useEffect(() => {
  //     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  //   }, [threads, selectedThread])

  // Fetch threads on mount
  useEffect(() => {
    const fetchThreads = async () => {
      try {
        const res = await commuityApi.fetchThreads()
        setThreads(res.data)
      } catch (error) {
        console.error('Error fetching threads:', error)
        toast.error('Failed to fetch threads')
      }
    }

    fetchThreads()
  }, [])

  // Setup socket events
  useEffect(() => {
    if (!socket || !isConnected) return

    if (socket && isConnected && selectedThread) {
      socket.emit('joinThread', selectedThread.roomId)
    }

    // Handle new message
    const handleNewMessage = (data: { message: Message; roomId: string }) => {
      setThreads((prevThreads) =>
        prevThreads.map((thread) =>
          thread.roomId === data.roomId
            ? {
                ...thread,
                messages: [...thread.messages, data.message],
                updatedAt: data.message.timestamp
              }
            : thread
        )
      )

      if (selectedThread?.roomId === data.roomId) {
        setSelectedThread((prev) =>
          prev
            ? {
                ...prev,
                messages: [...prev.messages, data.message],
                updatedAt: data.message.timestamp
              }
            : null
        )
      }
    }

    // Listen for new messages
    socket.on('messageReceived', handleNewMessage)
    socket.on('newMessage', handleNewMessage)

    // Listen for deleted messages
    socket.on(
      'messageDeleted',
      (data: { roomId: string; messageId: string }) => {
        setThreads((prevThreads) =>
          prevThreads.map((thread) =>
            thread.roomId === data.roomId
              ? {
                  ...thread,
                  messages: thread.messages.map((msg) =>
                    msg._id === data.messageId
                      ? {
                          ...msg,
                          isDeleted: true
                        }
                      : msg
                  )
                }
              : thread
          )
        )

        if (selectedThread?.roomId === data.roomId) {
          setSelectedThread((prev) =>
            prev
              ? {
                  ...prev,
                  messages: prev.messages.map((msg) =>
                    msg._id === data.messageId
                      ? { ...msg, isDeleted: true }
                      : msg
                  )
                }
              : null
          )
        }
      }
    )

    return () => {
      socket.off('messageReceived')
      socket.off('newMessage')
      socket.off('messageDeleted')
    }
  }, [socket, isConnected, selectedThread])

  const filteredThreads = threads.filter((thread) => {
    const matchesSearch = thread.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
    const matchesCategory =
      selectedCategory === 'all' || thread.type === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleCreateThread = async () => {
    if (!newThreadTitle.trim() || !newThreadContent.trim()) {
      toast.error('Please fill in all fields')
      return
    }
    try {
      const res = await commuityApi.createThread(
        newThreadTitle,
        newThreadType,
        newThreadContent
      )

      // Refresh threads
      const threadsRes = await commuityApi.fetchThreads()
      setThreads(threadsRes.data)

      setIsCreateDialogOpen(false)
      setNewThreadTitle('')
      setNewThreadType('general')
      setNewThreadContent('')
      toast.success(res.message || 'Thread created successfully!')
    } catch (error) {
      toast.error('Failed to create thread')
      console.error('Error creating thread:', error)
    }
  }

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedThread || !socket || !currentUser) return

    const messageData = {
      roomId: selectedThread.roomId,
      senderId: currentUser._id,
      senderRole: currentUser.role,
      senderAvatarUrl: currentUser?.avatar,
      senderName: currentUser.displayName,
      message: newMessage.trim()
    }

    socket.emit('sendMessage', messageData)
    setNewMessage('')
  }

  const handleDeleteMessage = (messageId: string) => {
    if (!selectedThread || !socket) return

    const deleteData = {
      roomId: selectedThread.roomId,
      messageId
    }
    socket.emit('deleteMessage', deleteData)
    toast.success('Message deleted successfully')
  }

  const formatDate = (timestamp: Date | number) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Community</h1>
          <p className="text-muted-foreground">
            Connect, share, and learn with fellow fitness enthusiasts
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-xl">
              <Plus className="w-4 h-4 mr-2" />
              New Thread
            </Button>
          </DialogTrigger>
          <DialogContent className="rounded-2xl">
            <DialogHeader>
              <DialogTitle>Create New Thread</DialogTitle>
              <DialogDescription>
                Start a new discussion topic for the community
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title" className="mb-2">
                  Title
                </Label>
                <Input
                  id="title"
                  placeholder="What's your question or topic?"
                  value={newThreadTitle}
                  onChange={(e: any) => setNewThreadTitle(e.target.value)}
                  className="rounded-xl"
                />
              </div>
              <div>
                <Label htmlFor="type" className="mb-2">
                  Type
                </Label>
                <select
                  id="type"
                  value={newThreadType}
                  onChange={(e) => setNewThreadType(e.target.value)}
                  className="w-full rounded-xl border border-input bg-background px-3 py-2"
                >
                  {types
                    .filter((c) => c !== 'all')
                    .map((type) => (
                      <option key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </option>
                    ))}
                </select>
              </div>
              <div>
                <Label htmlFor="message" className="mb-2">
                  Message
                </Label>
                <Textarea
                  id="message"
                  placeholder="Describe your question or start the discussion..."
                  value={newThreadContent}
                  onChange={(e: any) => setNewThreadContent(e.target.value)}
                  rows={4}
                  className="rounded-xl"
                />
              </div>
              <Button
                onClick={handleCreateThread}
                className="w-full rounded-xl"
              >
                Create Thread
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="rounded-2xl p-6 border-2">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-primary" />
            </div>
            <div>
              <div className="text-2xl font-bold">{threads.length}</div>
              <div className="text-sm text-muted-foreground">
                Active Threads
              </div>
            </div>
          </div>
        </Card>
        <Card className="rounded-2xl p-6 border-2">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center">
              <Users className="w-6 h-6 text-orange-500" />
            </div>
            <div>
              <div className="text-2xl font-bold">
                {isConnected ? '🟢 Online' : '🔴 Offline'}
              </div>
              <div className="text-sm text-muted-foreground">Status</div>
            </div>
          </div>
        </Card>
        <Card className="rounded-2xl p-6 border-2">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <div className="text-2xl font-bold">
                {threads.reduce((sum, t) => sum + t.messages.length, 0)}
              </div>
              <div className="text-sm text-muted-foreground">
                Total Messages
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Threads List */}
        <Card className="rounded-2xl border-2 lg:col-span-5 xl:col-span-4">
          <div className="p-6 border-b space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search threads..."
                value={searchQuery}
                onChange={(e: any) => setSearchQuery(e.target.value)}
                className="pl-9 rounded-xl"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {types.map((type) => (
                <Badge
                  key={type}
                  variant={selectedCategory === type ? 'default' : 'outline'}
                  className="cursor-pointer rounded-full"
                  onClick={() => setSelectedCategory(type)}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </Badge>
              ))}
            </div>
          </div>
          <ScrollArea>
            <div className="p-4 space-y-2">
              {filteredThreads.map((thread) => (
                <Card
                  key={thread._id}
                  className={`rounded-xl p-4 cursor-pointer transition-all hover:shadow-md ${
                    selectedThread?._id === thread._id
                      ? 'border-2 border-primary'
                      : 'border'
                  }`}
                  onClick={() => setSelectedThread(thread)}
                >
                  <div className="flex items-start gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback>
                        {thread.messages[0]?.senderAvatarUrl ? (
                          <img
                            src={thread.messages[0].senderAvatarUrl}
                            alt={thread.messages[0]?.senderName || 'User'}
                          />
                        ) : (
                          thread.messages[0]?.senderName?.[0] || 'U'
                        )}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-semibold text-sm line-clamp-2">
                          {thread.title}
                        </h4>
                        <Badge
                          variant="outline"
                          className="rounded-full text-xs whitespace-nowrap"
                        >
                          {thread.type}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                        <span>
                          {thread.messages[0]?.senderName || 'Unknown'}
                        </span>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          <MessageSquare className="w-3 h-3" />
                          <span>{thread.messages.length}</span>
                        </div>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>
                            {formatDate(thread.updatedAt || thread.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </Card>

        {/* Thread Detail */}
        <Card className="rounded-2xl border-2 lg:col-span-7 xl:col-span-8">
          {selectedThread ? (
            <div className="flex flex-col h-[600px]">
              {/* Thread Header */}
              <div className="p-6 border-b">
                <div className="flex items-start gap-3 mb-3">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback>
                      {selectedThread?.avatarUrl ? (
                        <img
                          src={selectedThread?.avatarUrl}
                          alt="User Avatar"
                        />
                      ) : (
                        selectedThread.messages[0]?.senderName?.[0] || 'U'
                      )}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">
                      {selectedThread.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                      <span>
                        {selectedThread.messages[0]?.senderName || 'Unknown'}
                      </span>
                      <span>•</span>
                      <span>{formatDate(selectedThread.createdAt)}</span>
                    </div>
                  </div>
                  <Badge className="rounded-full">{selectedThread.type}</Badge>
                </div>
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 p-6">
                <div className="space-y-6">
                  {selectedThread.messages
                    // .filter((msg) => !msg.isDeleted)
                    .map((message) => (
                      <div key={message._id} className="flex gap-3 group">
                        <Avatar className="w-10 h-10">
                          <AvatarFallback>
                            {message.senderAvatarUrl ? (
                              <img
                                src={message.senderAvatarUrl}
                                alt={message.senderName || 'User'}
                              />
                            ) : (
                              message.senderName?.[0] || 'U'
                            )}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-sm">
                              {message.senderName}
                            </span>
                            <Badge variant="outline" className="text-xs">
                              {message.senderRole}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {formatDate(message.timestamp)}
                            </span>
                            {(currentUser?._id === message.senderId ||
                              currentUser?.role === 'admin') && (
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity ml-auto"
                                  >
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem
                                    onClick={() =>
                                      handleDeleteMessage(message._id)
                                    }
                                    className="text-destructive focus:text-destructive"
                                  >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Delete Message
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            )}
                          </div>
                          <div className="bg-muted/50 rounded-xl p-3">
                            <p
                              className={
                                message.isDeleted
                                  ? 'line-through text-muted-foreground text-sm'
                                  : 'text-sm'
                              }
                            >
                              {message.message}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
                {/* <div ref={messagesEndRef} /> */}
              </ScrollArea>

              {/* Message Input */}
              <div className="p-6 border-t">
                <div className="flex gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback>
                      {currentUser?.avatar ? (
                        <img src={currentUser?.avatar} alt="User Avatar" />
                      ) : (
                        currentUser?.displayName?.[0] || 'U'
                      )}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 flex gap-2">
                    <Input
                      placeholder="Type your message..."
                      value={newMessage}
                      onChange={(e: any) => setNewMessage(e.target.value)}
                      onKeyPress={(e: any) =>
                        e.key === 'Enter' && handleSendMessage()
                      }
                      className="rounded-xl"
                      disabled={!isConnected}
                    />
                    <Button
                      onClick={handleSendMessage}
                      className="rounded-xl"
                      disabled={!isConnected || !newMessage.trim()}
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-[600px] flex items-center justify-center text-center p-6">
              <div>
                <MessageSquare className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">
                  Select a thread to start chatting
                </h3>
                <p className="text-muted-foreground">
                  Choose from the threads on the left or create a new one
                </p>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
