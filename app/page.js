import Link from 'next/link';

export default function Home() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f5f5f5' }}>
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Task Management App</h1>
        <p style={{ marginBottom: '2rem', color: '#666' }}>Organize your tasks efficiently</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Link 
            href="/login" 
            style={{ padding: '0.75rem 1.5rem', backgroundColor: '#0070f3', color: 'white', textDecoration: 'none', borderRadius: '0.375rem' }}
          >
            Sign In
          </Link>
          <Link 
            href="/register" 
            style={{ padding: '0.75rem 1.5rem', backgroundColor: '#10b981', color: 'white', textDecoration: 'none', borderRadius: '0.375rem' }}
          >
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
}
