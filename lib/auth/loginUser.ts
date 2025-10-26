import { supabase } from "../SupabaseClient";

const loginUser = async (email: string, password: string) => {
  try {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      console.log("Log in error:", error.message);
      return { error: error.message };
    }
  } catch (err) {
    console.log("Unexpected Error:", err);
    return { error: "Something went wrong during log in." };
  }
};

export default loginUser;
