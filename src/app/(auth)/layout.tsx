export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-gradient-to-b from-blue-50 to-blue-100  min-h-screen">
      {children}
    </div>
  );
}