export default function Dashboard({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
      <div className="bg-white py-16  min-h-screen">
        {children}
      </div>
    );
  }