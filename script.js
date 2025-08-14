// --- 快餐阵营测试核心逻辑（修复进度统计问题） ---

// 1. 16道题目库（带有品牌偏向权重）
const quizData = [
    {
        question: "看到“30元手枪腿”的活动，你的反应是？",
        options: [
            { text: "立刻打开地图搜最近的德克士", points: {dicos: 20} },
            { text: "冷笑：不如KFC的原味鸡", points: {kfc: 15} },
            { text: "转发给朋友：“这是你掉的腿吗？”", points: {meme: 10} },
            { text: "疑惑：手枪腿是什么？能组手枪吗？", points: {neutral: 5} }
        ]
    },
    {
        question: "当有人说“汉堡王的皇堡太干”，你会？",
        options: [
            { text: "怒怼：“你懂什么叫美式硬核！”", points: {burgerking: 20} },
            { text: "默默推荐：“试试加酸黄瓜”", points: {burgerking: 15} },
            { text: "附议：“还是麦当劳的巨无霸湿润”", points: {mcd: 10} },
            { text: "P图成“皇堡配奶茶”表情包", points: {meme: 5} }
        ]
    },
    {
        question: "华莱士“10元3个汉堡”的活动对你来说是？",
        options: [
            { text: "每周改善伙食的固定项目", points: {huashilai: 20} },
            { text: "不敢吃，怕窜稀（狗头）", points: {meme: 15} },
            { text: "性价比之王，永远的神", points: {huashilai: 10} },
            { text: "垃圾食品，从不碰", points: {neutral: 5} }
        ]
    },
    {
        question: "路过德克士看到“买一送一”，你会？",
        options: [
            { text: "冲进去：“两个手枪腿，谢谢”", points: {dicos: 20} },
            { text: "拍照发群：“德克士急了”", points: {meme: 15} },
            { text: "对比KFC价格后再决定", points: {kfc: 10} },
            { text: "买了但只吃一个，另一个当明天早餐", points: {neutral: 5} }
        ]
    },
    {
        question: "你的手机优惠券相册里，最多的是？",
        options: [
            { text: "麦当劳各种套餐券", points: {mcd: 20} },
            { text: "KFC疯狂星期四专属券", points: {kfc: 15} },
            { text: "华莱士5元无门槛券", points: {huashilai: 10} },
            { text: "所有品牌都有，按价格排序", points: {collector: 5} }
        ]
    },
    {
        question: "朋友约你吃快餐，你的选择标准是？",
        options: [
            { text: "哪家有优惠券去哪家", points: {huashilai: 15} },
            { text: "必须是我信仰的品牌（如麦门）", points: {mcd: 20} },
            { text: "选大家都没吃过的新品牌", points: {collector: 10} },
            { text: "无所谓，我只吃薯条", points: {neutral: 5} }
        ]
    },
    {
        question: "对于“疯狂星期四”的段子，你的态度是？",
        options: [
            { text: "每周四必发，乐此不疲", points: {kfc: 15, meme: 5} },
            { text: "已看腻，但会配合回复“V我50”", points: {meme: 10} },
            { text: "幼稚，从不参与", points: {neutral: 5} },
            { text: "自己创作新段子，引领潮流", points: {meme: 20} }
        ]
    },
    {
        question: "看到麦当劳出了新品，你会？",
        options: [
            { text: "第一天就去打卡，发朋友圈", points: {mcd: 20} },
            { text: "等测评，好吃再去", points: {neutral: 10} },
            { text: "对比KFC同类产品，再决定", points: {kfc: 15} },
            { text: "P成“麦当劳联名华莱士”恶搞图", points: {meme: 5} }
        ]
    },
    {
        question: "当别人说“肯德基的鸡有6个翅膀”，你会？",
        options: [
            { text: "怒怼谣言，科普正规养殖流程", points: {kfc: 20} },
            { text: "顺着说：“所以才那么便宜啊”", points: {meme: 15} },
            { text: "推荐对方吃麦当劳", points: {mcd: 10} },
            { text: "默默拉黑这个人", points: {neutral: 5} }
        ]
    },
    {
        question: "你会为了什么特意去德克士？",
        options: [
            { text: "手枪腿！必须是手枪腿！", points: {dicos: 20} },
            { text: "他们的魔法鸡块比KFC好吃", points: {dicos: 15} },
            { text: "附近只有这家快餐店", points: {neutral: 5} },
            { text: "拍照发群里假装是KFC", points: {meme: 10} }
        ]
    },
    {
        question: "汉堡王的“皇堡”对你来说是？",
        options: [
            { text: "汉堡界的天花板，无可替代", points: {burgerking: 20} },
            { text: "太大了，每次都吃不完", points: {neutral: 5} },
            { text: "不如麦当劳的巨无霸经典", points: {mcd: 15} },
            { text: "适合P成“巨无霸的爸爸”玩梗", points: {meme: 10} }
        ]
    },
    {
        question: "华莱士的哪点最吸引你？",
        options: [
            { text: "价格便宜，学生党福音", points: {huashilai: 20} },
            { text: "虽然便宜但味道不错", points: {huashilai: 15} },
            { text: "适合用来做“窜稀”梗图", points: {meme: 10} },
            { text: "没什么吸引我的，偶尔吃一次", points: {neutral: 5} }
        ]
    },
    {
        question: "你手机里有多少个快餐品牌的APP？",
        options: [
            { text: "只留了我信仰的那个（如麦当劳、开封菜）", points: {mcd: 10, kfc: 10} },
            { text: "3个以上，各有各的用处", points: {collector: 15} },
            { text: "全有，哪家优惠用哪家", points: {collector: 20} },
            { text: "一个都没有，直接到店买", points: {neutral: 5} }
        ]
    },
    {
        question: "看到有人在朋友圈晒快餐，你会？",
        options: [
            { text: "评论：“V我50，我也想吃”", points: {meme: 20} },
            { text: "默默点个赞，心里想吃", points: {neutral: 5} },
            { text: "如果是我喜欢的品牌，会问地址", points: {mcd: 10, kfc: 10} },
            { text: "回复：“不如我昨天吃的那家”", points: {collector: 15} }
        ]
    },
    {
        question: "你怎么看待快餐品牌之间的竞争？",
        options: [
            { text: "受益的是消费者，越多优惠越好", points: {collector: 20} },
            { text: "我只关心我喜欢的品牌赢", points: {mcd: 10, kfc: 10} },
            { text: "竞争越激烈，梗图素材越多", points: {meme: 15} },
            { text: "不关心，我只吃固定的那几样", points: {neutral: 5} }
        ]
    },
    {
        question: "如果只能选一个快餐品牌吃一辈子，你会选？",
        options: [
            { text: "麦当劳，麦门永存！", points: {mcd: 20} },
            { text: "肯德基，疯狂星期四不能停", points: {kfc: 20} },
            { text: "德克士，手枪腿是我的信仰", points: {dicos: 20} },
            { text: "汉堡王，皇堡能吃到天荒地老", points: {burgerking: 20} },
            { text: "华莱士，性价比才是王道", points: {huashilai: 20} }
        ]
    }
];

// 2. 阵营定义
const factions = {
    mcd: {
        name: "麦门·永恒圣徒",
        desc: "巨无霸是你的圣经，薯条是你的信仰。\n对麦当劳的忠诚刻在DNA里，\n其他品牌都是'异端'。\n会为了'麦辣鸡翅买一送一'早起半小时，\n能精准说出每个季度的新品。",
        color: "#FFC107",
        badge: "🍟"
    },
    kfc: {
        name: "开封菜·周四狂信徒",
        desc: "每周三晚上就开始焦虑：\n'明天疯狂星期四，该怎么凑单最划算'。\n手机里存着KFC所有产品热量表，\n却依然管不住嘴。\n对'V我50'的梗了如指掌，\n甚至能自己创作新段子。",
        color: "#D32F2F",
        badge: "🍗"
    },
    dicos: {
        name: "德克士·手枪腿骑士",
        desc: "为了手枪腿可以跨越3个公交站，\n坚信'没有手枪腿的快餐是没有灵魂的'。\n会主动向朋友科普'德克士的鸡是跑步鸡'，\n对魔法鸡块的蘸酱有自己的独家配方。",
        color: "#FF9800",
        badge: "🦵"
    },
    burgerking: {
        name: "汉堡王·皇堡守护者",
        desc: "认为皇堡是'汉堡界的珠穆朗玛峰'，\n鄙视那些'吃汉堡只吃单层'的人。\n会特意点'加3片肉饼'的隐藏菜单，\n坚信'越大越好吃'是快餐界的真理。",
        color: "#795548",
        badge: "🍔"
    },
    huashilai: {
        name: "华莱士·性价比之王",
        desc: "对'10元3个汉堡'的活动了如指掌，\n能精准说出每家华莱士的优惠差异。\n坚信'花最少的钱，吃最多的肉'才是真理，\n对各种优惠券的使用时机了如指掌。",
        color: "#4CAF50",
        badge: "💸"
    },
    collector: {
        name: "快餐·集邮爱好者",
        desc: "你的人生目标是'吃遍所有快餐品牌'，\n手机里有12个快餐APP，\n会为了'新用户首单减20'注册新号。\n对每个品牌的优缺点了如指掌，\n能根据不同场景推荐最合适的选择。",
        color: "#9C27B0",
        badge: "📱"
    },
    meme: {
        name: "梗图·整活大师",
        desc: "吃快餐只是为了创作素材，\n你的朋友圈一半内容是'V我50'变种梗。\n能在3分钟内P出'肯德基联名华莱士'的假海报，\n对每个品牌的梗图文化了如指掌。",
        color: "#2196F3",
        badge: "memes"
    },
    neutral: {
        name: "快餐·佛系食客",
        desc: "对所有快餐品牌都一视同仁，\n没有特别的偏好。\n吃快餐只是为了填饱肚子，\n对各种梗和活动不太感冒。\n通常点单很固定，\n不管去哪家都点差不多的东西。",
        color: "#8BC34A",
        badge: "🥗"
    }
};

// 3. 页面交互逻辑
document.addEventListener('DOMContentLoaded', () => {
    // 获取DOM元素
    const quizContainer = document.getElementById('quiz-container');
    const resultContainer = document.getElementById('result-container');
    const factionTitle = document.getElementById('faction-title');
    const factionDesc = document.getElementById('faction-desc');
    const generateCertBtn = document.getElementById('generate-cert-btn');
    const saveCertBtn = document.getElementById('save-cert-btn');
    const userNameInput = document.getElementById('user-name');
    const certOutput = document.getElementById('cert-output');
    const downloadTip = document.getElementById('download-tip');
    const progressBar = document.getElementById('progress-bar');
    const progressText = document.getElementById('progress-text');
    const canvas = document.getElementById('cert-canvas');
    
    // 状态变量
    let brandScores = {
        mcd: 0,
        kfc: 0,
        dicos: 0,
        burgerking: 0,
        huashilai: 0,
        collector: 0,
        meme: 0,
        neutral: 0
    };
    let answeredCount = 0;
    let userFaction = null;
    let certImageUrl = '';

    // 动态生成题目
    function buildQuiz() {
        quizData.forEach((data, index) => {
            const questionBlock = document.createElement('div');
            questionBlock.className = 'question-block';
            questionBlock.id = `question-${index}`;
            
            const questionText = document.createElement('p');
            questionText.innerText = `${index + 1}. ${data.question}`;
            questionBlock.appendChild(questionText);
            
            const optionsDiv = document.createElement('div');
            optionsDiv.className = 'options';
            
            data.options.forEach((option, optIndex) => {
                const label = document.createElement('label');
                const radio = document.createElement('input');
                radio.type = 'radio';
                radio.name = `question${index}`;
                radio.value = optIndex;
                radio.dataset.points = JSON.stringify(option.points);
                radio.dataset.question = index; // 标记所属题目
                
                // 选项点击事件（修正版）
                radio.addEventListener('change', function() {
                    const questionIndex = this.dataset.question;
                    const questionRadios = document.querySelectorAll(`input[name="question${questionIndex}"]`);
                    const wasAnswered = Array.from(questionRadios).some(r => r.checked && r !== this);
                    
                    // 只有从"未答"变为"已答"时才更新进度
                    if (!wasAnswered) {
                        answeredCount++;
                        updateProgress();
                    }
                    
                    // 更新分数（先减去该题之前的得分）
                    resetQuestionScores(questionIndex);
                    updateScores(option.points);
                });
                
                label.appendChild(radio);
                label.append(option.text);
                optionsDiv.appendChild(label);
            });
            
            questionBlock.appendChild(optionsDiv);
            quizContainer.appendChild(questionBlock);
        });

        // 添加提交按钮
        const submitBtn = document.createElement('button');
        submitBtn.innerText = '提交答案，揭晓阵营！';
        submitBtn.onclick = showResults;
        quizContainer.appendChild(submitBtn);
    }

    // 更新答题进度
    function updateProgress() {
        const progress = (answeredCount / quizData.length) * 100;
        progressBar.style.width = `${progress}%`;
        progressText.textContent = `进度: ${answeredCount}/${quizData.length}`;
    }

    // 更新品牌分数
    function updateScores(points) {
        for (const brand in points) {
            if (brandScores.hasOwnProperty(brand)) {
                brandScores[brand] += points[brand];
            }
        }
    }

    // 重置某题的分数（处理重新选择的情况）
    function resetQuestionScores(questionIndex) {
        const questionBlock = document.getElementById(`question-${questionIndex}`);
        const checkedRadio = questionBlock.querySelector('input[type="radio"]:checked');
        if (checkedRadio) {
            const oldPoints = JSON.parse(checkedRadio.dataset.points);
            for (const brand in oldPoints) {
                if (brandScores.hasOwnProperty(brand)) {
                    brandScores[brand] -= oldPoints[brand];
                }
            }
        }
    }

    // 显示结果（修正检测逻辑）
    function showResults() {
        // 重新计算实际已答题数量（彻底修复进度问题）
        let actualAnswered = 0;
        quizData.forEach((_, index) => {
            const hasAnswer = document.querySelector(`input[name="question${index}"]:checked`) !== null;
            if (hasAnswer) actualAnswered++;
        });
        answeredCount = actualAnswered;
        updateProgress();

        // 检查是否答完所有题
        if (answeredCount < quizData.length) {
            alert(`还有${quizData.length - answeredCount}道题没答完哦！请完成所有问题再提交。`);
            return;
        }

        // 确定用户阵营（找到分数最高的品牌）
        let maxScore = -1;
        let mainBrand = 'neutral';
        
        for (const brand in brandScores) {
            if (brandScores[brand] > maxScore) {
                maxScore = brandScores[brand];
                mainBrand = brand;
            }
        }
        
        userFaction = factions[mainBrand];
        
        // 显示结果页面
        quizContainer.classList.add('hidden');
        resultContainer.classList.remove('hidden');
        
        // 显示阵营信息（居中对齐）
        factionTitle.innerHTML = `${userFaction.badge} ${userFaction.name} ${userFaction.badge}`;
        factionTitle.style.backgroundColor = userFaction.color;
        // factionDesc.innerHTML = userFaction.desc.replace(/\n/g, '<br>'); // 将换行符转换为HTML换行
        // factionDesc.style.textAlign = 'center';
        // factionDesc.style.whiteSpace = 'pre-wrap';
        // factionDesc.style.wordWrap = 'break-word';
        // factionDesc.style.maxWidth = '80%';
        // factionDesc.style.margin = '0 auto';
    }

    // 生成证书
    generateCertBtn.addEventListener('click', () => {
        const userName = userNameInput.value.trim() || '快餐爱好者';
        const ctx = canvas.getContext('2d');
        
        // 1. 绘制白色背景
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // 2. 绘制顶部和底部的阵营色带
        const ribbonHeight = 60;
        // 顶部色带
        ctx.fillStyle = userFaction.color;
        ctx.fillRect(0, 0, canvas.width, ribbonHeight);
        // 底部色带
        ctx.fillRect(0, canvas.height - ribbonHeight, canvas.width, ribbonHeight);
        
        // 3. 绘制标题（在顶部色带上）
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 40px Arial';
        ctx.textAlign = 'center';
        ctx.shadowColor = 'rgba(0,0,0,0.3)';
        ctx.shadowBlur = 3;
        ctx.fillText('快 餐 荣 誉 证 书', canvas.width / 2, ribbonHeight - 15);
        ctx.shadowBlur = 0;
        
        // 4. 绘制用户信息
        ctx.fillStyle = '#333';
        ctx.font = '26px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('兹授予', canvas.width / 2, 200);
        
        // 名字带阴影特效
        ctx.fillStyle = userFaction.color;
        ctx.font = 'bold 52px Arial';
        ctx.shadowColor = 'rgba(0,0,0,0.2)';
        ctx.shadowBlur = 4;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
        ctx.fillText(userName, canvas.width / 2, 280);
        ctx.shadowBlur = 0;
        
        // 5. 阵营信息（带徽章）
        ctx.fillStyle = userFaction.color;
        ctx.font = 'bold 36px Arial';
        ctx.fillText(`${userFaction.badge} ${userFaction.name} ${userFaction.badge}`, canvas.width / 2, 360);
        
        // 6. 阵营描述（居中对齐，自动换行）
        ctx.fillStyle = '#666';
        ctx.font = '18px Arial';
        const descLines = wrapText(userFaction.desc, 45);
        descLines.forEach((line, i) => {
            ctx.fillText(line, canvas.width / 2, 420 + i * 30);
        });
        
        // 7. 底部信息（在底部色带上）
        const today = new Date();
        ctx.fillStyle = '#ffffff';
        ctx.font = '18px Arial';
        ctx.textAlign = 'center';
        ctx.shadowColor = 'rgba(0,0,0,0.3)';
        ctx.shadowBlur = 2;
        ctx.fillText(
            `认证日期：${today.getFullYear()}年${today.getMonth() + 1}月${today.getDate()}日`,
            canvas.width / 2,
            canvas.height - (ribbonHeight / 2) + 8
        );
        ctx.shadowBlur = 0;
        
        // 8. 显示证书并保存图片URL
        certImageUrl = canvas.toDataURL('image/png');
        certOutput.innerHTML = `<img src="${certImageUrl}" alt="${userFaction.name}证书">`;
        downloadTip.classList.remove('hidden');
        saveCertBtn.classList.remove('hidden');
    });

    // 保存证书功能
    saveCertBtn.addEventListener('click', () => {
        if (!certImageUrl) return;
        
        // 创建下载链接
        const link = document.createElement('a');
        link.download = `${userFaction.name}_证书.png`;
        link.href = certImageUrl;
        
        // 触发下载
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // 显示成功提示
        alert('证书已成功保存到本地！');
    });

    // 文本自动换行辅助函数
    function wrapText(text, maxChars) {
        const words = text.split(' ');
        const lines = [];
        let currentLine = '';
        
        words.forEach(word => {
            if (currentLine.length + word.length > maxChars) {
                lines.push(currentLine.trim());
                currentLine = word + ' ';
            } else {
                currentLine += word + ' ';
            }
        });
        lines.push(currentLine.trim());
        return lines;
    }

    // 初始化测验
    buildQuiz();
});