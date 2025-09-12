'use client';
import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await signOut({ redirect: false });
    router.push('/');
    router.refresh();
  };

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (session) {
      fetchTasks();
    }
  }, [session, searchQuery, statusFilter, currentPage]);

  const fetchTasks = async () => {
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (statusFilter !== 'all') params.append('status', statusFilter);
      params.append('page', currentPage);
      params.append('limit', '5');
      
      const response = await fetch(`/api/tasks?${params}`);
      
      if (response.ok) {
        const data = await response.json();
        setTasks(data.tasks || []);
        setTotalPages(data.pagination.pages);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to fetch tasks');
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (taskId) => {
    if (confirm('Are you sure you want to delete this task?')) {
      try {
        const response = await fetch(`/api/tasks/${taskId}`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          setTasks(tasks.filter(task => task._id !== taskId));
          setSuccessMessage('Task deleted successfully');
          setTimeout(() => setSuccessMessage(''), 3000);
        }
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    }
  };

  const toggleTaskStatus = async (taskId, currentStatus) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: currentStatus === 'done' ? 'pending' : 'done' }),
      });
      
      if (response.ok) {
        setTasks(tasks.map(task => 
          task._id === taskId 
            ? { ...task, status: task.status === 'done' ? 'pending' : 'done' }
            : task
        ));
      }
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  if (status === 'loading' || loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
    <div className="nav">
        <h1>Your Tasks</h1>
        <div className="nav-actions">
          <Link 
            href="/tasks/new" 
            className="btn btn-primary add-task-btn btn-ripple"
          >
            <svg className="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add New Task
          </Link>
          <button 
            onClick={handleLogout} 
            className={`btn logout-btn btn-ripple ${isLoggingOut ? 'btn-loading' : ''}`}
            disabled={isLoggingOut}
          >
            {!isLoggingOut && (
              <>
                <svg className="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </>
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {successMessage && (
        <div style={{ color: 'green', padding: '10px', backgroundColor: '#d1fae5', borderRadius: '5px', marginBottom: '20px' }}>
          {successMessage}
        </div>
      )}

      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px', flex: 1 }}
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="done">Done</option>
        </select>
      </div>

      {tasks.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p>No tasks yet. Create your first task!</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {tasks.map((task) => (
            <div key={task._id} style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '5px', backgroundColor: '#fff' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ margin: '0 0 10px 0' }}>{task.title}</h3>
                  <p style={{ margin: '0 0 10px 0', color: '#666' }}>{task.description}</p>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    {/* STATUS TOGGLE */}
                    <span 
                      onClick={() => toggleTaskStatus(task._id, task.status)}
                      style={{ cursor: 'pointer', marginRight: '10px' }}
                    >
                      {task.status === 'done' ? '✓' : '○'}
                    </span>
                    {/* STATUS BADGE */}
                    <span style={{ 
                      padding: '5px 10px', 
                      borderRadius: '15px', 
                      fontSize: '12px',
                      backgroundColor: task.status === 'done' ? '#d1fae5' : '#fef3c7',
                      color: task.status === 'done' ? '#065f46' : '#92400e'
                    }}>
                      {task.status}
                    </span>
                    <span style={{ fontSize: '12px', color: '#999' }}>
                      {new Date(task.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="task-actions">
                  <Link 
                    href={`/tasks/edit/${task._id}`}
                    className="task-action-btn task-action-edit btn-ripple"
                  >
                    <svg className="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit
                  </Link>
                  <button 
                    onClick={() => handleDelete(task._id)}
                    className="task-action-btn task-action-delete btn-ripple"
                  >
                    <svg className="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px', gap: '10px' }}>
          <button 
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            style={{ padding: '8px 12px', border: '1px solid #ddd', borderRadius: '4px', cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
          >
            Previous
          </button>
          <span style={{ padding: '8px' }}>Page {currentPage} of {totalPages}</span>
          <button 
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            style={{ padding: '8px 12px', border: '1px solid #ddd', borderRadius: '4px', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}