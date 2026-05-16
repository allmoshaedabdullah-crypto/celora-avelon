import { supabase } from '../lib/supabase';

// --- Types ---
export type OrderStatus = 'NEW' | 'PLACED' | 'HOLD' | 'DELIVERY';

export interface Order {
  id: string;
  customerName: string;
  orderNumber: string;
  status: OrderStatus;
  date: string;
  images: string[];
  description: string;
  amount: number;
  paidAmount: number;
  shippingMark: string;
  contact: string;
  location: string;
  facebookLink: string;
  brand: 'Celora' | 'Avelon';
  category: 'Dress' | 'Shoes';
}

export interface CatalogImage {
  id: string;
  url: string;
  price: string;
  size: string;
  folder_id: string;
}

export interface CatalogFolder {
  id: string;
  name: string;
  items?: CatalogImage[];
}

export interface GalleryImage {
  id: string;
  url: string;
  size: string;
  folder_id: string;
}

export interface GalleryFolder {
  id: string;
  name: string;
  images?: GalleryImage[];
}

// --- Utils ---
async function checkAuth() {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error || !session) {
    throw new Error('AUTHENTICATION_REQUIRED');
  }
  return session;
}

async function uploadToSupabase(file: File | string, bucket: string): Promise<string> {
  await checkAuth();
  let finalFile: File;
  
  if (typeof file === 'string') {
    // Convert base64 to File
    const res = await fetch(file);
    const blob = await res.blob();
    finalFile = new File([blob], `img_${Date.now()}.jpg`, { type: 'image/jpeg' });
  } else {
    finalFile = file;
  }

  const fileExt = finalFile.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
  const filePath = `uploads/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(filePath, finalFile);

  if (uploadError) throw uploadError;

  const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
  return data.publicUrl;
}

// --- Order Services ---
export const orderServices = {
  async fetchAll() {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      console.error('DEBUG: fetchAll Error:', error);
      throw error;
    }
    
    if (data && data.length > 0) {
      console.log('DEBUG: First Order Record Columns:', Object.keys(data[0]));
      console.log('DEBUG: First Order Sample Data:', data[0]);
    } else {
      console.log('DEBUG: No orders found yet.');
    }
    
    return (data || []).map(o => ({
      ...o,
      customerName: o.customer_name,
      orderNumber: o.order_number,
      paidAmount: o.paid_amount,
      shippingMark: o.shipping_mark,
      facebookLink: o.facebook_link,
    })) as Order[];
  },

  async save(order: Partial<Order>, existingImages: string[] = [], newFiles: (File | string)[] = []) {
    const session = await checkAuth();
    console.log('DEBUG: Start Save. Session:', !!session);
    
    let uploadedUrls: string[] = [];
    try {
      uploadedUrls = await Promise.all(newFiles.map(f => uploadToSupabase(f, 'order-images')));
    } catch (uploadErr) {
      console.error('DEBUG: Upload failed, proceeding without new images for test if needed or failing early.', uploadErr);
      // throw uploadErr; // Let's see if it works without images first if specifically failing on insert
    }
    
    const allImages = [...existingImages, ...uploadedUrls];

    const dbPayload: any = {
      // user_id: session.user.id, // TEMPORARILY REMOVED FOR DEBUGGING
      customer_name: order.customerName,
      order_number: order.orderNumber,
      status: order.status,
      date: order.date,
      description: order.description,
      amount: order.amount,
      paid_amount: order.paidAmount,
      shipping_mark: order.shippingMark,
      contact: order.contact,
      location: order.location,
      facebook_link: order.facebookLink,
      brand: order.brand,
      category: order.category,
      images: allImages,
    };

    console.log('DEBUG: DB Payload:', dbPayload);

    if (order.id) {
      const { data, error } = await supabase
        .from('orders')
        .update(dbPayload)
        .eq('id', order.id)
        .select()
        .single();
      
      if (error) {
        console.error('DEBUG: Save Update Error:', error);
        throw error;
      }
      return data;
    } else {
      const { data, error } = await supabase
        .from('orders')
        .insert([dbPayload])
        .select()
        .single();
      
      if (error) {
        console.error('DEBUG: Save Insert Error (FULL):', JSON.stringify(error, null, 2));
        // Try even simpler insert if it failed
        console.log('DEBUG: Attempting Fallback Minimal Insert...');
        const tinyPayload = {
          customer_name: order.customerName || 'Test Minimal',
          status: 'NEW'
        };
        const { error: tinyError } = await supabase.from('orders').insert([tinyPayload]);
        if (tinyError) {
          console.error('DEBUG: Minimal Insert ALSO Failed (FULL):', JSON.stringify(tinyError, null, 2));
          throw new Error(`INSERT FAILED: ${error.message}. MINIMAL ALSO FAILED: ${tinyError.message}`);
        } else {
          console.log('DEBUG: Minimal Insert SUCCESS!');
          throw new Error(`FULL INSERT FAILED: ${error.message}. But minimal insert worked! This suggests a column name mismatch or type error in your payload. Please check the console logs.`);
        }
      }
      return data;
    }
  },

  async delete(id: string) {
    await checkAuth();
    const { error } = await supabase.from('orders').delete().eq('id', id);
    if (error) throw error;
  },

  async updateStatus(id: string, status: OrderStatus) {
    await checkAuth();
    const { error } = await supabase.from('orders').update({ status }).eq('id', id);
    if (error) throw error;
  }
};

// --- Catalog Services ---
export const catalogServices = {
  async fetchFolders() {
    const { data, error } = await supabase
      .from('catalog_folders')
      .select('*, items:catalog_images(*)')
      .order('created_at', { ascending: false });
    if (error) throw error;
    
    return (data || []).map(f => ({
      ...f,
      images: f.items || []
    }));
  },

  async saveFolder(name: string, id?: string) {
    const session = await checkAuth();
    if (id) {
      const { data, error } = await supabase.from('catalog_folders').update({ name }).eq('id', id).select().single();
      if (error) throw error;
      return data;
    } else {
      const { data, error } = await supabase.from('catalog_folders').insert([{ name, user_id: session.user.id }]).select().single();
      if (error) throw error;
      return data;
    }
  },

  async deleteFolder(id: string) {
    await checkAuth();
    const { error } = await supabase.from('catalog_folders').delete().eq('id', id);
    if (error) throw error;
  },

  async addImage(folderId: string, file: File | string, price: string, size: string) {
    const url = await uploadToSupabase(file, 'product-images');
    const { data, error } = await supabase
      .from('catalog_images')
      .insert([{ folder_id: folderId, url, price, size }])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updateImage(id: string, price: string, size: string, newFile?: File | string) {
    let updatePayload: any = { price, size };
    if (newFile) {
      updatePayload.url = await uploadToSupabase(newFile, 'product-images');
    }
    const { data, error } = await supabase.from('catalog_images').update(updatePayload).eq('id', id).select().single();
    if (error) throw error;
    return data;
  },

  async deleteImage(id: string) {
    await checkAuth();
    const { error } = await supabase.from('catalog_images').delete().eq('id', id);
    if (error) throw error;
  }
};

// --- Gallery Services ---
export const galleryServices = {
  async fetchFolders() {
    const { data, error } = await supabase
      .from('gallery_folders')
      .select('*, images:gallery_images(*)')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async fetchFolderById(id: string) {
    const { data, error } = await supabase
      .from('gallery_folders')
      .select('*, images:gallery_images(*)')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  },

  async saveFolder(name: string, id?: string) {
    const session = await checkAuth();
    if (id) {
      const { data, error } = await supabase.from('gallery_folders').update({ name }).eq('id', id).select().single();
      if (error) throw error;
      return data;
    } else {
      const { data, error } = await supabase.from('gallery_folders').insert([{ name, user_id: session.user.id }]).select().single();
      if (error) throw error;
      return data;
    }
  },

  async deleteFolder(id: string) {
    await checkAuth();
    const { error } = await supabase.from('gallery_folders').delete().eq('id', id);
    if (error) throw error;
  },

  async addImage(folderId: string, file: File | string, size: string) {
    const url = await uploadToSupabase(file, 'gallery-images');
    const { data, error } = await supabase
      .from('gallery_images')
      .insert([{ folder_id: folderId, url, size }])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updateImage(id: string, size: string, newFile?: File | string) {
    let updatePayload: any = { size };
    if (newFile) {
      updatePayload.url = await uploadToSupabase(newFile, 'gallery-images');
    }
    const { data, error } = await supabase.from('gallery_images').update(updatePayload).eq('id', id).select().single();
    if (error) throw error;
    return data;
  },

  async deleteImage(id: string) {
    await checkAuth();
    const { error } = await supabase.from('gallery_images').delete().eq('id', id);
    if (error) throw error;
  }
};
