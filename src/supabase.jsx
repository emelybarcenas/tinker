import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://kfnwlnybjcdjutidgjwi.supabase.co'; // Replace with your Supabase URL
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtmbndsbnliamNkanV0aWRnandpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU1MjM4NDAsImV4cCI6MjA2MTA5OTg0MH0.EMKTufEBALDidD5ovNt-Lz9cBQYZB8IdSLY12mpEQCc'; // Replace with your Supabase public anon key

export const supabase = createClient(supabaseUrl, supabaseKey);
