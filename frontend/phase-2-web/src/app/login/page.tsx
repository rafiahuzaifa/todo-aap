import LoginForm from '@/components/LoginForm'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <LoginForm />
      </main>
      <Footer />
    </div>
  )
}
