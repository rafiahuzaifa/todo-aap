import RegisterForm from '@/components/RegisterForm'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <RegisterForm />
      </main>
      <Footer />
    </div>
  )
}
