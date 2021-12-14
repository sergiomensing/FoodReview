import { ChangeEvent, useEffect, useState } from 'react';
import { supabase } from '../utils/supabaseClient';

export type MealPhotoProps = {
  url?: string | undefined;
  onUpload: (filePath: string) => void;
};

export const MealPhoto = ({ url, onUpload }: MealPhotoProps) => {
  const [mealUrl, setMealUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    console.log(url);
    if (url) downloadImage(url);
  }, [url]);

  async function downloadImage(path: string) {
    try {
      const { data, error } = await supabase.storage.from('meals').getPublicUrl(path);
      if (error) {
        throw error;
      }
      if (!data?.publicURL) {
        return;
      }
      setMealUrl(data.publicURL);
    } catch (error: any) {
      console.log('Error downloading image: ', error.message);
    }
  }

  async function uploadMealPhoto(event: ChangeEvent<HTMLInputElement>) {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      let { error: uploadError } = await supabase.storage.from('meals').upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      onUpload(filePath);
    } catch (error: any) {
      alert(error.message);
    } finally {
      setUploading(false);
    }
  }

  return (
    <>
      {mealUrl && <img src={mealUrl} alt="Avatar" className="object-contain" style={{ height: 200, width: '100%' }} />}
      <label
        className="w-full flex justify-center text-center bg-background-light py-2 px-3 rounded-md"
        htmlFor="single"
      >
        {uploading ? 'Uploading ...' : mealUrl ? 'Change' : 'Upload'}
      </label>
      <input
        className="absolute"
        style={{ visibility: 'hidden' }}
        type="file"
        id="single"
        accept="image/*"
        onChange={uploadMealPhoto}
        disabled={uploading}
      />
    </>
  );
};
