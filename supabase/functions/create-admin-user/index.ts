import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

Deno.serve(async (req) => {
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const email = "albiza@minecrate.local";
  const password = "02LuKa27!";
  const username = "Albiza";

  // Create user via admin API
  const { data: userData, error: createError } =
    await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { username },
    });

  if (createError) {
    // If already exists, just ensure admin flag
    if (createError.message?.includes("already been registered")) {
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ is_admin: true })
        .eq("username", "Albiza");

      return new Response(
        JSON.stringify({ message: "User already exists, set as admin", updateError }),
        { headers: { "Content-Type": "application/json" } }
      );
    }
    return new Response(JSON.stringify({ error: createError.message }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Set as admin
  if (userData?.user) {
    await supabase
      .from("profiles")
      .update({ is_admin: true })
      .eq("user_id", userData.user.id);
  }

  return new Response(
    JSON.stringify({ message: "Admin user Albiza created successfully" }),
    { headers: { "Content-Type": "application/json" } }
  );
});
