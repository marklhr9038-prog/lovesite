// 全局变量
let editMode = false;
let particleSystem;
let photoCarousel;

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // 初始化粒子系统
    initParticleSystem();
    
    // 初始化照片轮播
    initPhotoCarousel();
    
    // 初始化蜡烛交互
    initCandleInteraction();
    
    // 初始化编辑模式
    initEditMode();
    
    // 初始化爱心动画
    initHeartAnimation();
    
    // 加载保存的数据
    loadSavedData();
    
    // 初始化滚动动画
    initScrollAnimations();
}

// 粒子系统初始化
function initParticleSystem() {
    const sketch = (p) => {
        let particles = [];
        
        p.setup = () => {
            const canvas = p.createCanvas(p.windowWidth, p.windowHeight);
            canvas.parent('particles-canvas');
            
            // 创建粒子
            for (let i = 0; i < 50; i++) {
                particles.push(new Particle(p));
            }
        };
        
        p.draw = () => {
            p.clear();
            
            // 更新和绘制粒子
            particles.forEach(particle => {
                particle.update();
                particle.display();
            });
        };
        
        p.windowResized = () => {
            p.resizeCanvas(p.windowWidth, p.windowHeight);
        };
        
        class Particle {
            constructor(p) {
                this.p = p;
                this.x = p.random(p.width);
                this.y = p.random(p.height);
                this.vx = p.random(-0.5, 0.5);
                this.vy = p.random(-0.5, 0.5);
                this.alpha = p.random(50, 150);
                this.size = p.random(2, 6);
            }
            
            update() {
                this.x += this.vx;
                this.y += this.vy;
                
                // 边界检查
                if (this.x < 0 || this.x > this.p.width) this.vx *= -1;
                if (this.y < 0 || this.y > this.p.height) this.vy *= -1;
            }
            
            display() {
                this.p.fill(232, 180, 184, this.alpha);
                this.p.noStroke();
                this.p.ellipse(this.x, this.y, this.size);
            }
        }
    };
    
    particleSystem = new p5(sketch);
}

// 初始化照片轮播
function initPhotoCarousel() {
    // 创建示例照片数据
    const samplePhotos = [
        {
            id: 1,
            src: 'https://kimi-web-img.moonshot.cn/img/i.pinimg.com/00d6f164232f46c34bf37bf291c8ae2b7a26915f.jpg',
            title: '春日花开',
            description: '美丽的花朵如你的笑容般灿烂'
        },
        {
            id: 2,
            src: 'https://kimi-web-img.moonshot.cn/img/img.freepik.com/16010deb9b95354ae91d22c6e202f740c71901ef.jpg',
            title: '温柔天空',
            description: '天空中的云朵像你一样温柔'
        },
        {
            id: 3,
            src: 'https://kimi-web-img.moonshot.cn/img/www.fnp.com/1bd4bc27d0aa5de5a23e51165ecf0e6e5a8122b2.jpg',
            title: '玫瑰花语',
            description: '玫瑰诉说着我们的爱情故事'
        }
    ];
    
    // 保存到本地存储
    if (!localStorage.getItem('memorialPhotos')) {
        localStorage.setItem('memorialPhotos', JSON.stringify(samplePhotos));
    }
    
    // 加载照片
    loadPhotos();
    
    // 初始化Splide轮播
    photoCarousel = new Splide('#photo-carousel', {
        type: 'loop',
        perPage: 3,
        perMove: 1,
        gap: '2rem',
        autoplay: true,
        interval: 4000,
        pauseOnHover: true,
        breakpoints: {
            768: {
                perPage: 1,
            },
            1024: {
                perPage: 2,
            }
        }
    });
    
    photoCarousel.mount();
}

// 加载照片
function loadPhotos() {
    const photos = JSON.parse(localStorage.getItem('memorialPhotos') || '[]');
    const photoList = document.getElementById('photo-list');
    
    photoList.innerHTML = '';
    
    photos.forEach(photo => {
        const li = document.createElement('li');
        li.className = 'splide__slide';
        li.innerHTML = `
            <div class="photo-frame floating">
                <img src="${photo.src}" alt="${photo.title}" class="w-full h-64 object-cover">
                <div class="p-4 bg-white">
                    <h3 class="font-semibold text-gray-800 mb-2">${photo.title}</h3>
                    <p class="text-sm text-gray-600">${photo.description}</p>
                </div>
            </div>
        `;
        photoList.appendChild(li);
    });
}

// 初始化蜡烛交互
function initCandleInteraction() {
    const candles = document.querySelectorAll('.candle');
    
    candles.forEach((candle, index) => {
        candle.addEventListener('click', () => {
            const flame = document.getElementById(`flame${index + 1}`);
            flame.classList.toggle('lit');
            
            // 保存蜡烛状态
            const candleStates = JSON.parse(localStorage.getItem('candleStates') || '{}');
            candleStates[`candle${index + 1}`] = flame.classList.contains('lit');
            localStorage.setItem('candleStates', JSON.stringify(candleStates));
            
            // 添加点击效果
            createClickEffect(candle);
        });
    });
    
    // 加载保存的蜡烛状态
    const savedStates = JSON.parse(localStorage.getItem('candleStates') || '{}');
    Object.keys(savedStates).forEach(candleId => {
        if (savedStates[candleId]) {
            const flame = document.getElementById(candleId.replace('candle', 'flame'));
            if (flame) {
                flame.classList.add('lit');
            }
        }
    });
}

// 初始化编辑模式
function initEditMode() {
    const editToggle = document.getElementById('editToggle');
    const body = document.body;
    
    editToggle.addEventListener('click', () => {
        editMode = !editMode;
        body.classList.toggle('edit-mode');
        editToggle.textContent = editMode ? '退出编辑' : '编辑模式';
        editToggle.classList.toggle('bg-red-500');
        editToggle.classList.toggle('hover:bg-red-600');
        editToggle.classList.toggle('bg-rose-400');
        editToggle.classList.toggle('hover:bg-rose-500');
        
        if (editMode) {
            showEditInstructions();
        }
    });
    
    // 初始化可编辑元素
    const editableElements = document.querySelectorAll('.editable');
    editableElements.forEach(element => {
        element.addEventListener('click', (e) => {
            if (editMode) {
                makeElementEditable(element);
            }
        });
    });
}

// 显示编辑说明
function showEditInstructions() {
    const instruction = document.createElement('div');
    instruction.id = 'edit-instruction';
    instruction.className = 'fixed top-20 right-4 bg-rose-400 text-white p-4 rounded-lg shadow-lg z-50';
    instruction.innerHTML = `
        <div class="flex items-center space-x-2">
            <span>✏️</span>
            <div>
                <p class="font-semibold">编辑模式已开启</p>
                <p class="text-sm">点击任意文本区域进行编辑</p>
            </div>
        </div>
    `;
    
    document.body.appendChild(instruction);
    
    setTimeout(() => {
        if (instruction.parentNode) {
            instruction.remove();
        }
    }, 3000);
}

// 使元素可编辑
function makeElementEditable(element) {
    const currentText = element.textContent;
    const fieldName = element.dataset.field;
    
    // 创建输入框
    const input = document.createElement('textarea');
    input.value = currentText;
    input.className = 'w-full p-2 border border-rose-300 rounded resize-none';
    input.style.minHeight = '60px';
    
    // 替换元素内容
    element.innerHTML = '';
    element.appendChild(input);
    input.focus();
    input.select();
    
    // 保存编辑
    const saveEdit = () => {
        const newText = input.value.trim() || currentText;
        element.textContent = newText;
        
        // 保存到本地存储
        const savedData = JSON.parse(localStorage.getItem('memorialContent') || '{}');
        savedData[fieldName] = newText;
        localStorage.setItem('memorialContent', JSON.stringify(savedData));
        
        // 添加保存动画
        element.style.background = 'rgba(34, 197, 94, 0.1)';
        setTimeout(() => {
            element.style.background = '';
        }, 1000);
    };
    
    // 事件监听
    input.addEventListener('blur', saveEdit);
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            saveEdit();
        } else if (e.key === 'Escape') {
            element.textContent = currentText;
        }
    });
}

// 初始化爱心动画
function initHeartAnimation() {
    document.addEventListener('click', (e) => {
        if (!editMode && e.target.closest('body') && !e.target.closest('nav') && !e.target.closest('.editable')) {
            createHeart(e.clientX, e.clientY);
        }
    });
}

// 创建爱心
function createHeart(x, y) {
    const heart = document.createElement('div');
    heart.className = 'heart';
    heart.innerHTML = '💖';
    heart.style.left = x + 'px';
    heart.style.top = y + 'px';
    
    document.body.appendChild(heart);
    
    // 随机水平偏移
    const randomX = (Math.random() - 0.5) * 100;
    heart.style.transform = `translateX(${randomX}px)`;
    
    setTimeout(() => {
        if (heart.parentNode) {
            heart.remove();
        }
    }, 3000);
}

// 创建点击效果
function createClickEffect(element) {
    const ripple = document.createElement('div');
    ripple.className = 'absolute inset-0 bg-white/30 rounded-full transform scale-0';
    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);
    
    anime({
        targets: ripple,
        scale: [0, 1],
        opacity: [1, 0],
        duration: 600,
        easing: 'easeOutQuart',
        complete: () => {
            if (ripple.parentNode) {
                ripple.remove();
            }
        }
    });
}

// 加载保存的数据
function loadSavedData() {
    // 加载文本内容
    const savedContent = JSON.parse(localStorage.getItem('memorialContent') || '{}');
    Object.keys(savedContent).forEach(fieldName => {
        const element = document.querySelector(`[data-field="${fieldName}"]`);
        if (element) {
            element.textContent = savedContent[fieldName];
        }
    });
}

// 初始化滚动动画
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // 观察需要动画的元素
    const animatedElements = document.querySelectorAll('.memory-card, .timeline-item');
    animatedElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(el);
    });
}

// 添加新回忆
function addNewMemory() {
    const container = document.getElementById('timeline-container');
    const newMemory = document.createElement('div');
    newMemory.className = 'timeline-item memory-card p-6 rounded-lg';
    
    const memoryId = Date.now();
    newMemory.innerHTML = `
        <div class="flex items-start space-x-4">
            <div class="flex-1">
                <h3 class="text-xl font-semibold text-gray-800 mb-2 editable" data-field="memory-title-${memoryId}">
                    新的回忆
                </h3>
                <p class="text-gray-600 mb-3 editable" data-field="memory-date-${memoryId}">
                    ${new Date().toLocaleDateString()}
                </p>
                <p class="text-gray-700 leading-relaxed editable" data-field="memory-content-${memoryId}">
                    在这里记录美好的回忆...
                </p>
            </div>
        </div>
    `;
    
    container.appendChild(newMemory);
    
    // 添加编辑功能
    const editableElements = newMemory.querySelectorAll('.editable');
    editableElements.forEach(element => {
        element.addEventListener('click', (e) => {
            if (editMode) {
                makeElementEditable(element);
            }
        });
    });
    
    // 滚动到新回忆
    newMemory.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    // 添加动画
    anime({
        targets: newMemory,
        opacity: [0, 1],
        translateY: [30, 0],
        duration: 600,
        easing: 'easeOutQuart'
    });
}

// 导出数据
function exportData() {
    const data = {
        content: JSON.parse(localStorage.getItem('memorialContent') || '{}'),
        photos: JSON.parse(localStorage.getItem('memorialPhotos') || '[]'),
        candleStates: JSON.parse(localStorage.getItem('candleStates') || '{}')
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'memorial-data.json';
    a.click();
    URL.revokeObjectURL(url);
}

// 导入数据
function importData(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const data = JSON.parse(e.target.result);
            
            if (data.content) {
                localStorage.setItem('memorialContent', JSON.stringify(data.content));
            }
            if (data.photos) {
                localStorage.setItem('memorialPhotos', JSON.stringify(data.photos));
            }
            if (data.candleStates) {
                localStorage.setItem('candleStates', JSON.stringify(data.candleStates));
            }
            
            alert('数据导入成功！页面将刷新以应用更改。');
            location.reload();
        } catch (error) {
            alert('数据导入失败，请检查文件格式。');
        }
    };
    reader.readAsText(file);
}

// 重置所有数据
function resetAllData() {
    if (confirm('确定要重置所有数据吗？此操作不可恢复。')) {
        localStorage.clear();
        alert('数据已重置！页面将刷新。');
        location.reload();
    }
}