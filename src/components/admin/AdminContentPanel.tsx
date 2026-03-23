
'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { 
  Plus, 
  Sparkles, 
  Trash2, 
  Edit3, 
  Tags,
  Search,
  Upload,
  Image as ImageIcon,
  CheckCircle2,
  Loader2,
  ListVideo,
  Video
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { generateVideoDescription } from '@/ai/flows/generate-video-description';
import { suggestVideoMetadata } from '@/ai/flows/suggest-video-metadata';
import { useToast } from '@/hooks/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { uploadFile } from '@/app/actions/upload';
import { createVideoAction, deleteVideoAction } from '@/app/actions/content';
import { Episode, ContentType, VideoContent } from '@/lib/types';

export function AdminContentPanel({ initialVideos }: { initialVideos: VideoContent[] }) {
  const router = useRouter();
  const { toast } = useToast();
  const [videos, setVideos] = useState(initialVideos);
  const [isAdding, setIsAdding] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  // File states for main content
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

  const videoInputRef = useRef<HTMLInputElement>(null);
  const thumbInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [newVideo, setNewVideo] = useState({
    title: '',
    description: '',
    genres: [] as string[],
    tags: [] as string[],
    isFree: false,
    type: 'movie' as ContentType,
  });

  // Episodes State for Series
  const [episodes, setEpisodes] = useState<{
    title: string;
    description: string;
    file: File | null;
  }[]>([]);

  const addEpisodeSlot = () => {
    setEpisodes([...episodes, { title: '', description: '', file: null }]);
  };

  const updateEpisode = (index: number, updates: any) => {
    const updated = [...episodes];
    updated[index] = { ...updated[index], ...updates };
    setEpisodes(updated);
  };

  const removeEpisodeSlot = (index: number) => {
    setEpisodes(episodes.filter((_, i) => i !== index));
  };

  const handleGenDescription = async () => {
    if (!newVideo.title) {
      toast({ title: "Title required", description: "Enter a title first to generate a description." });
      return;
    }
    setIsGenerating(true);
    try {
      const result = await generateVideoDescription({ title: newVideo.title });
      setNewVideo(prev => ({ ...prev, description: result.description }));
    } catch (error) {
      toast({ variant: "destructive", title: "AI Error", description: "Failed to generate description." });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenMetadata = async () => {
    if (!newVideo.title || !newVideo.description) {
      toast({ title: "Title & Description required", description: "Need more context for AI to suggest tags." });
      return;
    }
    setIsSuggesting(true);
    try {
      const result = await suggestVideoMetadata({ title: newVideo.title, description: newVideo.description });
      setNewVideo(prev => ({ ...prev, genres: result.genres, tags: result.tags }));
    } catch (error) {
      toast({ variant: "destructive", title: "AI Error", description: "Failed to suggest metadata." });
    } finally {
      setIsSuggesting(false);
    }
  };

  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFile(file);
      if (!newVideo.title) {
        setNewVideo(prev => ({ ...prev, title: file.name.split('.')[0] }));
      }
    }
  };

  const handleThumbnailSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnailFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!newVideo.title || !thumbnailFile) {
      toast({ variant: "destructive", title: "Missing Data", description: "Please provide a title and thumbnail." });
      return;
    }

    if (newVideo.type === 'movie' && !videoFile) {
      toast({ variant: "destructive", title: "Video Required", description: "Please provide a video file for the movie." });
      return;
    }

    if (newVideo.type === 'series' && episodes.length === 0) {
      toast({ variant: "destructive", title: "Episodes Required", description: "Please add at least one episode for the series." });
      return;
    }

    setIsUploading(true);
    setUploadProgress(5);

    try {
      // 1. Upload Thumbnail
      const thumbFormData = new FormData();
      thumbFormData.append('file', thumbnailFile);
      const thumbnailUrl = await uploadFile(thumbFormData);
      setUploadProgress(20);

      let videoUrl = '';
      let processedEpisodes: Episode[] = [];

      if (newVideo.type === 'movie' && videoFile) {
        // 2a. Upload Movie Video
        const videoFormData = new FormData();
        videoFormData.append('file', videoFile);
        videoUrl = await uploadFile(videoFormData);
        setUploadProgress(90);
      } else if (newVideo.type === 'series') {
        // 2b. Upload Episode Videos
        for (let i = 0; i < episodes.length; i++) {
          const ep = episodes[i];
          if (!ep.file) continue;

          const epFormData = new FormData();
          epFormData.append('file', ep.file);
          const epVideoUrl = await uploadFile(epFormData);
          
          processedEpisodes.push({
            id: Math.random().toString(36).substr(2, 9),
            title: ep.title || `Episode ${i + 1}`,
            description: ep.description,
            videoUrl: epVideoUrl,
            order: i + 1
          });
          
          setUploadProgress(20 + Math.floor(((i + 1) / episodes.length) * 70));
        }
      }

      const createdVideo = await createVideoAction({
        ...newVideo,
        thumbnailUrl,
        videoUrl: newVideo.type === 'movie' ? videoUrl : undefined,
        episodes: newVideo.type === 'series' ? processedEpisodes : undefined,
      });
      setVideos((current) => [createdVideo, ...current]);

      setUploadProgress(100);
      setIsAdding(false);
      resetForm();
      toast({ title: "Success!", description: "Content published and saved to library." });
      router.refresh();
    } catch (error) {
      toast({ variant: "destructive", title: "Upload Failed", description: "There was an error saving your files." });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const resetForm = () => {
    setNewVideo({
      title: '',
      description: '',
      genres: [],
      tags: [],
      isFree: false,
      type: 'movie',
    });
    setVideoFile(null);
    setThumbnailFile(null);
    setThumbnailPreview(null);
    setEpisodes([]);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-headline font-bold text-white">Content Library</h2>
          <p className="text-muted-foreground">Manage movies and series in your catalog.</p>
        </div>
        
        <Dialog open={isAdding} onOpenChange={setIsAdding}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90 gap-2">
              <Plus size={18} /> Add New Content
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl bg-card border-white/10 max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-headline text-2xl">Publish Content</DialogTitle>
              <DialogDescription>
                Choose content type and upload media files.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-6 py-4">
              <div className="space-y-3">
                <Label>Content Type</Label>
                <RadioGroup 
                  defaultValue="movie" 
                  className="flex gap-4"
                  onValueChange={(val) => setNewVideo(prev => ({ ...prev, type: val as ContentType }))}
                >
                  <div className="flex items-center space-x-2 bg-secondary/30 p-4 rounded-xl border border-white/5 flex-1 cursor-pointer hover:bg-secondary/50 transition-colors">
                    <RadioGroupItem value="movie" id="type-movie" />
                    <Label htmlFor="type-movie" className="flex items-center gap-2 cursor-pointer">
                      <Video size={16} className="text-primary" /> Movie
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 bg-secondary/30 p-4 rounded-xl border border-white/5 flex-1 cursor-pointer hover:bg-secondary/50 transition-colors">
                    <RadioGroupItem value="series" id="type-series" />
                    <Label htmlFor="type-series" className="flex items-center gap-2 cursor-pointer">
                      <ListVideo size={16} className="text-accent" /> Series
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Thumbnail Image</Label>
                  <div 
                    onClick={() => !isUploading && thumbInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-xl p-2 h-[120px] flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors relative overflow-hidden ${thumbnailPreview ? 'border-primary/50' : 'border-white/10 hover:border-white/20'}`}
                  >
                    <input type="file" ref={thumbInputRef} className="hidden" accept="image/*" onChange={handleThumbnailSelect} disabled={isUploading} />
                    {thumbnailPreview ? (
                      <>
                        <img src={thumbnailPreview} alt="Preview" className="absolute inset-0 w-full h-full object-cover opacity-60" />
                        <div className="relative z-10 flex flex-col items-center">
                          <CheckCircle2 className="text-white drop-shadow-md" size={24} />
                        </div>
                      </>
                    ) : (
                      <>
                        <ImageIcon className="text-muted-foreground" size={32} />
                        <p className="text-xs text-muted-foreground font-medium">Select Thumbnail</p>
                      </>
                    )}
                  </div>
                </div>

                {newVideo.type === 'movie' && (
                  <div className="space-y-2">
                    <Label>Video File (Movie)</Label>
                    <div 
                      onClick={() => !isUploading && videoInputRef.current?.click()}
                      className={`border-2 border-dashed rounded-xl p-6 h-[120px] flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors ${videoFile ? 'border-primary/50 bg-primary/5' : 'border-white/10 hover:border-white/20'}`}
                    >
                      <input type="file" ref={videoInputRef} className="hidden" accept="video/*" onChange={handleVideoSelect} disabled={isUploading} />
                      {videoFile ? (
                        <>
                          <CheckCircle2 className="text-primary" size={32} />
                          <p className="text-xs font-medium text-center line-clamp-1">{videoFile.name}</p>
                        </>
                      ) : (
                        <>
                          <Upload className="text-muted-foreground" size={32} />
                          <p className="text-xs text-muted-foreground font-medium">Select Video</p>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <input 
                  id="title" 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder={newVideo.type === 'movie' ? "e.g. Inception" : "e.g. The Mandalorian"} 
                  value={newVideo.title}
                  onChange={e => setNewVideo(prev => ({ ...prev, title: e.target.value }))}
                  disabled={isUploading}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="description">Description</Label>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-7 gap-1 text-accent border-accent/20 hover:bg-accent/10"
                    onClick={handleGenDescription}
                    disabled={isGenerating || isUploading}
                  >
                    {isGenerating ? <Loader2 className="animate-spin" size={12} /> : <Sparkles size={12} />} 
                    {isGenerating ? 'Generating...' : 'AI Generate'}
                  </Button>
                </div>
                <Textarea 
                  id="description" 
                  className="min-h-[80px]"
                  placeholder="Enter content summary..." 
                  value={newVideo.description}
                  onChange={e => setNewVideo(prev => ({ ...prev, description: e.target.value }))}
                  disabled={isUploading}
                />
              </div>

              {newVideo.type === 'series' && (
                <div className="space-y-4 border-t border-white/5 pt-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-lg">Episodes</Label>
                    <Button type="button" variant="outline" size="sm" onClick={addEpisodeSlot} disabled={isUploading}>
                      <Plus size={14} className="mr-1" /> Add Episode
                    </Button>
                  </div>
                  
                  <Accordion type="single" collapsible className="w-full space-y-2">
                    {episodes.map((ep, idx) => (
                      <AccordionItem key={idx} value={`item-${idx}`} className="bg-secondary/20 rounded-xl px-4 border border-white/5">
                        <AccordionTrigger className="hover:no-underline">
                          <div className="flex items-center gap-3">
                            <Badge variant="outline" className="h-6 w-6 p-0 flex items-center justify-center rounded-full border-primary/30 text-primary">{idx + 1}</Badge>
                            <span className="font-bold">{ep.title || `Draft Episode ${idx + 1}`}</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="space-y-4 pt-2 pb-4">
                          <div className="grid gap-4">
                            <Input 
                              placeholder="Episode Title" 
                              value={ep.title} 
                              onChange={(e) => updateEpisode(idx, { title: e.target.value })}
                            />
                            <Textarea 
                              placeholder="Episode Description" 
                              value={ep.description}
                              onChange={(e) => updateEpisode(idx, { description: e.target.value })}
                            />
                            <div className="flex items-center gap-4">
                              <Input 
                                type="file" 
                                accept="video/*" 
                                onChange={(e) => updateEpisode(idx, { file: e.target.files?.[0] })}
                                className="flex-1"
                              />
                              <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => removeEpisodeSlot(idx)}>
                                <Trash2 size={16} />
                              </Button>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              )}

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Enrich Metadata</Label>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-7 gap-1 text-accent border-accent/20 hover:bg-accent/10"
                    onClick={handleGenMetadata}
                    disabled={isSuggesting || isUploading}
                  >
                    {isSuggesting ? <Loader2 className="animate-spin" size={12} /> : <Sparkles size={12} />}
                    {isSuggesting ? 'Analyzing...' : 'AI Suggest Tags'}
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 min-h-[40px] p-2 rounded-md bg-secondary/30 border border-white/5">
                  {(newVideo.tags || []).length === 0 && <span className="text-xs text-muted-foreground">No tags generated yet</span>}
                  {(newVideo.tags || []).map(tag => (
                    <Badge key={tag} variant="secondary" className="text-[10px] uppercase">{tag}</Badge>
                  ))}
                  {(newVideo.genres || []).map(genre => (
                    <Badge key={genre} variant="default" className="text-[10px] uppercase bg-primary">{genre}</Badge>
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch 
                  id="is-free" 
                  checked={newVideo.isFree}
                  onCheckedChange={checked => setNewVideo(prev => ({ ...prev, isFree: checked }))}
                  disabled={isUploading}
                />
                <Label htmlFor="is-free">Available as Free Content</Label>
              </div>

              {isUploading && (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-medium">
                    <span>Processing uploads...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} className="h-2" />
                </div>
              )}
            </div>

            <DialogFooter>
              <Button variant="ghost" onClick={() => setIsAdding(false)} disabled={isUploading}>Cancel</Button>
              <Button onClick={handleSubmit} disabled={!newVideo.title || !thumbnailFile || isUploading}>
                {isUploading ? <Loader2 className="animate-spin mr-2" size={16} /> : null}
                {isUploading ? 'Uploading...' : 'Publish Content'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-card rounded-xl border border-white/5 overflow-hidden shadow-2xl">
        <div className="p-4 border-b border-white/5 flex items-center gap-2 bg-secondary/20">
          <Search className="text-muted-foreground" size={18} />
          <input 
            type="text" 
            placeholder="Search catalog..." 
            className="bg-transparent border-none outline-none text-sm w-full text-white placeholder:text-muted-foreground"
          />
        </div>
        <Table>
          <TableHeader>
            <TableRow className="border-white/5 hover:bg-transparent">
              <TableHead className="w-[300px]">Content Title</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Access</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {videos.map((video) => (
              <TableRow key={video.id} className="border-white/5 hover:bg-secondary/10 transition-colors">
                <TableCell className="font-medium">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-8 rounded bg-secondary relative overflow-hidden">
                      <img src={video.thumbnailUrl} alt="" className="object-cover w-full h-full" />
                    </div>
                    <span>{video.title}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5 text-xs">
                    {(video.type || 'movie') === 'series' ? <ListVideo size={14} className="text-accent" /> : <Video size={14} className="text-primary" />}
                    {(video.type || 'movie').toUpperCase()}
                  </div>
                </TableCell>
                <TableCell>
                  {video.isFree ? (
                    <Badge variant="outline" className="border-accent/30 text-accent">Free</Badge>
                  ) : (
                    <Badge variant="outline" className="border-primary/30 text-primary">Premium</Badge>
                  )}
                </TableCell>
                <TableCell>
                  <div className="text-xs text-muted-foreground">
                    {(video.type || 'movie') === 'series' ? `${video.episodes?.length || 0} eps` : 'Full Movie'}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-white">
                      <Edit3 size={16} />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={async () => {
                        try {
                          await deleteVideoAction(video.id);
                          setVideos((current) => current.filter((item) => item.id !== video.id));
                          toast({ title: "Content Deleted", description: "Removed from library." });
                          router.refresh();
                        } catch {
                          toast({ variant: "destructive", title: "Delete Failed", description: "Could not remove this content." });
                        }
                      }}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
