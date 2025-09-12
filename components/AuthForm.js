'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

export default function AuthForm({ mode }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    if (mode === 'register') {
      try {
        const res = await fetch('/api/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });

        // for checking if responce is OK
        if (res.ok) {
          router.push('/login');
          router.refresh(); 
        } else {
          // for parsing error response
          try {
            const errorData = await res.json();
            setError(errorData.error || 'Registration failed');
          } catch (parseError) {
            setError('Registration failed. Please try again.');
          }
        }
      } catch (error) {
        console.error('Registration error:', error);
        setError('Network error. Please try again.');
      } finally {
        setIsLoading(false);
      }
    } else {
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result.error) {
        setError(result.error);
        setIsLoading(false);
      } else {
        router.push('/dashboard');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {error && <div style={{ color: 'red', padding: '0.5rem', backgroundColor: '#fee2e2', borderRadius: '0.375rem' }}>{error}</div>}
      {mode === 'register' && (
        <div>
          <label htmlFor="name" style={{ display: 'block', marginBottom: '0.5rem' }}>Name</label>
          <input
            type="text"
            id="name"
            name="name"
            required
            style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.375rem' }}
          />
        </div>
      )}
      <div>
        <label htmlFor="email" style={{ display: 'block', marginBottom: '0.5rem' }}>Email</label>
        <input
          type="email"
          id="email"
          name="email"
          required
          style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.375rem' }}
        />
      </div>
      <div>
        <label htmlFor="password" style={{ display: 'block', marginBottom: '0.5rem' }}>Password</label>
        <input
          type="password"
          id="password"
          name="password"
          required
          style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.375rem' }}
        />
      </div>
      <button
        type="submit"
        disabled={isLoading}
        className={`btn btn-primary btn-ripple add-task-btn`}
        style={{
          width: "100%",
          marginTop: "1rem",
          background: isLoading ? "#9ca3af" : "", // gray when loading
          cursor: isLoading ? "not-allowed" : "pointer",
        }}
      >
        {isLoading ? "Loading..." : mode === "register" ? "Register" : "Login"}
      </button>
    </form>
  );
}