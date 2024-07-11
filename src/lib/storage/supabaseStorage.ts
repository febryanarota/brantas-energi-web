import supabase from "@/server/supabase";
import Storage from "./type";

const SupabaseStorage = (bucket: string): Storage => {
  return {
    async get(filename: string): Promise<string> {
      const { data } = supabase.storage.from(bucket).getPublicUrl(filename);
      return data.publicUrl;
    },

    async upload(filename: string, file: File): Promise<string> {
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filename, file);
      if (error) throw error;

      return data.path;
    },

    async delete(filename: string): Promise<void> {
      const { error } = await supabase.storage.from(bucket).remove([filename]);
      if (error) throw error;
    },
  };
};

export default SupabaseStorage;
