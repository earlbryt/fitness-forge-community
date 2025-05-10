import { SupabaseDemo } from "@/components/SupabaseDemo";

export default function SupabaseTest() {
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Supabase Connection Test</h1>
      <p className="mb-6 text-muted-foreground">
        This page demonstrates connectivity to your Supabase project. Use the card below to test
        the connection and see basic project information.
      </p>
      
      <div className="mt-8">
        <SupabaseDemo />
      </div>
    </div>
  );
} 