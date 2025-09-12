'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function TaskForm({ task }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('pending');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setStatus(task.status);
    }
  }, [task]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // for form validation
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    
    if (title.length > 100) {
      setError('Title must be less than 100 characters');
      return;
    }
    
    if (description.length > 500) {
      setError('Description must be less than 500 characters');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const url = task ? `/api/tasks/${task._id}` : '/api/tasks';
      const method = task ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, description, status }),
      });

      if (response.ok) {
        router.push('/dashboard');
        router.refresh();
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Something went wrong');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // for error clening on typing
    if (error) setError('');
    
    if (name === 'title') setTitle(value);
    if (name === 'description') setDescription(value);
    if (name === 'status') setStatus(value);
  };

  return (
    <form onSubmit={handleSubmit} className="card">
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      
      <div className="form-group">
        <label htmlFor="title" className="form-label">
          Title *
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={title}
          onChange={handleChange}
          required
          maxLength={100}
          className={`form-input ${error && !title.trim() ? 'form-input-error' : ''}`}
        />
        <div className="text-sm text-gray-600 mt-1">
          {title.length}/100 characters
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="description" className="form-label">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={description}
          onChange={handleChange}
          rows="4"
          maxLength={500}
          className="form-textarea"
        />
        <div className="text-sm text-gray-600 mt-1">
          {description.length}/500 characters
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="status" className="form-label">
          Status
        </label>
        <select
          id="status"
          name="status"
          value={status}
          onChange={handleChange}
          className="form-select"
        >
          <option value="pending">Pending</option>
          <option value="done">Done</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`btn ${loading ? 'btn-secondary' : 'btn-primary'} w-full`}
      >
        {loading ? (
          <span className="flex items-center justify-center">
            <span className="loading-spinner mr-2"></span>
            Loading...
          </span>
        ) : task ? 'Update Task' : 'Create Task'}
      </button>
    </form>
  );
}