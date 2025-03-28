# 简约相册开源项目

<p align="center">
  <img src="img/logo.jpg" alt="简约相册" width="150">
</p>

<p align="center">
  一个轻量级、现代化的照片展示解决方案
</p>

## 项目简介

**简约相册**是一个专为个人相册设计的轻量级开源项目，采用纯前端技术栈构建，无需后端支持即可快速部署。项目特点是简约、美观、响应式设计，适合分享家庭照片、个人作品集或纪念活动等场景。

此项目最初是为"曾婉之的精彩瞬间"相册设计的，现已开源，任何人都可以自由使用、修改和分发。我们致力于打造一个干净、高效且易于定制的照片展示解决方案。

## 特性

- **轻量级设计**：无需数据库和后端支持，仅使用HTML、CSS和JavaScript构建，总体积小于100KB（不含图片资源）
- **响应式布局**：完美适配从手机到桌面的各种设备尺寸，自动调整布局和交互方式
- **高性能**：优化的资源加载策略，渐进式图片加载，平滑动画效果，确保在各种网络条件下的良好体验
- **美观设计**：现代化UI设计，精心调整的动画和过渡效果，美观的字体和配色方案
- **高度可定制**：易于修改的CSS变量系统，模块化的HTML结构，便于个性化定制和品牌化
- **无障碍支持**：遵循WCAG准则，支持键盘导航，合理的语义HTML结构，适当的ARIA属性
- **精美动效**：使用CSS过渡和动画，为用户交互提供流畅的视觉反馈
- **全屏查看模式**：优化的全屏图片浏览体验，支持键盘和触摸操作

## 技术栈

- HTML5
- CSS3
- JavaScript (ES6+)
- Font Awesome 图标
- Google Fonts 字体

## 快速上手

### 1. 克隆项目

```bash
git clone https://github.com/your-github-username/photo-gallery.git
```

### 2. 添加照片

将你的照片放入 `img` 文件夹，并在 `script.js` 中更新 `allImageSources` 数组：

```javascript
const allImageSources = [
    // 本地图片
    { src: "img/1.jpg", title: "照片标题 #1" },
    { src: "img/2.jpg", title: "照片标题 #2" },
    
    // 外部链接图片（直接使用完整URL）
    { src: "https://example.com/image.jpg", title: "网络图片 #3" }
];
```

### 3. 个性化定制

修改 `styles.css` 中的颜色变量和标题内容，根据需要调整布局和样式：

```css
:root {
    --primary-color: #ff6b6b;    /* 主色调 */
    --secondary-color: #4ecdc4;  /* 次要色调 */
    --dark-color: #1a535c;       /* 深色 */
    --light-color: #f7fff7;      /* 浅色 */
    --accent-color: #ffe66d;     /* 强调色 */
}
```

### 4. 部署

将整个项目文件夹上传到任意支持静态网站的托管服务，如GitHub Pages、Vercel或Netlify。

## 核心功能

### 渐进式图片加载

项目实现了"加载更多"功能，初始只加载9张图片，用户可以通过点击按钮加载更多图片，提高页面初始加载速度。

```javascript
// 初始加载图片数量
const initialLoadCount = 9;

// 加载更多图片函数
function loadMoreImages() {
    // 显示加载指示器
    loadingIndicator.classList.add('active');
    
    // 模拟加载延迟
    setTimeout(() => {
        // 加载剩余图片
        const imagesToLoad = allImageSources.slice(loadedImagesCount);
        
        // 生成并添加图片元素
        imagesToLoad.forEach(imageSource => {
            createPhotoElement(imageSource);
        });
        
        // 隐藏加载按钮和指示器
        loadMoreBtn.style.display = 'none';
        loadingIndicator.classList.remove('active');
    }, 500);
}
```

### 全屏查看模式

实现了美观的全屏图片查看体验，支持键盘导航、触摸操作和动画过渡效果。

```javascript
// 打开全屏查看器
function openViewer(index) {
    currentImageIndex = index;
    viewer.classList.add('active');
    document.body.style.overflow = 'hidden';
    changeViewerImage(currentImageIndex);
}

// 关闭全屏查看器
function closeViewer() {
    viewer.classList.remove('active');
    document.body.style.overflow = '';
}
```

### 响应式设计

使用媒体查询确保在不同设备上提供最佳用户体验：

```css
/* 平板设备适配 */
@media (max-width: 768px) {
    .gallery {
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    }
}

/* 移动设备适配 */
@media (max-width: 480px) {
    .gallery {
        grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    }
}
```

## 许可证

本项目采用 [知识共享署名-非商业性使用-相同方式共享 4.0 国际许可协议](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.zh) 进行许可。这意味着你可以自由地使用、修改和分发这个项目，但**不允许用于商业目的**，且必须保留原始作者署名并以相同许可方式共享。

## 贡献

我们欢迎任何形式的贡献，包括功能请求、错误报告、代码改进和文档完善。

- [查看源码](https://github.com/your-github-username/photo-gallery)
- [报告问题](https://github.com/your-github-username/photo-gallery/issues)
- [Fork项目](https://github.com/your-github-username/photo-gallery/fork)

## 联系方式

如有任何问题或建议，欢迎通过以下方式联系我们：

- GitHub: [your-github-username](https://github.com/your-github-username)
- 邮箱: your-email@example.com 
