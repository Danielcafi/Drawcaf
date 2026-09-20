import { useState, useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { useStoreStore, useAuthStore } from '../../store'
import { supabase } from '../../lib/supabase'
import { MessageSquare, Send, User, Search, Package } from 'lucide-react'

export default function MessagesPage() {
  const [conversations, setConversations] = useState([])
  const [selectedConversation, setSelectedConversation] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const messagesEndRef = useRef(null)
  const location = useLocation()
  const { currentStore } = useStoreStore()
  const { user, profile } = useAuthStore()

  const isSeller = !!currentStore

  useEffect(() => {
    setSelectedConversation(null)
    setMessages([])
    if (user) {
      fetchConversations()
    }
  }, [location.key, user?.id])

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation.id)
    }
  }, [selectedConversation])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const fetchConversations = async () => {
    setLoading(true)
    try {
      let query = supabase
        .from('conversations')
        .select('*')

      if (isSeller) {
        query = query.eq('seller_id', profile?.id || user.id)
      } else {
        query = query.eq('buyer_id', user.id)
      }

      const { data, error } = await query.order('last_message_at', { ascending: false, nullsFirst: false })

      if (error) throw error

      const enriched = await Promise.all(
        (data || []).map(async (conv) => {
          const otherUserId = isSeller ? conv.buyer_id : conv.seller_id
          const { data: profileData } = await supabase
            .from('profiles')
            .select('full_name, avatar_url')
            .eq('id', otherUserId)
            .single()

          const { data: storeData } = await supabase
            .from('stores')
            .select('name, logo_url')
            .eq('id', conv.store_id)
            .single()

          const { data: productData } = await supabase
            .from('products')
            .select('title, price')
            .eq('id', conv.product_id)
            .single()

          return {
            ...conv,
            otherName: profileData?.full_name || 'Utilisateur',
            otherAvatar: profileData?.avatar_url,
            storeName: storeData?.name || 'Boutique',
            storeLogo: storeData?.logo_url,
            productName: productData?.title,
            productPrice: productData?.price,
          }
        })
      )

      setConversations(enriched)
    } catch (err) {
      console.error('Erreur chargement conversations:', err)
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

      await supabase
        .from('conversations')
        .update({ is_read: true })
        .eq('id', conversationId)
    } catch (err) {
      console.error('Erreur chargement messages:', err)
    }
  }

  const sendMessage = async (e) => {
    e.preventDefault()
    if (!newMessage.trim() || !selectedConversation || sending) return

    setSending(true)
    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          conversation_id: selectedConversation.id,
          sender_id: profile?.id || user.id,
          content: newMessage.trim()
        })

      if (error) throw error

      await supabase
        .from('conversations')
        .update({
          last_message: newMessage.trim(),
          last_message_at: new Date().toISOString(),
          is_read: false,
        })
        .eq('id', selectedConversation.id)

      setNewMessage('')
      fetchMessages(selectedConversation.id)
      fetchConversations()
    } catch (err) {
      console.error('Erreur envoi message:', err)
    } finally {
      setSending(false)
    }
  }

  const filteredConversations = conversations.filter(conv =>
    conv.otherName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.storeName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
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
          <h2 className="font-bold font-head mb-3">
            Messages {isSeller ? '(Vendeur)' : '(Acheteur)'}
          </h2>
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
                } ${!conv.is_read && selectedConversation?.id !== conv.id ? 'bg-blue-50' : ''}`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center shrink-0 overflow-hidden">
                    {conv.otherAvatar ? (
                      <img src={conv.otherAvatar} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-5 h-5 text-gray-500" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-sm truncate">{conv.otherName}</p>
                      {conv.last_message_at && (
                        <span className="text-xs text-gray-400 shrink-0 ml-2">
                          {new Date(conv.last_message_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 truncate">{conv.storeName}</p>
                    <p className="text-xs text-gray-500 truncate">{conv.last_message || 'Aucun message'}</p>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Messages Area */}
      {selectedConversation ? (
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center shrink-0 overflow-hidden">
              {selectedConversation.otherAvatar ? (
                <img src={selectedConversation.otherAvatar} alt="" className="w-full h-full object-cover" />
              ) : (
                <User className="w-5 h-5 text-gray-500" />
              )}
            </div>
            <div>
              <p className="font-medium text-sm">{selectedConversation.otherName}</p>
              <p className="text-xs text-gray-400">{selectedConversation.storeName}</p>
            </div>
            {selectedConversation.productName && (
              <div className="ml-auto flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-1.5">
                <Package className="w-4 h-4 text-gray-400" />
                <span className="text-xs text-gray-600 truncate max-w-[150px]">{selectedConversation.productName}</span>
                {selectedConversation.productPrice && (
                  <span className="text-xs font-medium text-primary-100">{selectedConversation.productPrice.toLocaleString('fr-FR')} XOF</span>
                )}
              </div>
            )}
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div className="text-center py-8">
                <MessageSquare className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">Commencez la conversation</p>
              </div>
            )}
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
            <div ref={messagesEndRef} />
          </div>

          {/* Send Form */}
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
                disabled={!newMessage.trim() || sending}
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
