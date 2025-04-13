import { supabase } from '../client'

export class BaseModel {
  protected static tableName: string;
  
  static async findAll(options: any = {}) {
    let query = supabase.from(this.tableName).select(options.select || '*');
    
    if (options.where) {
      query = query.match(options.where);
    }
    
    if (options.order) {
      query = query.order(options.order.column, { ascending: options.order.ascending });
    }
    
    if (options.limit) {
      query = query.limit(options.limit);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    return data;
  }
  
  static async findById(id: string, select: string = '*') {
    const { data, error } = await supabase
      .from(this.tableName)
      .select(select)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }
  
  static async create(data: any) {
    const { data: result, error } = await supabase
      .from(this.tableName)
      .insert(data)
      .select();
    
    if (error) throw error;
    return result[0];
  }
  
  static async update(id: string, data: any) {
    const { data: result, error } = await supabase
      .from(this.tableName)
      .update(data)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    return result[0];
  }
  
  static async delete(id: string) {
    const { error } = await supabase
      .from(this.tableName)
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  }
}
