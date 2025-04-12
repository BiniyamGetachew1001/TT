import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Button, TextField, MenuItem, Select, FormControl, InputLabel, Chip, Box, Typography } from '@mui/material';
import { Editor } from '@tinymce/tinymce-react';

interface BlogPostFormProps {
  initialData?: any;
  onSubmit: (data: any) => void;
  isLoading: boolean;
}

const BLOG_CATEGORIES = [
  'Business',
  'Entrepreneurship',
  'Finance',
  'Marketing',
  'Self-Development',
  'Technology',
  'Other'
];

const BlogPostForm: React.FC<BlogPostFormProps> = ({ initialData, onSubmit, isLoading }) => {
  const { register, handleSubmit, control, setValue, watch, formState: { errors } } = useForm({
    defaultValues: initialData || {
      title: '',
      excerpt: '',
      content: '',
      category: '',
      tags: [],
      status: 'draft',
      coverImage: ''
    }
  });
  
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(initialData?.coverImage || null);
  const [tagInput, setTagInput] = useState('');
  const tags = watch('tags') || [];
  
  useEffect(() => {
    if (initialData) {
      Object.keys(initialData).forEach(key => {
        setValue(key, initialData[key]);
      });
      
      if (initialData.coverImage) {
        setCoverImagePreview(initialData.coverImage);
      }
    }
  }, [initialData, setValue]);
  
  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setCoverImagePreview(base64String);
        setValue('coverImage', base64String);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setValue('tags', [...tags, tagInput.trim()]);
      setTagInput('');
    }
  };
  
  const handleRemoveTag = (tagToRemove: string) => {
    setValue('tags', tags.filter((tag: string) => tag !== tagToRemove));
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box sx={{ mb: 3 }}>
        <TextField
          label="Title"
          fullWidth
          {...register('title', { required: 'Title is required' })}
          error={!!errors.title}
          helperText={errors.title?.message as string}
          sx={{ mb: 2 }}
        />
        
        <TextField
          label="Excerpt"
          fullWidth
          multiline
          rows={3}
          {...register('excerpt', { required: 'Excerpt is required' })}
          error={!!errors.excerpt}
          helperText={errors.excerpt?.message as string}
          sx={{ mb: 2 }}
        />
        
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Category</InputLabel>
          <Controller
            name="category"
            control={control}
            rules={{ required: 'Category is required' }}
            render={({ field }) => (
              <Select
                {...field}
                label="Category"
                error={!!errors.category}
              >
                {BLOG_CATEGORIES.map(category => (
                  <MenuItem key={category} value={category}>{category}</MenuItem>
                ))}
              </Select>
            )}
          />
          {errors.category && (
            <Typography color="error" variant="caption">
              {errors.category.message as string}
            </Typography>
          )}
        </FormControl>
        
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            Tags
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <TextField
              label="Add tag"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleKeyDown}
              sx={{ mr: 1 }}
            />
            <Button variant="outlined" onClick={handleAddTag}>
              Add
            </Button>
          </Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {tags.map((tag: string) => (
              <Chip
                key={tag}
                label={tag}
                onDelete={() => handleRemoveTag(tag)}
              />
            ))}
          </Box>
        </Box>
        
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            Cover Image
          </Typography>
          <input
            type="file"
            accept="image/*"
            onChange={handleCoverImageChange}
            style={{ marginBottom: '10px' }}
          />
          {coverImagePreview && (
            <Box sx={{ mt: 1 }}>
              <img
                src={coverImagePreview}
                alt="Cover preview"
                style={{ maxWidth: '100%', maxHeight: '200px' }}
              />
            </Box>
          )}
        </Box>
        
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            Content
          </Typography>
          <Controller
            name="content"
            control={control}
            rules={{ required: 'Content is required' }}
            render={({ field: { onChange, value } }) => (
              <Editor
                apiKey="your-tinymce-api-key"
                value={value}
                onEditorChange={onChange}
                init={{
                  height: 500,
                  menubar: true,
                  plugins: [
                    'advlist autolink lists link image charmap print preview anchor',
                    'searchreplace visualblocks code fullscreen',
                    'insertdatetime media table paste code help wordcount'
                  ],
                  toolbar:
                    'undo redo | formatselect | bold italic backcolor | \
                    alignleft aligncenter alignright alignjustify | \
                    bullist numlist outdent indent | removeformat | help'
                }}
              />
            )}
          />
          {errors.content && (
            <Typography color="error" variant="caption">
              {errors.content.message as string}
            </Typography>
          )}
        </Box>
        
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Status</InputLabel>
          <Controller
            name="status"
            control={control}
            rules={{ required: 'Status is required' }}
            render={({ field }) => (
              <Select
                {...field}
                label="Status"
                error={!!errors.status}
              >
                <MenuItem value="draft">Draft</MenuItem>
                <MenuItem value="published">Published</MenuItem>
              </Select>
            )}
          />
        </FormControl>
      </Box>
      
      <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={isLoading}
        sx={{ mr: 1 }}
      >
        {isLoading ? 'Saving...' : initialData ? 'Update Post' : 'Create Post'}
      </Button>
      
      <Button
        variant="outlined"
        color="secondary"
        onClick={() => window.history.back()}
      >
        Cancel
      </Button>
    </form>
  );
};

export default BlogPostForm;
