// 双功能按钮：页面顶部显示关于卡片，滚动后返回顶部
document.addEventListener('DOMContentLoaded', function() {
    // 检测是否为移动设备
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;
    
    // 预先创建按钮元素但不立即添加到DOM
    const dualFunctionBtn = document.createElement('button');
    dualFunctionBtn.className = 'back-to-top-btn';
    dualFunctionBtn.setAttribute('aria-label', '关于/返回顶部');
    dualFunctionBtn.setAttribute('type', 'button'); // 明确指定按钮类型
    
    // 使用纯文本而不是HTML来避免额外的DOM复杂度
    const infoIcon = document.createElement('i');
    infoIcon.className = 'fas fa-info';
    
    // 使用appendChild而不是innerHTML以减少渲染复杂性
    dualFunctionBtn.appendChild(infoIcon);
    
    // 获取关于卡片元素
    const aboutCard = document.getElementById('about-card');
    
    // 标记按钮当前模式（info或top）
    let btnMode = 'info';
    let isButtonVisible = false;
    let buttonAttached = false;
    
    // 添加按钮到DOM - 使用更长的延迟确保初始渲染完成
    setTimeout(() => {
        if (!buttonAttached) {
            document.body.appendChild(dualFunctionBtn);
            buttonAttached = true;
            
            // 初始状态评估
            updateButtonState();
        }
    }, isMobile ? 1500 : 800);
    
    // 按钮状态更新函数 - 集中处理所有状态变化
    function updateButtonState() {
        const shouldShowTopButton = window.scrollY > 300;
        
        // 按钮可见性控制
        if (!isButtonVisible) {
            setTimeout(() => {
                dualFunctionBtn.classList.add('visible');
                isButtonVisible = true;
            }, 50); // 短延迟确保CSS已应用
        }
        
        // 按钮功能切换 - 仅在模式变化时执行
        if (shouldShowTopButton && btnMode !== 'top') {
            btnMode = 'top';
            
            // 清除现有内容并添加新图标 - 避免使用innerHTML
            dualFunctionBtn.innerHTML = '';
            const upIcon = document.createElement('i');
            upIcon.className = 'fas fa-arrow-up';
            dualFunctionBtn.appendChild(upIcon);
            
            dualFunctionBtn.setAttribute('aria-label', '返回顶部');
        } else if (!shouldShowTopButton && btnMode !== 'info') {
            btnMode = 'info';
            
            // 清除现有内容并添加新图标 - 避免使用innerHTML
            dualFunctionBtn.innerHTML = '';
            const infoIcon = document.createElement('i');
            infoIcon.className = 'fas fa-info';
            dualFunctionBtn.appendChild(infoIcon);
            
            dualFunctionBtn.setAttribute('aria-label', '关于曾婉之');
        }
    }
    
    // 极简滚动处理 - 移动端使用更大的阈值
    let isScrolling;
    window.addEventListener('scroll', function() {
        // 清除之前的定时器
        window.clearTimeout(isScrolling);
        
        // 避免密集更新，仅在滚动结束时更新一次
        isScrolling = setTimeout(function() {
            updateButtonState();
        }, isMobile ? 200 : 100);
    }, { passive: true });
    
    // 简化点击处理 - 不使用复杂的状态管理
    dualFunctionBtn.addEventListener('click', function() {
        if (btnMode === 'top') {
            // 返回顶部功能 - 使用简单的滚动
            try {
                window.scrollTo({
                    top: 0,
                    behavior: isMobile ? 'auto' : 'smooth' // 移动端使用即时滚动避免动画性能问题
                });
            } catch (e) {
                // 回退方案：立即滚动
                window.scrollTo(0, 0);
            }
        } else if (aboutCard) {
            // 显示关于卡片
            aboutCard.classList.add('active');
        }
        
        // 移动设备上添加点击反馈
        if (isMobile) {
            dualFunctionBtn.classList.add('active');
            setTimeout(() => {
                dualFunctionBtn.classList.remove('active');
            }, 150); // 更短的延迟
        }
    });
    
    // 初始化时的状态评估
    if (buttonAttached) {
        updateButtonState();
    }
});