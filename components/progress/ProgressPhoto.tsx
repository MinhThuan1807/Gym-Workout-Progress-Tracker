'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { 
  Camera, Upload, Grid3x3, List, ArrowLeftRight,
  MoreVertical, Trash2, Edit, Image as ImageIcon, 
  ChevronLeft, ChevronRight, Calendar, Check
} from "lucide-react";
import Image from 'next/image'
import { useState, useMemo, useEffect } from "react";
import { progressPhoToAPI } from "@/api/progressPhoto";

// ===== TYPES =====
type PhotoView = 'front' | 'back' | 'side';
type ViewMode = 'grid' | 'timeline';

interface ProgressPhoto {
  _id: string;
  userId: string;
  takenAt: string;
  view: PhotoView;
  imageUrl: string;
  imagePublicId: string;
  note?: string;
  blurhash?: string;
}

const viewIcons: Record<PhotoView, string> = {
  front: '🧍',
  back: '🏃',
  side: '🚶'
};

const viewLabels: Record<PhotoView, string> = {
  front: 'Front View',
  back: 'Back View',
  side: 'Side View'
};



export default function ProgressPhotos() {
  const [photos, setPhotos] = useState<ProgressPhoto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [selectedView, setSelectedView] = useState<PhotoView | 'all'>('all');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedPhotoForView, setSelectedPhotoForView] = useState<ProgressPhoto | null>(null);
  
  // Upload form state
  const [uploadView, setUploadView] = useState<PhotoView>('front');
  const [uploadDate, setUploadDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [uploadNote, setUploadNote] = useState('');
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadPreview, setUploadPreview] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const fetchPhotos = async () => {
        try {
            setIsLoading(true);
            const data = await progressPhoToAPI.getAll();
           // Kiểm tra và đảm bảo data là array
            if (Array.isArray(data)) {
                console.log('Fetched photos:', data);
                setPhotos(data);
            } else if (data && Array.isArray(data.data)) {
                // Nếu API trả về { data: [...] }
                console.log('Fetched photos:', data.data);
                setPhotos(data.data);
            } else {
                console.error('Invalid data format from API:', data);
                setPhotos([]);
            }
            } catch(err) {
                console.error('Failed to fetch photos:', err);
            } finally {
            setIsLoading(false);
      };
    }
    fetchPhotos();
  }, [])

  // Filter photos
  const filteredPhotos = useMemo(() => {
    if (selectedView === 'all') return photos;
    return photos.filter(p => p.view === selectedView);
  }, [photos, selectedView]);

  // Group photos by date for timeline
  const photosByDate = useMemo(() => {
    if (!Array.isArray(filteredPhotos)) {
        console.error('filteredPhotos is not an array:', filteredPhotos);
        return [];
    }
    const grouped: Record<string, ProgressPhoto[]> = {};
    filteredPhotos.forEach(photo => {
      const date = photo.takenAt;
      if (!grouped[date]) grouped[date] = [];
      grouped[date].push(photo);
    });
    return Object.entries(grouped).sort((a, b) => 
      new Date(b[0]).getTime() - new Date(a[0]).getTime()
    );
  }, [filteredPhotos]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!uploadFile) return;
    try {
        setIsUploading(true)
         const newPhoto = await progressPhoToAPI.create({
            view: uploadView,
            takenAt: new Date(uploadDate),
            note: uploadNote,
            image: uploadFile
        });
         setPhotos([newPhoto, ...photos]);
        // Reset form
        setUploadFile(null);
        setUploadPreview('');
        setUploadNote('');
        setUploadDate(new Date().toISOString().split('T')[0]);
        setIsUploadModalOpen(false);
        setUploadView('front');
        setIsUploading(false)
    } catch (error) {
        console.log("Upload failled:", error)
    } finally {
        setIsUploading(false);
    }
 
  };

  const handleDelete = (photoId: string) => {
    setPhotos(photos.filter(p => p._id !== photoId));
  };


  const timeAgo = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  };

   // Hiển thị empty state
  if (photos.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl text-[#111827]">Progress Photos</h2>
            <p className="text-[#6b7280]">Track your transformation journey</p>
          </div>
          <Button 
            className="rounded-xl bg-[#10b981] hover:bg-[#059669]"
            onClick={() => setIsUploadModalOpen(true)}
          >
            <Camera className="w-4 h-4 mr-2" />
            Upload Photo
          </Button>
        </div>

        <Card className="rounded-2xl border-[#e5e7eb] shadow-sm bg-white">
          <CardContent className="p-12 text-center">
            <Camera className="w-16 h-16 mx-auto text-[#6b7280] mb-4" />
            <h3 className="text-xl text-[#111827] mb-2">No progress photos yet</h3>
            <p className="text-[#6b7280] mb-6">Start your transformation journey by uploading your first photo</p>
            <Button 
              className="rounded-xl bg-[#10b981] hover:bg-[#059669]"
              onClick={() => setIsUploadModalOpen(true)}
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload First Photo
            </Button>
          </CardContent>
        </Card>

        {/* Upload Modal - giữ nguyên */}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl text-[#111827]">Progress Photos</h2>
          <p className="text-[#6b7280]">Track your transformation journey</p>
        </div>
        <Button 
          className="rounded-xl bg-[#10b981] hover:bg-[#059669]"
          onClick={() => setIsUploadModalOpen(true)}
        >
          <Camera className="w-4 h-4 mr-2" />
          Upload Photo
        </Button>
      </div>

      {/* Filters & View Controls */}
      <Card className="rounded-2xl border-[#e5e7eb] shadow-sm bg-white">
        <CardContent className="p-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            {/* View Type Filter */}
            <div className="flex items-center gap-2">
              <Label className="text-[#6b7280] text-sm">Filter:</Label>
              <div className="flex gap-1 bg-[#e5e7eb]/50 p-1 rounded-xl">
                <Button
                  variant={selectedView === 'all' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setSelectedView('all')}
                  className={`rounded-lg px-3 h-8 ${selectedView === 'all' ? 'bg-[#10b981] hover:bg-[#059669]' : ''}`}
                >
                  All
                </Button>
                {(['front', 'back', 'side'] as PhotoView[]).map((view) => (
                  <Button
                    key={view}
                    variant={selectedView === view ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setSelectedView(view)}
                    className={`rounded-lg px-3 h-8 ${selectedView === view ? 'bg-[#10b981] hover:bg-[#059669]' : ''}`}
                  >
                    <span className="mr-1">{viewIcons[view]}</span>
                    {view.charAt(0).toUpperCase() + view.slice(1)}
                  </Button>
                ))}
              </div>
            </div>

            {/* View Mode Toggle */}
            <div className="flex gap-1 bg-[#e5e7eb]/50 p-1 rounded-xl">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className={`rounded-lg h-8 ${viewMode === 'grid' ? 'bg-[#3b82f6] hover:bg-[#2563eb]' : ''}`}
              >
                <Grid3x3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'timeline' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('timeline')}
                className={`rounded-lg h-8 ${viewMode === 'timeline' ? 'bg-[#3b82f6] hover:bg-[#2563eb]' : ''}`}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content Area */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredPhotos.map((photo) => (
            <Card 
              key={photo._id} 
              className="rounded-2xl border-[#e5e7eb] bg-white hover:shadow-lg transition-all cursor-pointer group overflow-hidden"
              onClick={() => setSelectedPhotoForView(photo)}
            >
              <div className="relative aspect-[3/4] bg-[#f9fafb]">
                <Image 
                  src={photo.imageUrl || ''}
                  alt={`Progress photo - ${viewLabels[photo.view]}`}
                  className="w-full h-full object-cover"
                  width={300}
                  height={200}
                />
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button 
                    variant="secondary" 
                    size="sm"
                    className="rounded-xl"
                  >
                    <ImageIcon className="w-4 h-4 mr-2" />
                    View
                  </Button>
                </div>
                {/* View badge */}
                <Badge className="absolute top-2 left-2 bg-white/90 text-[#111827] rounded-lg">
                  {viewIcons[photo.view]} {photo.view}
                </Badge>
                {/* Actions dropdown */}
                <div className="absolute top-2 right-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button 
                        variant="secondary" 
                        size="sm" 
                        className="h-8 w-8 p-0 rounded-lg bg-white/90 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-red-500"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(photo._id);
                        }}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              <CardContent className="p-3">
                <p className="text-xs text-[#6b7280] mb-1">
                  {new Date(photo.takenAt).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric', 
                    year: 'numeric' 
                  })}
                </p>
                {photo.note && (
                  <p className="text-sm text-[#111827] line-clamp-2">{photo.note}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {viewMode === 'timeline' && (
        <div className="space-y-6">
          {photosByDate.map(([date, datePhotos]) => (
            <Card key={date} className="rounded-2xl border-[#e5e7eb] shadow-sm bg-white">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#10b981]/10 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-[#10b981]" />
                  </div>
                  <div>
                    <CardTitle className="text-[#111827]">
                      {new Date(date).toLocaleDateString('en-US', { 
                        weekday: 'long',
                        month: 'long', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })}
                    </CardTitle>
                    <p className="text-sm text-[#6b7280]">{timeAgo(date)}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {datePhotos.map((photo) => (
                    <div 
                      key={photo._id}
                      className="group cursor-pointer"
                      onClick={() => setSelectedPhotoForView(photo)}
                    >
                      <div className="relative aspect-[3/4] bg-[#f9fafb] rounded-xl overflow-hidden">
                        <Image 
                          src={photo.imageUrl || ""}
                          alt={`Progress photo - ${viewLabels[photo.view]}`}
                          className="w-full h-full object-cover"
                          width={300}
                          height={200}
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <ImageIcon className="w-8 h-8 text-white" />
                        </div>
                        <Badge className="absolute top-2 left-2 bg-white/90 text-[#111827] rounded-lg text-xs">
                          {viewIcons[photo.view]} {photo.view}
                        </Badge>
                      </div>
                      {photo.note && (
                        <p className="text-xs text-[#6b7280] mt-2 line-clamp-2">{photo.note}</p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      <Dialog open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen}>
        <DialogContent className="max-w-2xl bg-white rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl text-[#111827]">Upload Progress Photo</DialogTitle>
            <DialogDescription className="text-[#6b7280]">
              Add a new photo to track your transformation journey
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* File Upload */}
            <div className="space-y-2">
              <Label className="text-[#111827]">Photo</Label>
              <div 
                className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-colors ${
                  uploadPreview 
                    ? 'border-[#10b981] bg-[#10b981]/5' 
                    : 'border-[#e5e7eb] hover:border-[#10b981] hover:bg-[#f9fafb]'
                }`}
                onClick={() => document.getElementById('photo-upload')?.click()}
              >
                {uploadPreview ? (
                  <div className="relative w-full max-w-sm mx-auto">
                    <Image 
                      src={uploadPreview}
                      alt="Upload preview"
                      className="w-full aspect-[3/4] h-[200px] object-cover rounded-xl"
                      width={300}
                      height={200}
                    />
                    <Button
                      variant="secondary"
                      size="sm"
                      className="absolute top-2 right-2 rounded-lg"
                      onClick={(e) => {
                        e.stopPropagation();
                        setUploadPreview('');
                        setUploadFile(null);
                      }}
                    >
                      Change
                    </Button>
                  </div>
                ) : (
                  <>
                    <Upload className="w-12 h-12 mx-auto text-[#6b7280] mb-3" />
                    <p className="text-[#111827] mb-1">Click to upload or drag and drop</p>
                    <p className="text-sm text-[#6b7280]">PNG, JPG up to 10MB</p>
                  </>
                )}
                <input
                  id="photo-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* View Type */}
              <div className="space-y-2">
                <Label className="text-[#111827]">View Type</Label>
                <Select value={uploadView} onValueChange={(value) => setUploadView(value as PhotoView)}>
                  <SelectTrigger className="rounded-xl border-[#e5e7eb]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(['front', 'back', 'side'] as PhotoView[]).map((view) => (
                      <SelectItem key={view} value={view}>
                        <div className="flex items-center gap-2">
                          <span>{viewIcons[view]}</span>
                          <span>{viewLabels[view]}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Date */}
              <div className="space-y-2">
                <Label className="text-[#111827]">Date Taken</Label>
                <Input 
                  type="date"
                  value={uploadDate}
                  onChange={(e) => setUploadDate(e.target.value)}
                  className="rounded-xl border-[#e5e7eb]"
                />
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label className="text-[#111827]">Notes (Optional)</Label>
              <Textarea 
                placeholder="Add notes about this photo (weight, measurements, how you felt, etc.)"
                value={uploadNote}
                onChange={(e) => setUploadNote(e.target.value)}
                className="rounded-xl border-[#e5e7eb] min-h-[100px]"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t border-[#e5e7eb]">
                <Button 
                    className="flex-1 bg-[#10b981] hover:bg-[#059669] rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleUpload}
                    disabled={!uploadFile || isUploading}
                >
                    {isUploading ? (
                    <>
                        <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Uploading...
                    </>
                    ) : (
                    <>
                        <Check className="w-4 h-4 mr-2" />
                        Upload Photo
                    </>
                    )}
                </Button>
              <Button 
                variant="ghost" 
                className="rounded-xl"
                onClick={() => {
                  setIsUploadModalOpen(false);
                  setUploadPreview('');
                  setUploadFile(null);
                  setUploadNote('');
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Photo View Modal */}
      {selectedPhotoForView && (
        <Dialog open={!!selectedPhotoForView} onOpenChange={() => setSelectedPhotoForView(null)}>
          <DialogContent className="max-w-4xl bg-white rounded-2xl">
            <DialogHeader>
              <div className="flex items-center justify-between">
                <div>
                  <DialogTitle className="text-2xl text-[#111827]">
                    {viewLabels[selectedPhotoForView.view]}
                  </DialogTitle>
                  <p className="text-sm text-[#6b7280]">
                    {new Date(selectedPhotoForView.takenAt).toLocaleDateString('en-US', { 
                      weekday: 'long',
                      month: 'long', 
                      day: 'numeric', 
                      year: 'numeric' 
                    })}
                  </p>
                </div>
                <Badge className="bg-[#10b981] text-white rounded-lg">
                  {viewIcons[selectedPhotoForView.view]} {selectedPhotoForView.view}
                </Badge>
              </div>
            </DialogHeader>

            <div className="space-y-4">
              <div className="relative bg-[#f9fafb] rounded-2xl overflow-hidden">
                <Image 
                  src={selectedPhotoForView.imageUrl || ""}
                  alt={`Progress photo - ${viewLabels[selectedPhotoForView.view]}`}
                  className="w-full max-h-[600px] object-contain"
                  width={300}
                  height={200}
                />
              </div>

              {selectedPhotoForView.note && (
                <Card className="rounded-xl border-[#e5e7eb] bg-[#f9fafb]">
                  <CardContent className="p-4">
                    <Label className="text-[#111827] mb-2 block">Notes</Label>
                    <p className="text-[#111827]">{selectedPhotoForView.note}</p>
                  </CardContent>
                </Card>
              )}

              {/* Navigation */}
              <div className="flex justify-between items-center pt-4 border-t border-[#e5e7eb]">
                <Button
                  variant="outline"
                  className="rounded-xl"
                  onClick={() => {
                    const currentIndex = filteredPhotos.findIndex(p => p._id === selectedPhotoForView._id);
                    if (currentIndex > 0) {
                      setSelectedPhotoForView(filteredPhotos[currentIndex - 1]);
                    }
                  }}
                  disabled={filteredPhotos.findIndex(p => p._id === selectedPhotoForView._id) === 0}
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  className="rounded-xl"
                  onClick={() => {
                    const currentIndex = filteredPhotos.findIndex(p => p._id === selectedPhotoForView._id);
                    if (currentIndex < filteredPhotos.length - 1) {
                      setSelectedPhotoForView(filteredPhotos[currentIndex + 1]);
                    }
                  }}
                  disabled={filteredPhotos.findIndex(p => p._id === selectedPhotoForView._id) === filteredPhotos.length - 1}
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
