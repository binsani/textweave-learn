import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const DOMAIN = "masashilearn.com.ng";

function buildBaseEmail(firstName: string, lastName: string): string {
  const f = firstName.trim().toLowerCase().replace(/[^a-z0-9]/g, "");
  const l = lastName.trim().toLowerCase().replace(/[^a-z0-9]/g, "");
  if (!f) return "";
  return l ? `${f}.${l}` : f;
}

async function findUniqueEmail(adminClient: any, firstName: string, lastName: string): Promise<string> {
  const base = buildBaseEmail(firstName, lastName);
  if (!base) return "";

  // Try base email first
  let candidate = `${base}@${DOMAIN}`;
  const { count } = await adminClient
    .from("purchase_code_redemptions")
    .select("id", { count: "exact", head: true })
    .eq("generated_email", candidate);

  if (!count || count === 0) return candidate;

  // Append incrementing number until unique
  let i = 2;
  while (true) {
    candidate = `${base}${i}@${DOMAIN}`;
    const { count: c } = await adminClient
      .from("purchase_code_redemptions")
      .select("id", { count: "exact", head: true })
      .eq("generated_email", candidate);
    if (!c || c === 0) return candidate;
    i++;
  }
}

function buildPassword(code: string): string {
  return `Masashi_${code}!`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { code, first_name, last_name } = await req.json();

    if (!code || typeof code !== "string" || code.trim().length === 0) {
      return new Response(JSON.stringify({ error: "Purchase code is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const adminClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    // Look up the purchase code
    const { data: purchaseCode, error: codeError } = await adminClient
      .from("purchase_codes")
      .select("*")
      .eq("code", code.trim())
      .single();

    if (codeError || !purchaseCode) {
      return new Response(JSON.stringify({ error: "Invalid purchase code" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!purchaseCode.is_active) {
      return new Response(JSON.stringify({ error: "This purchase code has been deactivated" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (purchaseCode.expires_at && new Date(purchaseCode.expires_at) < new Date()) {
      return new Response(JSON.stringify({ error: "This purchase code has expired" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Use name from purchase code record (set by admin at creation time)
    const fName = purchaseCode.student_first_name || first_name?.trim() || "Student";
    const lName = purchaseCode.student_last_name || last_name?.trim() || "";

    // Build credentials using the name-based email format
    const generatedEmail = buildEmail(fName, lName);
    const generatedPassword = buildPassword(purchaseCode.code);

    if (!generatedEmail) {
      return new Response(JSON.stringify({ error: "Invalid student name on this purchase code" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check for existing redemption (return login)
    const { data: existingRedemption } = await adminClient
      .from("purchase_code_redemptions")
      .select("user_id, generated_email")
      .eq("code_id", purchaseCode.id)
      .limit(1)
      .maybeSingle();

    if (existingRedemption) {
      // Sign in as existing user
      const anonClient = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY")!, {
        auth: { autoRefreshToken: false, persistSession: false },
      });

      const { data: signInData, error: signInError } = await anonClient.auth.signInWithPassword({
        email: existingRedemption.generated_email,
        password: generatedPassword,
      });

      if (signInError) {
        return new Response(JSON.stringify({ error: "Failed to sign in. Please contact support." }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify({
        session: signInData.session,
        returning: true,
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // New redemption - check max uses
    if (purchaseCode.used_count >= purchaseCode.max_uses) {
      return new Response(JSON.stringify({ error: "This purchase code has reached its maximum uses" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Create user via admin API
    const { data: newUser, error: createError } = await adminClient.auth.admin.createUser({
      email: generatedEmail,
      password: generatedPassword,
      email_confirm: true,
      user_metadata: {
        first_name: fName,
        last_name: lName,
        role: "student",
      },
    });

    if (createError) {
      console.error("Create user error:", createError);
      return new Response(JSON.stringify({ error: "Failed to create account. Please try again." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Enroll user in courses
    const courseIds = purchaseCode.course_ids || [];
    if (courseIds.length > 0) {
      const enrollments = courseIds.map((courseId: string) => ({
        user_id: newUser.user.id,
        course_id: courseId,
        status: "active",
      }));

      await adminClient.from("enrollments").insert(enrollments);
    }

    // Record the redemption
    await adminClient.from("purchase_code_redemptions").insert({
      code_id: purchaseCode.id,
      user_id: newUser.user.id,
      generated_email: generatedEmail,
    });

    // Increment used_count
    await adminClient
      .from("purchase_codes")
      .update({ used_count: purchaseCode.used_count + 1 })
      .eq("id", purchaseCode.id);

    // Sign in the new user
    const anonClient = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY")!, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const { data: signInData, error: signInError } = await anonClient.auth.signInWithPassword({
      email: generatedEmail,
      password: generatedPassword,
    });

    if (signInError) {
      return new Response(JSON.stringify({ error: "Account created but sign-in failed. Please try again." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({
      session: signInData.session,
      returning: false,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Unexpected error:", err);
    return new Response(JSON.stringify({ error: "An unexpected error occurred" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
