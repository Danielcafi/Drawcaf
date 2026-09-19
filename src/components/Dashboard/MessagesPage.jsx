import { useState, useEffect } from 'react'
import { useStoreStore, useAuthStore } from '../../store'
import { supabase } from '../../lib/supabase'
import { MessageSquare, Send, User, Search } from 'lucide-react'

export default function MessagesPage() {
  const [conversations, setConversations] = useState([])
  const [selectedConversation, setSelectedConversation] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const { currentStore } = useStoreStore()
  const { profile } = useAuthStore()

  useEffect(() => {
    if (currentStore) {
      fetchConversations()
    }
  }, [currentStore])

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation.id)
    }
  }, [selectedConversation])

  const fetchConversations = async () => {
    try {
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .eq('store_id', currentStore.id)
        .order('updated_at', { ascending: false })

      if (error) throw error
      setConversations(data || [])
    } catch (err) {
      console.error('Error fetching conversations:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchMessages = async (conversationId) => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true })

      if (error) throw error
      setMessages(data || [])
    } catch (err) {
      console.error('Error fetching messages:', err)
    }
  }

  const sendMessage = async (e) => {
    e.preventDefault()
    if (!newMessage.trim() || !selectedConversation) return

    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          conversation_id: selectedConversation.id,
          sender_id: profile.id,
          content: newMessage.trim()
        })

      if (error) throw error
      setNewMessage('')
      fetchMessages(selectedConversation.id)
    } catch (err) {
      console.error('Error sending message:', err)
    }
  }

  const filteredConversations = conversations.filter(conv =>
    conv.buyer_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.last_message?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-100"></div>
      </div>
    )
  }

  return (
    <div className="flex h-[calc(100vh-200px)] bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Conversations List */}
      <div className="w-80 border-r border-gray-100 flex flex-col">
        <div className="p-4 border-b border-gray-100">
          <h2 className="font-bold font-head mb-3">Messages</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-100 focus:border-transparent outline-none"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500">Aucune conversation</p>
            </div>
          ) : (
            filteredConversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => setSelectedConversation(conv)}
                className={`w-full p-4 text-left hover:bg-gray-50 border-b border-gray-50 transition-colors ${
                  selectedConversation?.id === conv.id ? 'bg-primary-50' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                    <User className="w-5 h-5 text-gray-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{conv.buyer_name}</p>
                    <p className="text-xs text-gray-500 truncate">{conv.last_message || 'Aucun message'}</p>
                  </div>
                  <span className="text-xs text-gray-400">
                    {new Date(conv.updated_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Messages Area */}
      {selectedConversation ? (
        <div className="flex-1 flex flex-col">
          <div className="p-4 border-b border-gray-100">
            <h3 className="font-medium">{selectedConversation.buyer_name}</h3>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender_id === profile.id ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg ${
                    msg.sender_id === profile.id
                      ? 'bg-primary-100 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <p className="text-sm">{msg.content}</p>
                  <p className={`text-xs mt-1 ${msg.sender_id === profile.id ? 'text-white/70' : 'text-gray-500'}`}>
                    {new Date(msg.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <form onSubmit={sendMessage} className="p-4 border-t border-gray-100">
            <div className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Écrire un message..."
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-100 focus:border-transparent outline-none"
              />
              <button
                type="submit"
                disabled={!newMessage.trim()}
                className="bg-primary-100 text-white px-4 py-2 rounded-lg hover:bg-primary-300 transition-colors disabled:opacity-50"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Sélectionnez une conversation</p>
          </div>
        </div>
      )}
    </div>
  )
}