import React, { useState } from 'react'
import { Upload, X, Plus, Image as ImageIcon, Loader2 } from 'lucide-react'
import useProductStore from '../../store/productStore'

const ProductPhotoUpload = ({ initialImages = [], onImagesChange }) => {
  const [images, setImages] = useState(initialImages)
  const [uploadingIndex, setUploadingIndex] = useState(null)
  const [dragActive, setDragActive] = useState(false)
  const { uploadProductImage } = useProductStore()

  const handleFileUpload = async (files) => {
    const fileArray = Array.from(files)
    
    for (let i = 0; i < fileArray.length; i++) {
      const file = fileArray[i]
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select only image files')
        continue
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Please select images smaller than 5MB')
        continue
      }
      
      setUploadingIndex(images.length + i)
      
      try {
        const imageUrl = await uploadProductImage(file)
        const newImages = [...images, imageUrl]
        setImages(newImages)
        onImagesChange(newImages)
      } catch (error) {
        console.error('Upload failed:', error)
        alert('Failed to upload image. Please try again.')
      }
    }
    
    setUploadingIndex(null)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragActive(false)
    
    const files = e.dataTransfer.files
    handleFileUpload(files)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setDragActive(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setDragActive(false)
  }

  const handleFileInput = (e) => {
    const files = e.target.files
    if (files.length > 0) {
      handleFileUpload(files)
    }
  }

  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index)
    setImages(newImages)
    onImagesChange(newImages)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Product Photos</h3>
        <span className="text-sm text-gray-500">{images.length}/5 images</span>
      </div>

      {/* Image Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((image, index) => (
          <div key={index} className="relative group">
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={image}
                alt={`Product ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
            <button
              onClick={() => removeImage(index)}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
            >
              <X size={16} />
            </button>
          </div>
        ))}

        {/* Upload Area */}
        {images.length < 5 && (
          <div className="relative">
            <div
              className={`aspect-square border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all duration-200 ${
                dragActive
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => document.getElementById('photo-upload').click()}
            >
              {uploadingIndex !== null ? (
                <div className="text-center">
                  <Loader2 className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Uploading...</p>
                </div>
              ) : (
                <div className="text-center">
                  <Plus className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Add Photo</p>
                </div>
              )}
            </div>
            
            <input
              id="photo-upload"
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileInput}
              className="hidden"
            />
          </div>
        )}
      </div>

      {/* Upload Instructions */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <ImageIcon className="w-5 h-5 text-gray-400 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-1">Photo Guidelines</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Upload up to 5 high-quality images</li>
              <li>• Supported formats: JPG, PNG, WebP</li>
              <li>• Maximum file size: 5MB per image</li>
              <li>• Recommended size: 1200x1200 pixels</li>
              <li>• First image will be used as the main product image</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bulk Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
          dragActive
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <Upload className="w-10 h-10 text-gray-400 mx-auto mb-4" />
        <p className="text-lg font-medium text-gray-900 mb-2">
          Drag and drop images here
        </p>
        <p className="text-sm text-gray-600 mb-4">
          Or click to browse your computer
        </p>
        <button
          onClick={() => document.getElementById('bulk-upload').click()}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Plus className="w-4 h-4 mr-2" />
          Choose Files
        </button>
        
        <input
          id="bulk-upload"
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileInput}
          className="hidden"
        />
      </div>
    </div>
  )
}

export default ProductPhotoUpload
