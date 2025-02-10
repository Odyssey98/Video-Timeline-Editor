import React, { useState, useRef } from 'react';
import { Track, VideoClip, TimelineState } from '../types';

// 模拟视频片段数据 / Mock video clip data
const mockClips: VideoClip[] = Array.from({ length: 10 }, (_, i) => ({
  id: `clip-${i}`,
  start: i * 100,
  end: (i + 1) * 100,
  track: Math.floor(i / 4),
  thumbnail:
    'https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=200&h=120&fit=crop',
}));

// 初始轨道数据 / Initial track data
const initialTracks: Track[] = [
  { id: 'track-1', clips: mockClips.filter((c) => c.track === 0) },
  { id: 'track-2', clips: mockClips.filter((c) => c.track === 1) },
  { id: 'track-3', clips: mockClips.filter((c) => c.track === 2) },
];

const Timeline: React.FC = () => {
  // 时间轴状态，包含轨道、总时长和缩放比例
  // Timeline state containing tracks, duration and scale
  const [timelineState, setTimelineState] = useState<TimelineState>({
    tracks: initialTracks,
    duration: 1000,
    scale: 1,
  });

  // 引用时间轴DOM元素 / Reference to timeline DOM element
  const timelineRef = useRef<HTMLDivElement>(null);
  // 当前拖动的片段 / Currently dragged clip
  const [draggingClip, setDraggingClip] = useState<VideoClip | null>(null);
  // 当前调整大小的片段 / Currently resizing clip
  const [resizingClip, setResizingClip] = useState<{
    clip: VideoClip;
    edge: 'start' | 'end';
  } | null>(null);

  // 开始拖动片段时的处理函数 / Handler for when clip drag starts
  const handleClipDragStart = (clip: VideoClip, e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', clip.id);
    setDraggingClip(clip);
  };

  const handleClipDragEnd = () => {
    setDraggingClip(null);
  };

  // 处理片段拖放 / Handle clip drop on timeline
  const handleTimelineDrop = (e: React.DragEvent, trackIndex: number) => {
    e.preventDefault();
    if (!draggingClip) return;

    const timelineRect = timelineRef.current?.getBoundingClientRect();
    if (!timelineRect) return;

    const dropPosition = e.clientX - timelineRect.left;
    const newStart = Math.round(dropPosition / timelineState.scale);

    const updatedTracks = timelineState.tracks.map((track, index) => {
      if (index === trackIndex) {
        // 首先移除当前轨道中的拖拽片段
        const updatedClips = track.clips.filter(
          (c) => c.id !== draggingClip.id
        );

        const clipDuration = draggingClip.end - draggingClip.start;
        const updatedClip = {
          ...draggingClip,
          start: newStart,
          end: newStart + clipDuration,
          track: trackIndex,
        };

        updatedClips.push(updatedClip);
        return { ...track, clips: updatedClips };
      } else if (draggingClip.track === index) {
        // 从原轨道中移除片段（如果是跨轨道拖拽）
        return {
          ...track,
          clips: track.clips.filter((c) => c.id !== draggingClip.id),
        };
      }
      return track;
    });

    setTimelineState((prev) => ({
      ...prev,
      tracks: updatedTracks,
    }));
  };

  // 处理片段大小调整 / Handle clip resize
  const handleClipResize = (
    clip: VideoClip,
    edge: 'start' | 'end',
    e: React.MouseEvent
  ) => {
    e.preventDefault();
    setResizingClip({ clip, edge });
  };

  // 处理鼠标移动（用于调整大小）/ Handle mouse movement for resizing
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!resizingClip || !timelineRef.current) return;

    const timelineRect = timelineRef.current.getBoundingClientRect();
    const mousePosition = e.clientX - timelineRect.left;
    const newPosition = Math.round(mousePosition / timelineState.scale);

    const updatedTracks = timelineState.tracks.map((track) => {
      const clipIndex = track.clips.findIndex(
        (c) => c.id === resizingClip.clip.id
      );
      if (clipIndex === -1) return track;

      const updatedClips = [...track.clips];
      const clip = { ...updatedClips[clipIndex] };

      if (resizingClip.edge === 'start') {
        clip.start = Math.min(newPosition, clip.end - 10);
      } else {
        clip.end = Math.max(newPosition, clip.start + 10);
      }

      updatedClips[clipIndex] = clip;
      return { ...track, clips: updatedClips };
    });

    setTimelineState((prev) => ({
      ...prev,
      tracks: updatedTracks,
    }));
  };

  const handleMouseUp = () => {
    setResizingClip(null);
  };

  return (
    <div className="w-full h-full bg-gray-900 text-white p-4">
      <div
        ref={timelineRef}
        className="relative w-full overflow-x-auto"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {timelineState.tracks.map((track, trackIndex) => (
          <div
            key={track.id}
            className="relative h-24 border-b border-gray-700"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleTimelineDrop(e, trackIndex)}
          >
            {track.clips.map((clip) => (
              <div
                key={clip.id}
                className="absolute top-2 bottom-2 bg-gray-800 rounded overflow-hidden cursor-move"
                style={{
                  left: `${clip.start * timelineState.scale}px`,
                  width: `${(clip.end - clip.start) * timelineState.scale}px`,
                }}
                draggable
                onDragStart={(e) => handleClipDragStart(clip, e)}
                onDragEnd={handleClipDragEnd}
              >
                <img
                  src={clip.thumbnail}
                  alt="Thumbnail"
                  className="h-full w-full object-cover"
                />
                <div
                  className="absolute left-0 top-0 bottom-0 w-2 cursor-ew-resize bg-blue-500 opacity-0 hover:opacity-50"
                  onMouseDown={(e) => handleClipResize(clip, 'start', e)}
                />
                <div
                  className="absolute right-0 top-0 bottom-0 w-2 cursor-ew-resize bg-blue-500 opacity-0 hover:opacity-50"
                  onMouseDown={(e) => handleClipResize(clip, 'end', e)}
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Timeline;
