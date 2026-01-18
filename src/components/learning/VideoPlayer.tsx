"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Play, Clock, Eye, ExternalLink, RefreshCw } from "lucide-react";
import { Card, CardContent, LoadingSpinner } from "@/components/ui";
import type { YouTubeVideo } from "@/lib/youtube";

interface VideoPlayerProps {
  query: string;
  techniqueName: string;
}

export function VideoPlayer({ query, techniqueName }: VideoPlayerProps) {
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<YouTubeVideo | null>(null);

  const fetchVideos = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/youtube?q=${encodeURIComponent(query)}&limit=5`);
      if (!response.ok) throw new Error("Failed to fetch videos");
      const data = await response.json();
      setVideos(data);
      if (data.length > 0) {
        setSelectedVideo(data[0]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load videos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, [query]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8 sm:py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="bg-destructive/10 border-destructive/20">
        <CardContent className="p-4 sm:p-6 text-center">
          <p className="text-sm sm:text-base text-foreground-muted mb-3 sm:mb-4">{error}</p>
          <button
            onClick={fetchVideos}
            className="inline-flex items-center gap-2 text-sm sm:text-base text-accent hover:underline"
          >
            <RefreshCw className="w-4 h-4" />
            Try again
          </button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {selectedVideo && (
        <motion.div
          key={selectedVideo.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-3 sm:space-y-4"
        >
          <div className="aspect-video rounded-lg sm:rounded-xl overflow-hidden bg-card border border-card-border">
            <iframe
              src={`${selectedVideo.embedUrl}?rel=0&modestbranding=1&iv_load_policy=3`}
              title={selectedVideo.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          </div>

          <div>
            <h3 className="text-sm sm:text-base font-medium text-foreground mb-1.5 sm:mb-2 line-clamp-2">
              {selectedVideo.title}
            </h3>
            <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-foreground-muted">
              <span className="flex items-center gap-1">
                <Play className="w-3 h-3" />
                {selectedVideo.channelTitle}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {selectedVideo.duration}
              </span>
              <span className="flex items-center gap-1">
                <Eye className="w-3 h-3" />
                {selectedVideo.viewCount}
              </span>
            </div>
          </div>
        </motion.div>
      )}

      {videos.length > 1 && (
        <div>
          <h4 className="text-xs sm:text-sm font-medium text-foreground-muted mb-2 sm:mb-3">
            More tutorials from top creators
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
            {videos.slice(1).map((video) => (
              <motion.button
                key={video.id}
                onClick={() => setSelectedVideo(video)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg sm:rounded-xl text-left transition-colors ${
                  selectedVideo?.id === video.id
                    ? "bg-accent/10 border-2 border-accent"
                    : "bg-card border border-card-border hover:bg-accent/5"
                }`}
              >
                <div className="relative w-20 h-14 sm:w-24 sm:h-16 rounded-md sm:rounded-lg overflow-hidden flex-shrink-0 bg-muted">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-0.5 right-0.5 sm:bottom-1 sm:right-1 px-1 sm:px-1.5 py-0.5 rounded bg-black/80 text-white text-[10px] sm:text-xs">
                    {video.duration}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h5 className="text-xs sm:text-sm font-medium text-foreground line-clamp-2 mb-0.5 sm:mb-1">
                    {video.title}
                  </h5>
                  <p className="text-[10px] sm:text-xs text-foreground-muted">
                    {video.channelTitle}
                  </p>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
