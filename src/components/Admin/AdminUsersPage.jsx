import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { getImageUrl } from '../../utils/image'
import { motion } from 'framer-motion'
import { Users, Shield, Store, Search } from 'lucide-react'

export default function AdminUsersPage() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => { fetchUsers() }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('profiles')
        .select('*, stores(id, name, slug, approval_status, is_certified)')
        .order('created_at', { ascending: false })
      if (error) throw error
      setUsers(data || [])
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  const getRoleBadge = (role) => {
    const styles = {
      admin: 'bg-red-100 text-red-700',
      seller: 'bg-blue-100 text-blue-700',
      buyer: 'bg-gray-100 text-gray-700',
    }
    const labels = { admin: 'Admin', seller: 'Vendeur', buyer: 'Acheteur' }
    return (
      <span className={`text-xs px-2 py-1 rounded-full ${styles[role] || styles.buyer}`}>
        {labels[role] || role}
      </span>
    )
  }

  const filteredUsers = users.filter(u =>
    u.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Utilisateurs</h1>
        <p className="text-gray-500">Gestion des comptes utilisateurs</p>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Rechercher un utilisateur..."
          className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none" />
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Utilisateur</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Role</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Boutique</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Inscrit le</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.map((user) => (
                <motion.tr key={user.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img src={getImageUrl(user.avatar_url, user.updated_at) || `https://ui-avatars.com/api/?name=${user.full_name}&background=1E3A8B&color=fff`}
                        alt="" className="w-8 h-8 rounded-full" />
                      <div>
                        <p className="font-medium text-sm text-gray-900">{user.full_name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">{getRoleBadge(user.role)}</td>
                  <td className="px-4 py-3">
                    {user.stores?.length > 0 ? (
                      <div>
                        <p className="text-sm font-medium text-gray-900">{user.stores[0].name}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          user.stores[0].approval_status === 'approved' ? 'bg-green-100 text-green-700' :
                          user.stores[0].approval_status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {user.stores[0].approval_status === 'approved' ? 'Approuvee' :
                           user.stores[0].approval_status === 'pending' ? 'En attente' : 'Rejetee'}
                        </span>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">Aucune</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {new Date(user.created_at).toLocaleDateString('fr-FR')}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredUsers.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>Aucun utilisateur trouve</p>
          </div>
        )}
      </div>
    </div>
  )
}