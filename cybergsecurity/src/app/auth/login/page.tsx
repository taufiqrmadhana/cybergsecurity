import { InfoPanel } from '../../components/auth/InfoPanel';
import { LoginForm } from '../../components/auth/LoginForm';

export default function LoginPage() {
  return (
    <main className="flex min-h-screen bg-white">
      <InfoPanel />
      
      <div className="w-full lg:w-1/2">
        <LoginForm />
      </div>
    </main>
  );
}