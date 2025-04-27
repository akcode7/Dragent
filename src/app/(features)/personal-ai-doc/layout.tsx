export default function PersonalDoc({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
      <div className="bg-gradient-to-b from-white to-blue-100  min-h-screen">
        {children}
      </div>
    );
  }