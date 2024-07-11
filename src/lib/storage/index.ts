import Storage from "./type";
import SupabaseStorage from "./supabaseStorage";

const storage = {
  image: SupabaseStorage(process.env.SUPABASE_IMAGE_BUCKET as string),
  file: SupabaseStorage(process.env.SUPABASE_FILE_BUCKET as string),
};

export default storage;

export { SupabaseStorage };
export type { Storage };
