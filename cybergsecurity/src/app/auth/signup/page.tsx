import { SignupForm } from '@/app/components/auth/SignupForm';
import { InfoPanel } from '../../components/auth/InfoPanel';

export default function SignUpPage() {
  return (
    <main className="flex min-h-screen bg-white">
      <InfoPanel />
      
      <div className="w-full lg:w-1/2">
        <SignupForm />
      </div>
    </main>
  );
}