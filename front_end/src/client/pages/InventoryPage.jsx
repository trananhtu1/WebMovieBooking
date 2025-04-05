import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db, auth } from '../../firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import { Ticket } from '../components/Ticket';
import Loading from '../components/Loading';

export function InventoryPage() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all', 'paid', 'unpaid', 'pending'
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredTickets, setFilteredTickets] = useState([]);

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        fetchUserTickets(currentUser.uid);
      } else {
        setTickets([]);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Fetch tickets when filter changes
  useEffect(() => {
    if (user) {
      fetchUserTickets(user.uid);
    }
  }, [filter, user]);

  // Update filtered tickets when search term or tickets change
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredTickets(tickets);
      return;
    }

    const lowercaseSearch = searchTerm.toLowerCase();
    const results = tickets.filter(ticket => 
      ticket.movieTitle?.toLowerCase().includes(lowercaseSearch) ||
      ticket.theater?.toLowerCase().includes(lowercaseSearch) ||
      ticket.id?.toLowerCase().includes(lowercaseSearch)
    );
    
    setFilteredTickets(results);
  }, [searchTerm, tickets]);

  const fetchUserTickets = async (userId) => {
    try {
      setLoading(true);
      
      // Create base query for user's tickets
      let ticketsQuery;
      
      // Base query with ordering by creation date (newest first)
      if (filter === 'all') {
        ticketsQuery = query(
          collection(db, 'tickets'),
          where('userId', '==', userId),
          orderBy('createdAt', 'desc')
        );
      } 
      else if (filter === 'paid') {
        ticketsQuery = query(
          collection(db, 'tickets'),
          where('userId', '==', userId),
          where('isPaid', '==', true),
          orderBy('createdAt', 'desc')
        );
      } 
      else if (filter === 'unpaid') {
        ticketsQuery = query(
          collection(db, 'tickets'),
          where('userId', '==', userId),
          where('isPaid', '==', false),
          orderBy('createdAt', 'desc')
        );
      }
      else if (filter === 'pending') {
        ticketsQuery = query(
          collection(db, 'tickets'),
          where('userId', '==', userId),
          where('paymentStatus', '==', 'pending'),
          orderBy('createdAt', 'desc')
        );
      }
      
      const querySnapshot = await getDocs(ticketsQuery);
      
      const ticketList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setTickets(ticketList);
      setFilteredTickets(ticketList);
    } catch (error) {
      console.error('Error fetching tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setSearchTerm(''); // Reset search when changing filter
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Vé của tôi</h2>
          <div className="bg-white p-8 rounded-lg shadow-md">
            <p className="text-gray-600 mb-4">Vui lòng đăng nhập để xem vé của bạn.</p>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              onClick={() => window.location.href = '/login'}
            >
              Đăng nhập
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Vé của tôi</h2>
        
        {/* Search bar */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm kiếm theo tên phim, rạp..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={handleSearch}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
          </div>
        </div>
        
        {/* Filter buttons */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            className={`px-4 py-2 rounded-lg border ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
            onClick={() => handleFilterChange('all')}
          >
            Tất cả
          </button>
          <button
            className={`px-4 py-2 rounded-lg border ${filter === 'paid' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
            onClick={() => handleFilterChange('paid')}
          >
            Đã thanh toán
          </button>
          <button
            className={`px-4 py-2 rounded-lg border ${filter === 'pending' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
            onClick={() => handleFilterChange('pending')}
          >
            Đang xử lý
          </button>
          <button
            className={`px-4 py-2 rounded-lg border ${filter === 'unpaid' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
            onClick={() => handleFilterChange('unpaid')}
          >
            Chưa thanh toán
          </button>
        </div>
        
        {loading ? (
          <Loading text="Đang tải vé..." />
        ) : filteredTickets.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow text-center">
            {searchTerm.trim() !== '' ? (
              <p className="text-gray-600">Không tìm thấy vé nào phù hợp với từ khóa "{searchTerm}".</p>
            ) : (
              <p className="text-gray-600">Bạn chưa có vé nào{filter !== 'all' ? ` ${filter === 'paid' ? 'đã thanh toán' : filter === 'pending' ? 'đang xử lý' : 'chưa thanh toán'}` : ''}.</p>
            )}
          </div>
        ) : (
          <>
            {searchTerm.trim() !== '' && (
              <p className="mb-4 text-sm text-gray-600">Tìm thấy {filteredTickets.length} kết quả cho "{searchTerm}"</p>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredTickets.map(ticket => (
                <Ticket key={ticket.id} ticket={ticket} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default InventoryPage;