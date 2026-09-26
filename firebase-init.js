// Firebase 초기화 + 점수 저장/불러오기 공용 함수
const firebaseConfig = {
    apiKey: "AIzaSyA500e9UOrK_zIrd742ooHu20zhFtlLRt4",
    authDomain: "nanagameforever.firebaseapp.com",
    projectId: "nanagameforever",
    storageBucket: "nanagameforever.firebasestorage.app",
    messagingSenderId: "209418621167",
    appId: "1:209418621167:web:8af88a285216cdd1c88b1a",
    measurementId: "G-WSER596XEK"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

function getPlayerName() {
    try {
        let name = localStorage.getItem('sciencePlayerName_v2');
        if (!name) {
            name = prompt('이름(별명)을 입력해줘! 랭킹에 표시돼 🏆') || '';
            name = name.trim();
            if (!name) name = '익명';
            localStorage.setItem('sciencePlayerName_v2', name);
        }
        return name;
    } catch (e) {
        return '익명';
    }
}

function registerPlayer(name) {
    try {
        if (!name) return;
        db.collection('players').doc(name).set({
            name: name,
            lastSeen: firebase.firestore.FieldValue.serverTimestamp()
        }, { merge: true }).catch(e => console.log('플레이어 등록 실패:', e));
    } catch (e) {
        console.log('플레이어 등록 실패:', e);
    }
}

function submitScore(quizFile, quizTitle, correct, total) {
    try {
        const name = getPlayerName();
        db.collection('scores').add({
            name: name,
            quizFile: quizFile,
            quizTitle: quizTitle,
            correct: correct,
            total: total,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        }).catch(e => console.log('점수 저장 실패:', e));
    } catch (e) {
        console.log('점수 저장 실패:', e);
    }
}
