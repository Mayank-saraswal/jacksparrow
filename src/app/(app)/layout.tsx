import { AppSidebar } from "./_components/app-sidebar";
import { ProductTour } from "./_components/product-tour";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-[calc(100vh-3rem)] overflow-hidden">
      <AppSidebar />
      <div className="flex min-w-0 flex-1 flex-col overflow-y-auto">
        {children}
      </div>
      <ProductTour />
    </div>
  );
}
