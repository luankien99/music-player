const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = 'PLAYER';

const player = $('#main');
const heading = $('.header__status h2');
const imageCD = $('.image--turn');
const audio = $('#audio');
const cd = $('.content__cd');
const playBtn = $('.btn--toggle--play');
const nextBtn = $('.btn--next');
const prevBtn = $('.btn--prev');
const randomBtn = $('.btn--random');
const repeatBtn = $('.btn--repeat');
const playList = $('.content__lists');

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    songs: [
        {   
            name: 'Song 1',
            singer: 'LuanKien',
            path: './assets/musics/song1.mp3',
            image: './assets/images/image1.jpg'
        },
        {   
            name: 'Song 2',
            singer: 'LuanKien',
            path: './assets/musics/song2.mp3',
            image: './assets/images/image2.jpg'
        },
        {   
            name: 'Song 3',
            singer: 'LuanKien',
            path: './assets/musics/song3.mp3',
            image: './assets/images/image3.jpg'
        },
        {   
            name: 'Song 4',
            singer: 'LuanKien',
            path: './assets/musics/song4.mp3',
            image: './assets/images/image4.jpg'
        },
        {   
            name: 'Song 5',
            singer: 'LuanKien',
            path: './assets/musics/song5.mp3',
            image: './assets/images/image5.jpg'
        },
        {   
            name: 'Song 6',
            singer: 'LuanKien',
            path: './assets/musics/song6.mp3',
            image: './assets/images/image6.jpg'
        },
        {   
            name: 'Song 7',
            singer: 'LuanKien',
            path: './assets/musics/song7.mp3',
            image: './assets/images/image7.jpg'
        },
        {   
            name: 'Song 8',
            singer: 'LuanKien',
            path: './assets/musics/song8.mp3',
            image: './assets/images/image8.jpg'
        },
        {   
            name: 'Song 9',
            singer: 'LuanKien',
            path: './assets/musics/song9.mp3',
            image: './assets/images/image9.jpg'
        },
        {   
            name: 'Song 10',
            singer: 'LuanKien',
            path: './assets/musics/song10.mp3',
            image: './assets/images/image10.jfif'
        },
    ],
    setConfig: function(key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
    },
    render: function() { 
        const htmls = this.songs.map((song, index) =>{
            return `
            <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index = ${index}>
                <div class="thumb" style="background-image: url(${song.image})">                       
                </div>
                <div class="body__list">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="ti ti-more-alt"></i>
                </div>
            </div>
            `;
        });
        playList.innerHTML = htmls.join('');
    },
    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex];
            }
        })
    },
    handleEvent: function() {
        const _this = this;
        const cdWidth = cd.offsetWidth;

        const cdThumbAnimation = cd.animate([
            {transform: 'rotate(360deg)'}
        ], {
            duration: 10000,
            iterations: Infinity
        });
        cdThumbAnimation.pause();

        document.onscroll = () => {
            const scrollTop = document.documentElement.scrollTop;
            const newCdWidth = cdWidth - scrollTop;
            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;
            cd.style.opacity = newCdWidth / cdWidth;
        };
        
        playBtn.onclick = () => {
            if (_this.isPlaying) {
                audio.pause();
            }
            else {
                audio.play();
            }
            
        };
        audio.onplay = () => {
            _this.isPlaying = true;
            player.classList.add('playing');
            cdThumbAnimation.play();
        };
        audio.onpause = () => {
            _this.isPlaying = false;
            player.classList.remove('playing');
            cdThumbAnimation.pause();
        };
        audio.ontimeupdate = () => {
            const progressPersen = Math.floor(audio.currentTime / audio.duration * 100);
            progress.value = progressPersen;
        };
        progress.onchange = (e) => {
            const seekTime = audio.duration * e.target.value / 100;
            audio.currentTime = seekTime;
        };
        nextBtn.onclick = () => {
            if (_this.isRandom) {
                _this.playRandomSong();
            }
            else {
                _this.nextSong();
            }
            audio.play();
            _this.render();
            _this.scrollActiveSong();
        };
        prevBtn.onclick = () => {
            if (_this.isRandom) {
                _this.playRandomSong();
            }
            else {
                _this.prevSong();
            }
            audio.play();
            _this.render();
            _this.scrollActiveSong();
        };
        randomBtn.onclick = () => {
            _this.isRandom = !_this.isRandom;
            _this.setConfig('isRandom', _this.isRandom);
            randomBtn.classList.toggle('active', _this.isRandom);
        };
        repeatBtn.onclick = () => {
            _this.isRepeat =!_this.isRepeat;
            _this.setConfig('isRepeat', _this.isRepeat);
            repeatBtn.classList.toggle('active', _this.isRepeat);
        };
        audio.onended = () => {
            if (this.isRepeat) {
                audio.play();
            }
            else {
                nextBtn.click();
            }
        };
        playList.onclick = (e) => {
            const songNode = e.target.closest('.song:not(.active)');
            const optionNode = e.target.closest('.option');
            if (songNode || optionNode) {
                if (songNode) {
                    _this.currentIndex = Number(songNode.dataset.index);
                    _this.loadCurrentSong();
                    _this.render();
                    audio.play();
                };


                if (optionNode) {
                    //click on option button
                };
            }
        };
    },
    scrollActiveSong: function () {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block:'center',
                inline:'center'
            });
        }, 300);
    },
    loadCurrentSong: function() {

        heading.textContent = this.currentSong.name;
        imageCD.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;
    },
    loadConfig: function() {
        this.isRandom = this.config.isRandom;
        this.isRepeat = this.config.isRepeat;
        randomBtn.classList.toggle('active', this.isRandom);
        repeatBtn.classList.toggle('active', this.isRepeat);
    },
    nextSong: function() {
        this.currentIndex++;
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        };
        this.loadCurrentSong();
    },
    prevSong: function() {
        this.currentIndex--;
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1;
        };
        this.loadCurrentSong();
    },
    playRandomSong: function() {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.songs.length);
        } while (newIndex == this.currentIndex)
        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },

    start: function() {
        this.loadConfig();

        this.defineProperties();
        
        this.handleEvent();

        this.loadCurrentSong();

        this.render();
    }

};
app.start();