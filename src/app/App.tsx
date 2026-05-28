import { AuthPage } from "../pages/auth";
import { RideBookingPage } from "../pages/ride-booking";
import { useAuthFlow } from "../features/auth";

export default function App() {
  const {
    mode,
    credentials,
    session,
    isSubmitting,
    error,
    changeMode,
    updateCredential,
    submit,
    logout,
  } = useAuthFlow();

  if (!session) {
    return (
      <AuthPage
        mode={mode}
        credentials={credentials}
        isSubmitting={isSubmitting}
        error={error}
        onModeChange={changeMode}
        onCredentialChange={updateCredential}
        onSubmit={submit}
      />
    );
  }

  return <RideBookingPage session={session} onLogout={logout} />;
}
