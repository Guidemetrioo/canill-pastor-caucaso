import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

const supabase = createClient(supabaseUrl, supabaseKey);

function isSupabaseConfigured() {
  return !!(
    supabaseUrl &&
    supabaseUrl !== "https://your-project.supabase.co" &&
    !supabaseUrl.includes("your-project") &&
    supabaseKey &&
    !supabaseKey.includes("placeholder")
  );
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { event_type, page_path, session_id, device_type, referrer } = body;

    if (!isSupabaseConfigured()) {
      console.log(`[API Traffic Mock] Tracked ${event_type} on ${page_path}`);
      return NextResponse.json({ success: true, mock: true });
    }

    const { data, error } = await supabase
      .from("traffic_events")
      .insert({
        event_type,
        page_path: page_path || "/",
        session_id: session_id || "unknown",
        device_type: device_type || "desktop",
        referrer: referrer || "direct"
      })
      .select();

    if (error) {
      console.error("Error inserting traffic event in database:", error.message);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error("Error in traffic API route:", error.message);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
