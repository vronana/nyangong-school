// 페이지를 이동해도 배경음악이 최대한 자연스럽게 이어지도록 도와주는 공용 스크립트
(function () {
    const STORAGE_KEY = 'scienceBgmState_v1';

    function saveBgmState(audio) {
        try {
            if (!audio) return;
            sessionStorage.setItem(STORAGE_KEY, JSON.stringify({
                time: audio.currentTime || 0,
                playing: !audio.paused
            }));
        } catch (e) {}
    }

    function loadBgmState() {
        try {
            const raw = sessionStorage.getItem(STORAGE_KEY);
            return raw ? JSON.parse(raw) : null;
        } catch (e) { return null; }
    }

    // 페이지 로드 시 이전 페이지에서 재생 중이었으면 같은 위치에서 바로 이어서 재생 시도.
    // 브라우저가 자동재생을 막으면, 이 페이지에서 처음 클릭하는 순간 자연스럽게 이어붙임.
    window.initBgmContinuity = function (audio) {
        if (!audio) return;

        const state = loadBgmState();
        if (state && state.playing) {
            try { audio.currentTime = state.time || 0; } catch (e) {}
            audio.play().catch(() => {
                const resumeOnce = () => {
                    audio.play().catch(() => {});
                    document.removeEventListener('click', resumeOnce);
                    document.removeEventListener('touchend', resumeOnce);
                };
                document.addEventListener('click', resumeOnce, { once: true });
                document.addEventListener('touchend', resumeOnce, { once: true });
            });
        }

        const persist = () => saveBgmState(audio);
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'hidden') persist();
        });
        window.addEventListener('pagehide', persist);
    };
})();
