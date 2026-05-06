import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  "https://mkktaatwnpeqbwvetfsq.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ra3RhYXR3bnBlcWJ3dmV0ZnNxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc5OTc4MjgsImV4cCI6MjA5MzU3MzgyOH0.9PONwZ86J8_PmCd8RcueVFUrB8OEUG12lGuD5AFFizc"
);
