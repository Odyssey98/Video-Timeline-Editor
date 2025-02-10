# Video Timeline Editor Component

A React-based video timeline editor component that allows for drag-and-drop clip management and clip resizing.

视频时间轴编辑器组件，基于React实现，支持视频片段的拖放管理和大小调整。

## Features 功能特点

- Drag and drop video clips between tracks
  在轨道间拖放视频片段
- Resize clips by dragging edges
  通过拖动边缘调整片段大小
- Multiple tracks support
  支持多轨道
- Scalable timeline
  可缩放的时间轴
- Snap-to-grid while dragging
  拖拽时网格对齐功能
- Visual drag indicator
  可视化拖拽指示器

## Usage 使用方法

```tsx
import Timeline from './components/Timeline';
function App() {
  return (
    <div className="h-screen">
      <Timeline />
    </div>
  );
}
```

## Component Props 组件属性

The Timeline component currently doesn't accept any props as it uses internal state management. Future versions may include customization options.

时间轴组件目前使用内部状态管理，不接受外部属性。未来版本可能会包含自定义选项。

## Types 类型定义

```typescript
interface VideoClip {
  id: string;
  start: number;
  end: number;
  track: number;
  thumbnail: string;
}

interface Track {
  id: string;
  clips: VideoClip[];
}

interface TimelineState {
  tracks: Track[];
  duration: number;
  scale: number;
}
```

## 🔧 Configuration 配置项

| Prop | Type | Default | Description | 描述 |
|------|------|---------|-------------|------|
| scale | number | 1 | Timeline zoom level | 时间轴缩放级别 |
| tracks | Track[] | [] | Video tracks data | 视频轨道数据 |
| duration | number | 1000 | Timeline duration | 时间轴总时长 |

## Features Details 功能详情

### Snap-to-Grid 网格对齐

The timeline implements a snap-to-grid feature that helps align clips to specific time points while dragging. A blue indicator line shows the current snap position.

时间轴实现了网格对齐功能，在拖拽时会帮助将片段对齐到特定时间点。蓝色指示线显示当前对齐位置。

- Visual feedback with a blue vertical line
  通过蓝色垂直线提供视觉反馈
- Snaps to scale intervals
  对齐到缩放间隔
- Helps maintain precise clip positioning
  帮助保持精确的片段定位
