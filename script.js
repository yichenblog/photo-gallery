document.addEventListener('DOMContentLoaded', () => {
    // 检测是否为移动设备
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;
    
    if (isMobile) {
        console.log('检测到移动设备，应用特殊处理');
        document.body.classList.add('mobile-device');
        
        // 确保移动端环境下图片加载策略更适合
        const enhanceMobileViewport = () => {
            const viewer = document.querySelector('.fullscreen-viewer');
            if (viewer) {
                // 确保viewer本身没有增加复杂的变换
                viewer.style.transform = 'none';
                
                // 获取图片并确保可见
                const viewerImage = viewer.querySelector('.image-container img');
                if (viewerImage) {
                    viewerImage.style.opacity = '1';
                    viewerImage.style.transform = 'none';
                    viewerImage.style.webkitTransform = 'none';
                }
            }
        };
        
        // 页面加载后执行一次
        enhanceMobileViewport();
        
        // 监听可能的resize事件
        window.addEventListener('resize', enhanceMobileViewport);
        
        // 监听orientation变化
        window.addEventListener('orientationchange', () => {
            setTimeout(enhanceMobileViewport, 300);
        });
    }
    
    const gallery = document.querySelector('.gallery');
    const viewer = document.querySelector('.fullscreen-viewer');
    const viewerContainer = viewer.querySelector('.viewer-container');
    const imageContainer = viewer.querySelector('.image-container');
    const viewerImg = imageContainer.querySelector('.viewer-image');
    const viewerTitle = viewer.querySelector('.viewer-header h3');
    const imageCounter = viewer.querySelector('.image-counter');
    const closeButton = viewer.querySelector('.close-viewer');
    const prevButton = viewer.querySelector('.prev-button');
    const nextButton = viewer.querySelector('.next-button');
    const loadMoreBtn = document.getElementById('load-more');
    const loadingIndicator = document.querySelector('.loading-indicator');
    const aboutBtn = document.getElementById('about-btn');
    const aboutCard = document.getElementById('about-card');
    const closeAbout = document.querySelector('.close-about');
    
    // 初始化时隐藏加载指示器和确保容器不处于加载状态
    imageContainer.classList.remove('loading');
    
    // 所有图片资源路径数组，实际项目中应该从后端获取
    const allImageSources = [
        { src: "img/1.jpg", title: "甜蜜微笑 #1" },
        { src: "img/2.jpg", title: "快乐时光 #2" },
        { src: "img/3.jpg", title: "可爱笑容 #3" },
        { src: "img/4.jpg", title: "调皮表情 #4" },
        { src: "img/5.jpg", title: "好奇探索 #5" },
        { src: "img/6.jpg", title: "温馨时刻 #6" },
        { src: "img/7.png", title: "美丽瞬间 #7" },
        { src: "img/8.jpg", title: "开心玩耍 #8" },
        { src: "img/9.jpg", title: "俏皮可爱 #9" },
        // 以下是"加载更多"时显示的图片
        { src: "https://img.alicdn.com/imgextra/i2/2212723071657/O1CN01VK23zR1O6xKF6AdLb_!!2212723071657.jpg", title: "一颗肉丸子 #10" },
        { src: "https://img.alicdn.com/imgextra/i2/2212723071657/O1CN01JUnqSS1O6xKEL2Eg9_!!2212723071657.jpg", title: "一颗肉丸子 #11" },
        { src: "https://img.alicdn.com/imgextra/i1/2212723071657/O1CN01taDQBK1O6xKDftbQ9_!!2212723071657.jpg", title: "一颗肉丸子 #12" },
        { src: "https://img.alicdn.com/imgextra/i3/2212723071657/O1CN01daHEva1O6xKDStFsl_!!2212723071657.jpg", title: "一颗肉丸子 #13" },
        { src: "https://img.alicdn.com/imgextra/i4/2212723071657/O1CN01VcpaIi1O6xKFyltLY_!!2212723071657.jpg", title: "一颗肉丸子 #14" },
        
        /* 添加自己的图片示例 
        -----------------------------
        要添加更多图片，请按照如下格式增加新条目：
        
        { src: "img/你的图片.jpg", title: "图片标题" },
        
        注意:
        1. 请确保将图片文件放在img目录下
        2. 最后一个条目不需要逗号
        3. 标题会显示在查看器的顶部
        4. 可以使用网络图片链接，但本地图片加载更快
        -----------------------------
        */
    ];
    
    // 每页显示的图片数
    const imagesPerPage = 4; // 修改为每页加载4张图片
    // 初始加载的图片数
    const initialLoadCount = 9;
    
    let currentImageIndex = 0;
    let images = [];
    let isLoading = false;
    let touchStartX = 0;
    let touchEndX = 0;
    let currentLoadedCount = 0;
    let hasMoreImages = true;
    
    // 初始化图片数组和相册
    function initializeGallery() {
        // 加载初始图片
        loadInitialImages();
        
        // 初始化懒加载
        initLazyLoading();
    }
    
    // 加载初始图片
    function loadInitialImages() {
        const initialImages = allImageSources.slice(0, initialLoadCount);
        currentLoadedCount = initialImages.length;
        
        // 创建并添加初始图片到画廊
        initialImages.forEach((imageData, index) => {
            createPhotoElement(imageData, index, false);
        });
        
        // 更新是否还有更多图片
        updateLoadMoreButtonState();
    }
    
    // 创建照片元素并添加到画廊
    function createPhotoElement(imageData, index, isNew = false) {
        // 创建新的照片容器
        const photoContainer = document.createElement('div');
        photoContainer.className = isNew ? 'photo-container new-photo' : 'photo-container';
        photoContainer.style.animationDelay = `${index * 0.1}s`;
        
        // 构建图片URL，如果有unique属性，添加到URL以避免浏览器缓存
        const imageUrl = imageData.unique 
            ? `${imageData.src}?v=${imageData.unique}&t=${new Date().getTime()}` 
            : imageData.src;
        
        // 构建照片HTML
        const photoHtml = `
            <div class="photo">
                <img src="${imageUrl}" alt="${imageData.title}" loading="lazy" class="lazy-image">
                ${isNew ? '<div class="new-badge">新</div>' : ''}
            </div>
        `;
        
        photoContainer.innerHTML = photoHtml;
        
        // 添加到画廊
        gallery.appendChild(photoContainer);
        
        // 为新添加的图片设置点击事件
        const imgElement = photoContainer.querySelector('img');
        const newImageObj = {
            src: imgElement.src,
            title: imageData.title,
            element: photoContainer,
            isNew: isNew
        };
        
        // 添加到images数组
        images.push(newImageObj);
        
        // 设置点击事件
        photoContainer.addEventListener('click', () => {
            openViewer(images.indexOf(newImageObj));
        });
    }
    
    // 关于页面切换功能
    if (aboutBtn && aboutCard) {
        // 点击关于按钮显示卡片
        aboutBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            aboutCard.classList.toggle('active');
            
            // 添加点击外部区域关闭卡片的事件
            if (aboutCard.classList.contains('active')) {
                setTimeout(() => {
                    document.addEventListener('click', handleOutsideClick);
                }, 10);
            } else {
                document.removeEventListener('click', handleOutsideClick);
            }
        });
        
        // 点击关闭按钮隐藏卡片
        if (closeAbout) {
            closeAbout.addEventListener('click', (e) => {
                e.stopPropagation();
                aboutCard.classList.remove('active');
                document.removeEventListener('click', handleOutsideClick);
            });
        }
        
        // 点击卡片内容区域阻止冒泡
        aboutCard.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }
    
    // 处理点击外部区域关闭卡片
    function handleOutsideClick(e) {
        if (!aboutCard.contains(e.target) && e.target !== aboutBtn) {
            aboutCard.classList.remove('active');
            document.removeEventListener('click', handleOutsideClick);
        }
    }
    
    // 懒加载图片
    function initLazyLoading() {
        const lazyImages = document.querySelectorAll('.lazy-image:not(.loaded)');
        
        // 使用Intersection Observer API实现懒加载
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    
                    // 确保图片加载完成后添加loaded类
                    if (img.complete) {
                        img.classList.add('loaded');
                    } else {
                        img.onload = () => {
                            img.classList.add('loaded');
                        };
                    }
                    
                    // 停止观察已加载的图片
                    observer.unobserve(img);
                }
            });
        }, {
            root: null, // 使用视口作为根
            rootMargin: '0px 0px 200px 0px', // 提前200px开始加载
            threshold: 0.1 // 当图片有10%可见时触发
        });
        
        // 开始观察所有懒加载图片
        lazyImages.forEach(img => {
            imageObserver.observe(img);
        });
    }
    
    // 打开全屏查看器
    function openViewer(index) {
        currentImageIndex = index;
        
        // 更新查看器中的图片
        updateViewerImage();
        
        // 显示查看器
        viewer.style.display = 'flex';
        setTimeout(() => {
            viewer.classList.add('active');
        }, 10);
        
        // 锁定页面滚动
        document.body.style.overflow = 'hidden';
        
        // 预加载相邻图片
        preloadAdjacentImages(index);
    }
    
    // 更新查看器中的图片
    function updateViewerImage() {
        // 显示加载指示器
        imageContainer.classList.add('loading');
        
        // 重置图片样式和变换
        viewerImg.style.transform = 'none';
        viewerImg.classList.remove('loaded');
        
        // 更新图片标题
        viewerTitle.textContent = allImageSources[currentImageIndex].title;
        imageCounter.textContent = `${currentImageIndex + 1} / ${allImageSources.length}`;
        
        // 设置图片来源
        viewerImg.src = allImageSources[currentImageIndex].src;
        viewerImg.alt = allImageSources[currentImageIndex].title;
        
        // 图片加载完成后处理 - 特殊处理移动设备
        viewerImg.onload = function() {
            // 隐藏加载指示器
            imageContainer.classList.remove('loading');
            loadingIndicator.style.display = 'none';
            
            if (isMobile) {
                // 针对移动设备的特殊处理
                viewerImg.style.opacity = '1';
                viewerImg.style.transform = 'none';
                viewerImg.style.webkitTransform = 'none';
            }
            
            if (typeof centerImageInViewport === 'function') {
                centerImageInViewport();
            }
            
            viewerImg.classList.add('loaded');
        };
        
        // 添加错误处理
        viewerImg.onerror = function() {
            console.error('图片加载失败:', viewerImg.src);
            // 隐藏加载指示器
            imageContainer.classList.remove('loading');
            loadingIndicator.style.display = 'none';
            
            // 尝试使用备用方法加载
            if (isMobile) {
                const imgSrc = allImageSources[currentImageIndex].src;
                // 尝试使用不带缓存参数的原始地址
                viewerImg.src = imgSrc;
            }
        };
    }
    
    // 预加载相邻图片
    function preloadAdjacentImages(index) {
        if (allImageSources.length <= 1) return;
        
        // 预加载前一张和后一张
        const prevIndex = (index - 1 + allImageSources.length) % allImageSources.length;
        const nextIndex = (index + 1) % allImageSources.length;
        
        const preloadPrev = new Image();
        preloadPrev.src = allImageSources[prevIndex].src;
        
        const preloadNext = new Image();
        preloadNext.src = allImageSources[nextIndex].src;
    }
    
    // 关闭查看器
    function closeViewer() {
        viewer.classList.remove('active');
        document.body.style.overflow = '';
        
        // 隐藏加载指示器
        imageContainer.classList.remove('loading');
        
        // 延迟重置图片，确保关闭动画完成
        setTimeout(() => {
            viewerImg.classList.remove('loaded');
            viewerImg.src = '';
        }, 300);
    }
    
    // 切换到上一张图片
    function prevImage() {
        currentImageIndex = (currentImageIndex - 1 + allImageSources.length) % allImageSources.length;
        updateViewerImage();
    }
    
    // 切换到下一张图片
    function nextImage() {
        currentImageIndex = (currentImageIndex + 1) % allImageSources.length;
        updateViewerImage();
    }
    
    // 加载更多图片
    function loadMoreImages() {
        if (isLoading || !hasMoreImages) return;
        
        isLoading = true;
        loadMoreBtn.classList.add('loading');
        loadingIndicator.classList.add('active');
        
        try {
            // 获取下一批要加载的图片（所有剩余图片）
            const newImages = allImageSources.slice(currentLoadedCount);
            
            if (newImages.length > 0) {
                // 添加新图片到页面
                newImages.forEach((imageData, index) => {
                    createPhotoElement(imageData, index, true);
                });
                
                // 更新已加载图片数量
                currentLoadedCount = allImageSources.length;
                
                // 初始化新加载图片的懒加载
                initLazyLoading();
                
                // 更新加载更多按钮状态
                updateLoadMoreButtonState();
            } else {
                updateLoadMoreButtonState();
            }
            
        } catch (error) {
            console.error('加载更多图片失败:', error);
        } finally {
            // 延迟移除加载状态，模拟加载过程
            setTimeout(() => {
                isLoading = false;
                loadMoreBtn.classList.remove('loading');
                loadingIndicator.classList.remove('active');
            }, 500);
        }
    }
    
    // 更新加载更多按钮状态
    function updateLoadMoreButtonState() {
        hasMoreImages = currentLoadedCount < allImageSources.length;
        
        if (!hasMoreImages) {
            loadMoreBtn.textContent = '没有更多照片了';
            loadMoreBtn.disabled = true;
        }
    }
    
    // 绑定事件
    closeButton.addEventListener('click', closeViewer);
    prevButton.addEventListener('click', prevImage);
    nextButton.addEventListener('click', nextImage);
    
    // 绑定加载更多按钮事件
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', loadMoreImages);
    }
    
    // 键盘导航
    document.addEventListener('keydown', (e) => {
        if (!viewer.classList.contains('active')) return;
        
        switch (e.key) {
            case 'ArrowLeft':
                prevImage();
                break;
            case 'ArrowRight':
                nextImage();
                break;
            case 'Escape':
                closeViewer();
                break;
            case ' ':
                e.preventDefault();
                nextImage();
                break;
        }
    });
    
    // 触摸事件处理
    viewer.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
    }, { passive: true });
    
    viewer.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].clientX;
        const swipeDistance = touchEndX - touchStartX;
        
        if (Math.abs(swipeDistance) > 50) {
            if (swipeDistance > 0) {
                prevImage();
            } else {
                nextImage();
            }
        }
    });
    
    // 点击背景关闭查看器
    viewer.addEventListener('click', (e) => {
        if (e.target === viewer) {
            closeViewer();
        }
    });
    
    // 阻止图片拖动
    imageContainer.addEventListener('dragstart', (e) => e.preventDefault());
    
    // 关于按钮功能
    document.getElementById('about-btn').addEventListener('click', function() {
        document.getElementById('about-card').classList.toggle('active');
    });

    document.querySelector('.close-about').addEventListener('click', function() {
        document.getElementById('about-card').classList.remove('active');
    });

    // 添加头部笑脸图标点击事件
    document.querySelector('.about-icon-link').addEventListener('click', function(e) {
        e.preventDefault();
        // 切换关于卡片的显示状态，而不是仅添加active类
        document.getElementById('about-card').classList.toggle('active');
        
        // 如果关于卡片显示，添加点击外部关闭事件，否则移除该事件
        if (document.getElementById('about-card').classList.contains('active')) {
            setTimeout(() => {
                document.addEventListener('click', handleOutsideClick);
            }, 10);
        } else {
            document.removeEventListener('click', handleOutsideClick);
        }
        
        // 阻止事件冒泡，防止立即触发外部点击事件
        e.stopPropagation();
    });
    
    // 初始化
    initializeGallery();
}); 