'use client'

import { useState } from 'react'
import { authClient } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff } from 'lucide-react'
import Header from '../../../components/header/header/header'
import signinImage from '../../../assets/img/signin.jpg'
import styles from './signin.module.css'

export default function SignInPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (!email || !password) {
      setError('Email and password are required.')
      setLoading(false)
      return
    }

    const normalizedEmail = email.toLowerCase()

    try {
      const { error } = await authClient.signIn.email({
        email: normalizedEmail,
        password,
      })

      if (error) {
        setError(error.message || 'Sign-in failed. Please check your credentials.')
        setLoading(false)
        return
      }

      router.push('/patients')
    } catch (err: any) {
      setError(err?.message || 'Sign-in failed. Please check your credentials.')
      setLoading(false)
    }
  }

  return (
    <div>
      <Header />
      <main className={styles.mainContent}>
        <div className={styles.loginCard}>
          <div className={styles.loginImage}>
            <img src={signinImage.src} alt="Hero" className={styles.heroImage} />
          </div>
          <div className={styles.loginFormContainer}>
            <p className={styles.loginTitle}>
              Explore the next level of efficiency with CliP!
            </p>
            <p className={styles.description}>
              Access CliP (Diamond Clinician Communication Platform) for an immersive experience planning and tracking your patients’ treatments.
            </p>
            <form className={styles.loginForm} onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className={styles.inputField}
                />
              </div>
              <div className={styles.formGroup} style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className={styles.inputField}
                />
                <span
                  style={{
                    position: 'absolute',
                    right: 16,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    cursor: 'pointer',
                    zIndex: 2
                  }}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </span>
              </div>
              {error && (
                <div className={styles.errorMessage}>
                  {error}
                </div>
              )}
              <button
                type="submit"
                className={styles.loginButton}
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}